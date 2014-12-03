define([
'jquery', 
'component/map',
'component/mmap',
//'model/nodeSet',
'model/node',
'util',

'd3', 
'component/nmap', 
'component/safeBrush',
'component/treeColor'
], function($, Map, MMap, 
/*NodeSet,*/
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
    
    visibleNodes = root.getNodesAtLevel(1); //.map(function(node){return new NodeSet([node]);});
    map = new Map(d3.select('#map'), 350, 500, root, visibleNodes, leaves);
    mmap = new MMap(d3.select('#mmap'), width, height, root, visibleNodes);

    var ref = {
      map: map,
      mmap: mmap
    };

    map.draw(ref);
    
    // ix, iy update
    //visibleNodes.forEach(function(node){node.update();});
    mmap.draw(ref);

/*    util.getExactTextSize('가', 1);
    util.getExactTextSize('-', 1);
    util.getExactTextSize('- -', 1);
    util.getExactTextSize('-  -', 1);
    util.getExactTextSize('-  -', 1);*/
  };
  
  return ui;
});
