define([
'jquery', 
'component/map',

'model/node',

'd3', 
'component/nmap', 
'component/safeBrush',
'component/treeColor'
], function($, Map, Node){
  var ui = {},
      width = $(window).width() - 380,
      height = $(window).height(),
      map,
      playground = d3.select('#playground').attr('width', width).attr('height', height),
      leaves = []
      ;
  
  function getLeaves(d){
    if(d.children) d.children.forEach(getLeaves);
    else leaves.push(d);
  }
  
  function highlightMap(leaf){
    map.selectAll('g').sort(function (a, b){
      if(a.id == leaf.id) return 1;
      return -1;
    });
    leaf.map.selectAll('path').attr('fill', leaf.color.darker(0.8)).attr('stroke', leaf.color.darker(3)).attr('stroke-width', 3);
  }

  function unhighlightMap(leaf){
    leaf.map.selectAll('path').attr('fill', leaf.color).attr('stroke', '#aaa').attr('stroke-width', 1);
  }
  
  function highlightArea(leaf){
    playground.select('#rects').selectAll('rect').sort(function (a, b){
      if(a.id == leaf.id) return 1;
      return -1;
    });
    leaf.area.attr('fill', leaf.color.darker(0.8)).attr('stroke', leaf.color.darker(3)).attr('stroke-width', 3);
  }

  function unhighlightArea(leaf){
    leaf.area.attr('fill', leaf.color).attr('stroke', '#aaa').attr('stroke-width', 1);
  }
  
  function highlightAll(leaves){
    map.selectAll('g').sort(function (a, b){
      if(leaves.indexOf(a) >= 0) return 1;
      return -1;
    });
    leaves.forEach(function(leaf) {
      leaf.map.selectAll('path').attr('fill', leaf.color.darker(0.8)).attr('stroke', leaf.color.darker(3)).attr('stroke-width', 3);
    });
    
    playground.select('#rects').selectAll('rect').sort(function (a, b){
      if(leaves.indexOf(a) >= 0) return 1;
      return -1;
    });
    leaves.forEach(function(leaf) {
      leaf.area.attr('fill', leaf.color.darker(0.8)).attr('stroke', leaf.color.darker(3)).attr('stroke-width', 3);
    });
  }

  
  function buildTree(data, level){
    var root = new Node(data, level);
    
    if(data.children) {
      data.children.forEach(function(child){
        root.addChild(buildTree(child, level + 1));
      });
    }

    return root;
  }

  ui.initialize = function(data){
    var root = buildTree(data, 0);

    leaves = root.getLeaves();

    var treeColor = d3.treeColor();
    treeColor(root);

    map = new Map(d3.select('#map'), 350, 500, leaves);
    map.draw();

    var nmap = d3.layout.nmap().value(function(node){return node.data.population;}).width(width).height(height);
    
    function translate(x, y){
      return 'translate(' + x + ',' + y + ')';
    }
    
    nmap(leaves);
    
    playground
      .append('g')
      .attr('id', 'rects')
      .selectAll('rect')
      .data(leaves)
      .enter()
      .append('rect')
        .attr('width', function(leaf){return leaf.dx;})
        .attr('height', function(leaf){return leaf.dy;})
        .attr('fill', function(leaf){return leaf.color;})
        .attr('transform', function(leaf){return translate(leaf.x, leaf.y);})
        .attr('stroke', '#aaa')
        .attr('stroke-width', 1)
        .each(function(leaf){
          leaf.area = d3.select(this);
        })
        .on('mouseover', function(leaf){
          highlightMap(leaf);
          highlightArea(leaf);
        })
        .on('mouseout', function(leaf){
          unhighlightMap(leaf);
          unhighlightArea(leaf);
        })
    ;

    var brush = 
          d3.svg.safeBrush()
            .x(d3.scale.linear().domain([0, width]).range([0, width]))
            .y(d3.scale.linear().domain([0, height]).range([0, height]))
            .on('brush', brushed)
        ;
    playground.call(brush);

    function isPointContainedInBox(x, y, startX, startY, endX, endY) {
      return startX <= x && x <= endX && startY <= y && y <= endY;
    }

    function isLeafContainedInBox(leaf, startX, startY, endX, endY) {
      return !(leaf.y + leaf.dy < startY || 
               leaf.y > endY ||
               leaf.x + leaf.dx < startX ||
               leaf.x > endX);
    }

    function brushed(startX, startY, endX, endY){
      var highlightLeaves = [];
      leaves.forEach(function(leaf){
        if(isLeafContainedInBox(leaf, startX, startY, endX, endY)) {
          highlightLeaves.push(leaf);
        }
        unhighlightMap(leaf);
        unhighlightArea(leaf);
      });

      highlightAll(highlightLeaves);
    }


  };
  
  return ui;
});
