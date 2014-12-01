define(['jquery', 'd3', 'nmap'], function($){
  var ui = {},
      map = d3.select('#map').attr('width', 350).attr('height', 500).append('g'),
      width = $(window).width() - 380,
      height = $(window).height(),
      playground = d3.select('#playground').attr('width', width).attr('height', height),
      leaves = []
      ;
  
  function getLeaves(d){
    if(d.children) d.children.forEach(getLeaves);
    else leaves.push(d);
  }
  
  function assignLevel(data, level){
    data.level = level;
    if(data.children) data.children.forEach(function(child){assignLevel(child, level + 1);});
  }

  function permutate(ranges){
    var n = ranges.length,
        m = Math.ceil(Math.sqrt(n)),
        arr = new Array(n * n);

    ranges.forEach(function(range, i){
      var row = Math.floor(i / m),
          col = i % m;

      arr[col * m + row] = range;
    });

    return arr.filter(function(range){return range;});
  }

  function assignColors(data, range){
    data.color = d3.hcl((range[0] + range[1]) / 2, 50 - 5 * data.level, 75 + 5 * data.level);

    if(data.level == 0)
      data.color = '#aaa';
    
    if(!data.children) return;

    var 
        n = data.children.length,
        delta = (range[1] - range[0]) / n,
        padding = delta > 0 ? .25 : -.25, 
        ranges = []
        ;
    d3.range(n).forEach(function(i){
      ranges.push([range[0] + delta * i + padding * delta, range[0] + delta * (i + 1) - padding * delta]);
    });
    ranges = permutate(ranges);
    data.children.forEach(function(child, i){
      assignColors(child, (i % 2 == 0 ? ranges[i] : [ranges[i][1], ranges[i][0]]));
    });
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
    playground.selectAll('rect').sort(function (a, b){
      if(a.id == leaf.id) return 1;
      return -1;
    });
    leaf.area.attr('fill', leaf.color.darker(0.8)).attr('stroke', leaf.color.darker(3)).attr('stroke-width', 3);
  }

  function unhighlightArea(leaf){
    leaf.area.attr('fill', leaf.color).attr('stroke', '#aaa').attr('stroke-width', 1);
  }

  function drawMap(){
    map
      .attr('transform', 'scale(0.7)')
    ;
    
    var leaveG = 
    map
      .selectAll('g')
      .data(leaves)
      .enter()
        .append('g')
        .on('mouseover', function(leaf){
          highlightArea(leaf);
          highlightMap(leaf);
        })
        .on('mouseout', function(leaf){
          unhighlightArea(leaf);
          unhighlightMap(leaf);
        })
    ;
    leaveG
        .selectAll('path')
        .data(function(leaf){
          return leaf.d.map(function(d){return [d, leaf.color];})
        })
        .enter()
          .append('path')
            .attr('d', function(d){return d[0];})
            .attr('fill', function(d){return d[1];})
            .attr('stroke', '#aaa')
            .attr('stroke-width', 1)
    
    leaveG.each(function(leaf){
      var bbox = this.getBBox();
      
      leaf.ix = bbox.x + bbox.width / 2;
      leaf.iy = bbox.y + bbox.height / 2;
      leaf.map = d3.select(this);
    });
  }

  ui.initialize = function(data){
    getLeaves(data);
    assignLevel(data, 0);
    assignColors(data, [0, 360]);
    drawMap();
    
    var nmap = d3.layout.nmap().value(function(node){return node.population;}).width(width).height(height);
    
    function translate(x, y){
      return 'translate(' + x + ',' + y + ')';
    }
    
    nmap(leaves);
    playground
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
  };
  
  return ui;
});
