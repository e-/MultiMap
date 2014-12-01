define(['jquery', 'd3'], function($){
  var ui = {},
      map = d3.select('#map').attr('width', 350).attr('height', 500).append('g'),
      leaves = []
      ;
  
  function getLeaves(d){
    if(d.children) d.children.forEach(getLeaves);
    else leaves.push(d);
  }

  function drawMap(){
    map
      .attr('transform', 'scale(0.7)')
    ;

    map
      .selectAll('g')
      .data(leaves)
      .enter()
        .append('g')
        .selectAll('path')
        .data(function(leaf){return leaf.d})
        .enter()
          .append('path')
            .attr('d', function(d){return d;})
            .attr('fill', 'transparent')
            .attr('stroke', '#aaa')
            .attr('stroke-width', 1)
    ;
    return;
    leaves.forEach(function(leaf){
      leaf.paths = [];

      leaf.d.forEach(function(d){
        var path = map.append('path').attr('d', d).attr('fill', color(leaf.popRatio)).attr('stroke', '#aaa').attr('stroke-width', 1);
        
        leaf.areas.push(path);
      });
    });
  }

  ui.initialize = function(data){
    getLeaves(data);
    drawMap();
  };
/*
  var svg = d3.select('body').append('svg').attr('width', 1800).attr('height', 1000);
    var leaves = [];
   
    function draw(d){
      if(d.children) {
        d.children.forEach(draw);
      } else {
        leaves.push(d);
      }
    }

    draw(data);

    var domain = d3.extent(leaves, function(leaf){return leaf.popRatio;}),
        color = d3.scale.linear().domain([domain[0], 100, domain[1]]).range(['#67a9cf', '#f7f7f7', '#ef8a62']);
  
    leaves.forEach(function(leaf){
      leaf.areas = [];

      leaf.d.forEach(function(d){
        var path = svg.append('path').attr('d', d).attr('fill', color(leaf.popRatio)).attr('stroke', '#aaa').attr('stroke-width', 1);
        
        leaf.areas.push(path);
      });
    });

    var nmap = d3.layout.nmap().value(function(node){return node.size;}).width(500).height(500);
    var g = svg.append('g');

    var pattern = /M([\d|\.]*),([\d|\.]*)/,
        pattern2 = /l([-|\d|\.]*),([-|\d|\.]*)/g
    ;

    leaves.forEach(function(leaf){
      var element = leaf.areas[0].node(),
          bbox = element.getBBox();

      leaf.ix = bbox.x + bbox.width / 2;
      leaf.iy = bbox.y + bbox.height / 2;
    });
    
    function translate(x, y){
      return 'translate(' + x + ',' + y + ')';
    }
    
    g.attr('transform', translate(600, 20));
    nmap(leaves);
    g
      .selectAll('rect')
      .data(leaves)
      .enter()
      .append('rect')
        .attr('width', function(leaf){return leaf.dx;})
        .attr('height', function(leaf){return leaf.dy;})
        .attr('fill', function(leaf){return color(leaf.popRatio)})
        .attr('transform', function(leaf){return translate(leaf.x, leaf.y);})
        .attr('stroke', '#aaa')
        .attr('stroke-width', 1)
        .on('mouseover', function(leaf){
          leaf.areas.forEach(function(path){
            path.attr('fill', '#666');
          });
          console.log(leaf.name, leaf.size);
        })
        .on('mouseout', function(leaf){
          leaf.areas.forEach(function(path){
            path.attr('fill', color(leaf.popRatio));
          });
        });


    ;

*/
  return ui;
});
