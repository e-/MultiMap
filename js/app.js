requirejs.config({
  baseUrl: 'js',
//  packages: ['model', 'visualizer/view', 'adapter', 'backend', 'dev'],
  paths: {
    jquery: 'lib/jquery-2.1.1.min',
    d3: 'lib/d3.min',
    bootstrap: 'lib/bootstrap.min',
    config: '../config'
  },
  shim: {
    bootstrap: {
        deps: ['jquery']
    }
  }
});

requirejs(['jquery', 'd3', 'nmap'
], function($
){
  
  d3.json('data/data.json', function(data){
    var svg = d3.select('body').append('svg').attr('width', 1900).attr('height', 1000);
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
    
    g.attr('transform', translate(600, 100));
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
  });
});
