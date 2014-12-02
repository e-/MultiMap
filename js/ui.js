define([
'jquery', 
'component/map',
'component/mmap',
'model/node',

'd3', 
'component/nmap', 
'component/safeBrush',
'component/treeColor'
], function($, Map, MMap, Node){
  var ui = {},
      width = $(window).width() - 380,
      height = $(window).height(),
      map,
      mmap,
      leaves = []
      ;
  
  function getLeaves(d){
    if(d.children) d.children.forEach(getLeaves);
    else leaves.push(d);
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
    mmap = new MMap(d3.select('#mmap'), width, height, leaves);

    var ref = {
      map: map,
      mmap: mmap
    };

    map.draw(ref);
    mmap.draw(ref);
  };
  
  return ui;
});
