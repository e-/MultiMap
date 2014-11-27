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

requirejs(['jquery', 'd3'
], function($
){
  
  d3.json('data/data.json', function(data){
    var svg = d3.select('body').append('svg').attr('width', 1000).attr('height', 1000);
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
      leaf.d.forEach(function(d){
        svg.append('path').attr('d', d).attr('fill', color(leaf.popRatio)).attr('stroke', '#aaa').attr('stroke-width', 1);
      });
    });

  });
});
