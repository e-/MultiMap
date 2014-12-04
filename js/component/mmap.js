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
  function MMap(rootG, width, height, nodes, parent, ui, level){
    this.rootG = rootG;
    this.g = rootG.append('g');
    this.labelG = rootG.append('g');
    this.width = width;
    this.height = height;
    this.nodes = nodes;
    this.ui = ui;
    this.level = level || 0;
    this.parent = parent;
  }
    
  function translate(x, y){
    return 'translate(' + x + ',' + y + ')';
  }

  MMap.prototype = {
    draw: function(){
      var self = this;
      
      this.nmap = 
        d3.layout.nmap()
          .value(function(node){return node.data.population;})
          .width(this.width).height(this.height);
      
      if(this.parent) {
        this.titleHeight = this.height / 10;
        this.titleString = this.parent.data.name + ' - 인구';
        this.titleFontSize = util.getPrettyFontSize(this.titleString, this.width, this.titleHeight);
 
        this.title =  this.rootG.append('text').attr('transform', translate(this.width / 2, this.titleHeight / 2)).style('font-size',  this.titleFontSize + 'em').text(this.titleString).attr('class', 'label');
      }
      ;
      
      this.update();
    },
    update: function()
    {
      var self = this;
      
      if(!this.parent) { //부모없는 최상위노드이면 
      } else { //자식이면
        if(this.nodes.length > 1) {
          this.title.transition().style('opacity', 1);
          this.nmap.height(this.height - this.titleHeight);
          this.g.transition().attr('transform', translate(0, this.titleHeight));
          this.labelG.transition().attr('transform', translate(0, this.titleHeight));
          this
            .parent.rect
            .transition()
            .attr('fill', this.parent.color)
            .attr('width', this.width)
            .attr('height', this.titleHeight)
            .style('opacity', 1);
          this.parent.text.transition().attr('opacity', 0);
        } else { 
          this.title.transition().style('opacity', 0);
          this.nmap.height(this.height);
          this.g.transition().attr('transform', translate(0, 0));
          this.labelG.transition().attr('transform', translate(0, 0));
          this.parent.rect.transition().style('opacity', 0);
        }
      }

      this.nmap(this.nodes);
      var labels = 
        this.nodes.filter(function(node){
          var size = util.getPrettyFontSize(node.data.name, node.width, node.height);
          
          if(size < 0.5) return false;
          if(size > 10) size = 10;

          node.fontSize = size;
          return true;
        });

      var gs = 
      this.g
        .selectAll('g.l' + self.level)
        .data(this.nodes, Node.GetId);
      
      gs
        .enter()
          .append('g')
          .attr('transform', function(node){return translate(node.x + node.width / 2, node.y + node.height / 2);})
          .attr('class', 'l' + self.level)
          .each(function(node){
            node.g = d3.select(this);
          })
          .append('rect')
            .attr('stroke', '#aaa')
            .attr('stroke-width', 1)
            .attr('class', 'l'+this.level)
            .each(function(node){
              node.rect = d3.select(this);
            })
            .on('mouseover', function(node){
              node.isHovered = true;
              self.ui.map.updateHighlight();
              self.updateHighlight();
            })
            .on('mouseout', function(node){
              node.isHovered = false;
              self.ui.map.updateHighlight();
              self.updateHighlight();
            })
            .on('click', function(){
              self.ui.menu.hide()
            })
            .on('contextmenu', function(node){
              self.ui.menu.toggle(d3.event.offsetX, d3.event.offsetY, node, self);
              d3.event.stopPropagation();
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
      
      var rects = gs.selectAll('rect.l' + this.level);
      
      rects
        .filter(function(node){
          return !node.vis;
        })
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

      this.nodes.forEach(function(node){
        if(node.vis) {
          node.vis.update();
        }
      });
    },
    updateHighlight: function(){
      var highlighted = this.nodes.filter(Node.IsHighlighted),
          highlightedIds = highlighted.map(Node.GetId);
      
      // remove all highlight
      this.nodes.forEach(function(node){
        node.unhighlightArea();
      });
      
      //sort
      this.g.selectAll('g.l' + this.level).sort(function (a, b){
        if(highlightedIds.indexOf(a.id) >= 0) return 1;
        return -1;
      });
        
      highlighted.forEach(function(node){
        node.highlightArea();
      });

      this.nodes.forEach(function(node){
        if(node.vis)
          node.vis.updateHighlight();
      });
    },
    drillDown: function(node){
      var canDrillDown = false;
      if(node.children.length)
        canDrillDown = true;
      
      if(!canDrillDown) return;

      var self = this;
      util.removeA(this.nodes, node);
      node.children.forEach(function(child){
        self.nodes.push(child);
      });
      this.update();
    },
    drillUp: function(node){
      var self = this;
      
      if(!node.parent) return;
      
      var canDrillUp = true, deathNote = [];
      node.parent.children.forEach(function(child){ //child가 독립적으로 존재해야함
        var found = false;
        self.nodes.forEach(function(node){
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
          util.removeA(self.nodes, victim);
        });
        self.nodes.push(node.parent);
        this.update();
      }
    }
  };

  return MMap;
});
