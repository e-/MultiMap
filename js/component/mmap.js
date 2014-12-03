define([
'jquery', 
'model/node', 
'model/nodeSet', 
'util',
'd3', 
'component/nmap', 
'component/safeBrush',
'component/radialMenu'
], function($, Node, NodeSet, util){
  function MMap(svg, width, height, root, visibleNodes){
    this.svg = svg;
    this.g = svg.append('g');
    this.labelG = svg.append('g');
    this.width = width;
    this.height = height;
    this.root = root;
    this.visibleNodes = visibleNodes;
  }
    
  function translate(x, y){
    return 'translate(' + x + ',' + y + ')';
  }

  var _ref,
      nmap,
      timer,
      clicks = 0;


  MMap.prototype = {
    draw: function(ref){
      if(!ref) ref = _ref;
      else _ref = ref;

      var self = this;

      this.svg.attr('width', this.width).attr('height', this.height);
      nmap = 
        d3.layout.nmap()
          .value(function(node){return node.population;})
          .width(this.width).height(this.height);
      
      var brush = 
            d3.svg.safeBrush()
              .x(d3.scale.linear().domain([0, this.width]).range([0, this.width]))
              .y(d3.scale.linear().domain([0, this.height]).range([0, this.height]))
              .on('brush', brushed)
          ;
      
      this.svg.call(brush);

      function isNodeSetContainedInBox(nodeSet, startX, startY, endX, endY) {
        return !(nodeSet.y + nodeSet.height < startY || 
                 nodeSet.y > endY ||
                 nodeSet.x + nodeSet.width < startX ||
                 nodeSet.x > endX);
      }

      function brushed(startX, startY, endX, endY){
        var dirty = false;

        self.visibleNodes.forEach(function(nodeSet){
          if(isNodeSetContainedInBox(nodeSet, startX, startY, endX, endY)) {
            if(!nodeSet.isSelected) dirty = true;
            nodeSet.isSelected = true;
          } else {
            if(nodeSet.isSelected) dirty = true;
            nodeSet.isSelected = false;
          }
        });

        if(dirty) {
          ref.map.updateHighlight();
          self.updateHighlight();
        }
      }
      
      this.menu = d3.svg.radialMenu();
      
      this.svg.call(this.menu);

      this.update(ref);
    },
    update: function(ref)
    {
      var self = this;
      if(!ref) ref = _ref;
      else _ref = ref;
      nmap(this.visibleNodes);
      var labels = 
        this.visibleNodes.filter(function(node){
          var size = util.getPrettyFontSize(node.name, node.width, node.height);
          
          if(size < 0.5) return false;
          if(size > 10) size = 10;

          node.fontSize = size;
          return true;
        });

      var rects = 
      this.g
        .selectAll('rect')
        .data(this.visibleNodes, NodeSet.getId);
      
      var texts = 
        this.labelG.selectAll('text').data(labels, NodeSet.getId);

      rects
        .enter()
        .append('rect')
        .attr('stroke', '#aaa')
        .attr('stroke-width', 1)
        .each(function(nodeSet){
          nodeSet.area = d3.select(this);
        })
        .on('mouseover', function(nodeSet){
          nodeSet.isHovered = true;
          ref.map.updateHighlight();
          self.updateHighlight();
        })
        .on('mouseout', function(nodeSet){
          nodeSet.isHovered = false;
          ref.map.updateHighlight();
          self.updateHighlight();
        })
        .on('click', function(){
          self.menu.hide()
        })
        .on('contextmenu', function(nodeSet){
          if(nodeSet.isSelected) {
            self.menu.toggle(event.offsetX, event.offsetY);
            event.stopPropagation();
          }
          d3.event.preventDefault();
        })
        .on('mousewheel', function(nodeSet){
          if(d3.event.wheelDelta > 0) { // in
            self.drillDown(nodeSet);
          } else {
            self.drillUp(nodeSet);
          }
        })
        .attr('width', 0)
        .attr('height', 0)
        .attr('fill', 'white')
        .attr('transform', function(nodeSet){return translate(nodeSet.x + nodeSet.width / 2, nodeSet.y + nodeSet.height / 2);})
        .attr('opacity', 0)
      
      texts
        .enter()
        .append('text')
        .text(function(d){return d.name;})
        .each(function(nodeSet){
          nodeSet.text = d3.select(this);
        })
        .attr('transform', function(nodeSet){return translate(nodeSet.x + nodeSet.width / 2, nodeSet.y + nodeSet.height / 2);})
        .attr('opacity', 0)
 

      rects
        .transition()
        .attr('width', function(nodeSet){return nodeSet.width;})
        .attr('height', function(nodeSet){return nodeSet.height;})
        .attr('fill', function(nodeSet){return nodeSet.color;})
        .attr('transform', function(nodeSet){return translate(nodeSet.x, nodeSet.y);})
        .attr('opacity', 1)
      
      texts
        .attr('font-size', function(nodeSet){
          return nodeSet.fontSize + 'em';
        })
        .transition()
        .attr('dy', function(nodeSet){
          return '0.1em'; //(nodeSet.fontSize / 10) + 'em';
        })
        .attr('transform', function(nodeSet){return translate(nodeSet.x + nodeSet.width / 2, nodeSet.y + nodeSet.height / 2);})
        .attr('opacity', 1)


      rects
        .exit()
        .remove();
      ;

      texts.exit().remove();
    },
    updateHighlight: function(){
      var highlighted = this.visibleNodes.filter(NodeSet.isHighlighted),
          highlightedIds = highlighted.map(NodeSet.getId);
      
      // remove all highlight
      this.visibleNodes.forEach(function(nodeSet){
        nodeSet.unhighlightArea();
      });
      
      //sort
      this.g.selectAll('rect').sort(function (a, b){
        if(highlightedIds.indexOf(a.id) >= 0) return 1;
        return -1;
      });
        
      highlighted.forEach(function(nodeSet){
        nodeSet.highlightArea();
      });
    },
    drillDown: function(nodeSet){
      var canDrillDown = false;
      nodeSet.nodes.forEach(function(node){
        if(node.children.length)
          canDrillDown = true;
      });
      
      if(!canDrillDown) return;

      var self = this;
      util.removeA(this.visibleNodes, nodeSet);
      nodeSet.nodes.forEach(function(node){
        node.children.forEach(function(child){
          self.visibleNodes.push(new NodeSet([child]));
        });
      });
      this.update();
    },
    drillUp: function(nodeSet){
      var self = this;
      
      if(nodeSet.nodes.length > 1) return;
      var node = nodeSet.nodes[0];
      if(!node.parent) return;
      
      var canDrillUp = true, deathNote = [];
      node.parent.children.forEach(function(child){ //child가 독립적으로 존재해야함
        var found = false;
        self.visibleNodes.forEach(function(node){
          if(node.nodes.length == 1 && node.nodes[0] == child) {
            found = true;
            deathNote.push(node);
          }
        });
        if(!found)
          canDrillUp = false;
      });

      if(canDrillUp) {
        deathNote.forEach(function(victim){
          util.removeA(self.visibleNodes, victim);
        });
        self.visibleNodes.push(new NodeSet([node.parent]));
        this.update();
      }
    }
  };

  return MMap;
});
