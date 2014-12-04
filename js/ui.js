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
      visibleNodes = []
      ;
  
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

    this.menu = d3.svg.radialMenu(function(attr){
      ui.roll(attr);
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
    ui.roll(Node.Attributes[0]);

    this.menu.node = root.children[0];
    this.menu.mmap = root.vis;
    ui.roll(Node.Attributes[3]);
    
    //this.menu.show(500, 500, root, this.mmap);
  };
  
  ui.roll = function(attr){
    var 
        self = this,
        node = ui.menu.node
    ; 

    // attr & layout change

    if(node.vis) { 
      node.vis.remove('grace');
    }
    node.vis = new (node.level > 0 ? Chart.Horizon : Chart.MMap)(
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
