define([
'jquery', 
'model/node', 
//'model/nodeSet', 
'util',
'd3', 
'component/nmap', 
'component/safeBrush',
'component/radialMenu'
], function($, Node, 
//NodeSet, 
util){
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
          .value(function(node){return node.data.population;})
          .width(this.width).height(this.height);
      
      var brush = 
            d3.svg.safeBrush()
              .x(d3.scale.linear().domain([0, this.width]).range([0, this.width]))
              .y(d3.scale.linear().domain([0, this.height]).range([0, this.height]))
              .on('brush', brushed)
          ;
      
      this.svg.call(brush);

     function isNodeSetContainedInBox(node, startX, startY, endX, endY) {
        return !(node.y + node.height < startY || 
                 node.y > endY ||
                 node.x + node.width < startX ||
                 node.x > endX);
      }

      function brushed(startX, startY, endX, endY){
        var dirty = false;

        self.visibleNodes.forEach(function(node){
          if(isNodeSetContainedInBox(node, startX, startY, endX, endY)) {
            if(!node.isSelected) dirty = true;
            node.isSelected = true;
          } else {
            if(node.isSelected) dirty = true;
            node.isSelected = false;
          }
        });

        if(dirty) {
          ref.map.updateHighlight();
          self.updateHighlight();
        }
      }
     
      this.menu = d3.svg.radialMenu(function(attr){
        self.roll(attr);
      });
      
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
          var size = util.getPrettyFontSize(node.data.name, node.width, node.height);
          
          if(size < 0.5) return false;
          if(size > 10) size = 10;

          node.fontSize = size;
          return true;
        });

      var gs = 
      this.g
        .selectAll('g')
        .data(this.visibleNodes, Node.GetId);
      
      gs
        .enter()
          .append('g')
          .attr('transform', function(node){return translate(node.x + node.width / 2, node.y + node.height / 2);})
          .each(function(node){
            node.g = d3.select(this);
          })
            .append('rect')
              .attr('stroke', '#aaa')
              .attr('stroke-width', 1)
              .each(function(node){
                node.area = d3.select(this);
              })
              .on('mouseover', function(node){
                node.isHovered = true;
                ref.map.updateHighlight();
                self.updateHighlight();
              })
              .on('mouseout', function(node){
                node.isHovered = false;
                ref.map.updateHighlight();
                self.updateHighlight();
              })
              .on('click', function(){
                self.menu.hide()
              })
              .on('contextmenu', function(node){
                if(node.isSelected) {
                  self.menu.toggle(event.offsetX, event.offsetY);
                  event.stopPropagation();
                }
                d3.event.preventDefault();
              })
              .on('mousewheel', function(node){
                if(d3.event.wheelDelta > 0) { // in
                  self.drillDown(node);
                } else {
                  self.drillUp(node);
                }
              })
              .attr('width', 0)
              .attr('height', 0)
              .attr('fill', 'white')

 
      gs
        .transition()
        .attr('transform', function(node){return translate(node.x, node.y);})
        .attr('opacity', 1)
      
      var rects = gs.selectAll('rect');
      
      rects
        .transition()
        .attr('width', function(node){return node.width;})
        .attr('height', function(node){return node.height;})
        .attr('fill', function(node){return node.color;})
      
      gs
        .exit()
        .remove();

      var texts = 
        this.labelG.selectAll('text').data(labels, Node.GetId);
      
      texts
        .enter()
        .append('text')
        .text(function(d){return d.data.name;})
        .each(function(node){
          node.text = d3.select(this);
        })
        .attr('transform', function(node){return translate(node.x + node.width / 2, node.y + node.height / 2);})
        .attr('opacity', 0)
 

      texts
        .attr('font-size', function(node){
          return node.fontSize + 'em';
        })
        .transition()
        .attr('dy', function(node){
          return '0.1em'; //(node.fontSize / 10) + 'em';
        })
        .attr('transform', function(node){return translate(node.x + node.width / 2, node.y + node.height / 2);})
        .attr('opacity', 1)


     ;

      texts.exit().remove();

      this.visibleNodes.forEach(function(node){
        if(node.draw) {
          node.draw();
        }
      });
    },
    updateHighlight: function(){
      var highlighted = this.visibleNodes.filter(Node.IsHighlighted),
          highlightedIds = highlighted.map(Node.GetId);
      
      // remove all highlight
      this.visibleNodes.forEach(function(node){
        node.unhighlightArea();
      });
      
      //sort
      this.g.selectAll('g').sort(function (a, b){
        if(highlightedIds.indexOf(a.id) >= 0) return 1;
        return -1;
      });
        
      highlighted.forEach(function(node){
        node.highlightArea();
      });
    },
    drillDown: function(node){
      var canDrillDown = false;
      if(node.children.length)
        canDrillDown = true;
      
      if(!canDrillDown) return;

      var self = this;
      util.removeA(this.visibleNodes, node);
      node.children.forEach(function(child){
        self.visibleNodes.push(child);
      });
      this.update();
    },
    drillUp: function(node){
      var self = this;
      
      if(!node.parent) return;
      
      var canDrillUp = true, deathNote = [];
      node.parent.children.forEach(function(child){ //child가 독립적으로 존재해야함
        var found = false;
        self.visibleNodes.forEach(function(node){
          if(child == node) {
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
        self.visibleNodes.push(node.parent);
        this.update();
      }
    },
    roll: function(attr){
      var 
          self = this,
          selection = this.visibleNodes.filter(NodeSet.isSelected)[0];
      
      selection.draw = function(){
        var nmap = d3.layout.nmap()
                     .width(selection.width)
                     .height(selection.height)
                     .value(function(node){
                       return node.nodes[0].data[attr.name];
                     });
        
        var nodes = selection.nodes[0].children.map(function(child){
          return new NodeSet([child]);
        });

        nmap(nodes);

        selection.area.remove();
        selection.text.remove();

        var rects = 
        selection.g
          .selectAll('rect')
          .data(nodes)
          .enter()
            .append('rect')
            .attr('width', 0)
            .attr('height', 0)
            .attr('transform', function(node){return translate(node.x + node.width / 2, node.y + node.height / 2);})
            .attr('fill', 'white')
            .attr('stroke', '#aaa')
            .attr('stroke-width', 1)
            .attr('opacity', 0);

        rects
          .transition()
            .attr('width', function(node){return node.width;})
            .attr('height', function(node){return node.height;})
            .attr('fill', function(node){return node.color;})
            .attr('transform', function(node){return translate(node.x, node.y);})
            .attr('opacity', 1)
      };
      
      this.update();
    }
  };

  return MMap;
});
