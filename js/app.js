requirejs.config({
  baseUrl: 'js',
//  packages: ['model', 'visualizer/view', 'adapter', 'backend', 'dev'],
  packages: ['chart'],
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

requirejs(['jquery', 'ui', 'd3'
], function($, ui
){
  d3.json('data/data.json', function(data){
    ui.initialize(data);
  });
});
