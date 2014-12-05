define([
'jquery', 
'component/map',
'chart',
'model/node',
'util',

'd3', 
'component/nmap', 
'component/safeBrush',
'component/treeColor',
'component/radialMenu'
], function($, Map, Chart, 
Node, util){
  var ui = {},
      width = $(window).width() - 380,
      height = $(window).height(),
      map,
      mmap,
      leaves = [],
      visibleNodes = [],
      $popover = $('#popover')
      ;
  //0: MMAp 
  //1: Geo 
  //2: Pie
  //3: Line 
  //4: Horizon 
  //5: Pc

  Node.Attributes[0].charts = [
    Chart.Types[0],
    Chart.Types[2]
  ];
  
  Node.Attributes[1].charts = [
    Chart.Types[0],
    Chart.Types[2]
  ];

  Node.Attributes[2].charts = [
    Chart.Types[1]
  ];

  Node.Attributes[3].charts = [
    Chart.Types[3],
    Chart.Types[4]
  ];

  Node.Attributes[4].charts = [
    Chart.Types[5]
  ];

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
    
    visibleNodes = root.getNodesAtLevel(0); //.map(function(node){return new NodeSet([node]);});

    var brush = 
          d3.svg.safeBrush()
            .x(d3.scale.linear().domain([0, this.width]).range([0, this.width]))
            .y(d3.scale.linear().domain([0, this.height]).range([0, this.height]))
            .on('brush', brushed)
        ;
      
    d3.select('#mmap').attr('width', width).attr('height', height).call(brush);

    function isNodeSetContainedInBox(node, startX, startY, endX, endY) {
      return !(node.y + node.height < startY || 
               node.y > endY ||
               node.x + node.width < startX ||
               node.x > endX);
    }

    function brushed(startX, startY, endX, endY){
      return;
      var dirty = false;

      visibleNodes.forEach(function(node){
        if(isNodeSetContainedInBox(node, startX, startY, endX, endY)) {
          if(!node.isSelected) dirty = true;
          node.isSelected = true;
        } else {
          if(node.isSelected) dirty = true;
          node.isSelected = false;
        }
      });

      if(dirty) {
        ui.map.updateHighlight();
        ui.mmap.updateHighlight();
      }
    }

    this.menu = d3.svg.radialMenu(function(attr, chart){
      ui.roll(attr, chart);
    });
      

    ui.map = new Map(d3.select('#map'), 350, 500, root, visibleNodes, leaves, ui);
    ui.mmap = new Chart.MMap(d3.select('#mmap'), width, height, visibleNodes, undefined, ui);
    
    this.map.draw();
    
    // ix, iy update
    //visibleNodes.forEach(function(node){node.update();});
    this.mmap.draw();

    d3.select('#mmap').call(this.menu);
    
    window.root = root;
    window.ui = ui;
   
    this.menu.node = root;
    this.menu.mmap = this.mmap;
    ui.roll(Node.Attributes[0], Chart.MMap);

    this.menu.node = root.children[0];
    this.menu.mmap = root.vis;
    ui.roll(Node.Attributes[0], Chart.MMap);

    //this.menu.show(500, 500, root, this.mmap);
  };
  
  ui.update = function(){
    ui.mmap.update();
  };

  ui.tooltip = {
    show: function(x, y, title, content){
      $popover.find('h3').html(title);
      $popover.find('.popover-content p').html(content);
      if(y < 150) {
        $popover
          .removeClass('top')
          .addClass('bottom')
          .show()
          .css('left', x - $popover.width() / 2)
          .css('top', y)
      } else {
        $popover
          .removeClass('bottom')
          .addClass('top')  
          .show()
          .css('left', x - $popover.width() / 2)
          .css('top', y - $popover.height())
      }

    },
    hide: function(){
      $popover.hide();
    }
  };
    
  ui.detail = {
    show: function(node){
      $('#city-name').html(node.data.name);
      $('#detail-population').html(util.addCommas(node.data.population));
      $('#detail-size').html(util.addCommas(
      Math.round(node.data.size / 1000000)
      ));

      $('#detail-ratio').html(
        Math.round(node.data.popRatio * 10) / 10);

      $('#detail-temperature').html(
        Math.round(d3.mean(node.data.temperature) * 10) / 10
      );

      $('#detail-car').html(util.addCommas(node.data.vehicle[0]));
      $('#detail-taxi').html(util.addCommas(node.data.vehicle[1]));
      $('#detail-bus').html(util.addCommas(node.data.vehicle[2]));
      $('#detail-truck').html(util.addCommas(node.data.vehicle[3]));
    },
    empty: function(){
      $('#city-name').html('&nbsp');
      $('#detail-population').html('');
      $('#detail-size').html('');
      $('#detail-ratio').html('');
      $('#detail-temperature').html('');
      $('#detail-car').html('');
      $('#detail-taxi').html('');
      $('#detail-bus').html('');
      $('#detail-truck').html('');
    }
  }

  ui.roll = function(attr, chart){
    var 
        self = this,
        node = ui.menu.node
    ; 

    // attr & layout change

    if(node.vis) { 
      node.vis.remove('grace');
      delete node.vis;
      function dd(node){
        if(!node.children.length)return;
        node.children.forEach(function(child){
          if(child.vis) {
            child.vis.remove('grace');
            delete child.vis;
            dd(child);
          }
        });
      }
      dd(node);
    }
    
    node.vis = new chart(
      node.g.append('g'), 
      node.width, 
      node.height, 
      node.children.slice(0), 
      node,
      ui, 
      ui.menu.mmap.level + 1,
      attr);

    node.vis.draw();
    
    ui.mmap.updateHighlight();
    ui.map.updateHighlight();
//    ui.mmap.update();
  }

  
  return ui;
});
