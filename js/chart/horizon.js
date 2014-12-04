define(['util', 'model/node', 'd3', 'lib/horizon'], function(util, Node){
  function Horizon(rootG, width, height, nodes, parent, ui, level, attr){
    this.rootG = rootG;
    this.g = rootG.append('g');
    this.width = width;
    this.height = height;
    this.nodes = nodes;
    this.ui = ui;
    this.level = level || 0;
    this.parent = parent;
    this.attr = attr;
  }

  function translate(x, y){
    return 'translate(' + x + ',' + y + ')';
  }
 
  Horizon.prototype = {
    draw: function(){
      var self = this;

      this.background = 
        this.g.append('rect').attr('fill', 'white').attr('stroke', '#aaa');
      
      this.g.on('mousewheel', function(){
        d3.event.stopPropagation();
        self.remove('grace');
        delete self.parent.vis;

        self.ui.mmap.update();
      });

      if(this.parent) {
        this.titleString = this.parent.data.name;
        if(this.attr)
          this.titleString +=  ' - ' + this.attr.realName;
      
        this.titleHeight = this.height / 10;
        this.title = this.rootG.append('text').text(this.titleString).attr('class', 'label').attr('transform', translate(this.width / 2, this.titleHeight / 2));
      }

      this.backgroundColor = this.nodes[0].color.brighter(0);
      this.backgroundColor.l = 100;
      this.backgroundColor.c = 15;
           
      this.horizon = d3.horizon().bands(5).mode('offset').interpolate('basis').colors(['#0571b0', '#f7f7f7', '#f7f7f7', '#ca0020'])
      this.mean = d3.mean(
        this.nodes.map(function(node){
          return d3.mean(node.data[self.attr.name]);
        })
      );
      this.data = 
        this.nodes.map(function(node){
          return node.data[self.attr.name].map(function(value, i){
            return [i, value - self.mean]
          });
        });

      this.update();        
    },
    update: function(){
      var self = this,  
          actualHeight = this.height,
          actualWidth = this.width
          ;

      if(!this.parent) { //부모없는 최상위노드이면 
      } else { //자식이면
        this.width = this.parent.width;
        actualWidth = this.width;
        this.height = this.parent.height;
        this.titleHeight = this.height / 10;
        this.titleFontSize = util.getPrettyFontSize(this.titleString, this.width, this.titleHeight);
        this.title
          .style('font-size',  this.titleFontSize + 'em');

        // 타이틀 필요여부 강원도의 경우 자식이 하나라 항상 타이틀이 필요없음. 혹은 대한민국
        if(this.nodes.length > 1) {
          this.title.transition().attr('opacity', 1).attr('transform', translate(this.width / 2, this.titleHeight / 2));
          this.g.transition().attr('transform', translate(0, this.titleHeight));
          this
            .parent.rect
            .transition()
            .attr('fill', this.parent.color)
            .attr('width', this.width)
            .attr('height', this.titleHeight)
            .attr('opacity', 1);
          this.parent.text.transition().attr('opacity', 0);
          actualHeight = this.height - this.titleHeight;
        } else { 
          this.title.transition().attr('opacity', 0).attr('transform', translate(this.width / 2, this.titleHeight / 2));
          this.g.transition().attr('transform', translate(0, 0));
          this.parent.rect.transition().attr('opacity', 0);
          this.parent.text.transition().attr('opacity', 0);
          actualHeight = this.height;
        }
      }
      
      this.background
        .transition()
        .attr('fill', this.backgroundColor)
        .attr('width', actualWidth)
        .attr('height', actualHeight)

      this.gs = 
      this.g
          .selectAll('g')
          .data(this.data)
  
      this.horizon.width(actualWidth).height(actualHeight/  10);
      this.gs.enter().append('g')
      
      this.gs
        .transition()
        .attr('transform', function(_, i){return translate(0, i * 30);})
        .call(this.horizon);

/*      var gsEnter =  
      this.gs
        .enter()
          .append('g')

      gsEnter
        .append('path')
         .attr('fill', function(node){return node.data.color;})
         .attr('stroke', this.nodes[0].color.darker(7))
         .attr('opacity', 0)
         .on('mouseover', function(d){
           d.data.isHovered = true;
           self.ui.map.updateHighlight();
           self.updateHighlight();
         })
         .on('mouseout', function(d){
           d.data.isHovered = false;
           self.ui.map.updateHighlight();
           self.updateHighlight();
         })
         .each(function(d){
           d.data.arc = d3.select(this);
         })

      ;

      gsEnter
          .filter(function(d){
            return d.endAngle - d.startAngle > .2;
          })
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('class', 'label')
        .text(function(d){return d.data.data.name;});
      
      this.gs
        .transition()
        .attr('transform', translate(actualWidth / 2, actualHeight / 2));

      this.gs.select('path')
        .transition()
        .attr('d', this.arc)
        .attr('opacity', 1)
      
      this.gs.select('text')
        .style('font-size', fontSize + 'em')
        .transition()
        .attr('transform', function(d){
          var center = self.arc.centroid(d);

          return translate(center[0] * 1.2, center[1] * 1.2) + 'rotate(' + angle(d) + ')';
        })

      this.gs.exit().remove();*/
    },
    updateHighlight: function(){
      return;
      var highlighted = this.nodes.filter(Node.IsHighlighted),
          highlightedIds = highlighted.map(Node.GetId);
      
      // remove all highlight
      this.nodes.forEach(function(node){
        node.unhighlightElement(node.arc);
      });
      
      //sort
      this.gs.sort(function (a, b){
        if(highlightedIds.indexOf(a.data.id) >= 0) return 1;
        return -1;
      });
        
      highlighted.forEach(function(node){
        node.highlightElement(node.arc);
      });
    },
    remove: function(option){
      if(option == 'grace') {
        this.g.transition().attr('opacity', 0).remove();
        this.background.transition().attr('opacity', 0).remove();
        if(this.title)this.title.transition().attr('opacity', 0).remove();
      } else {
        this.g.remove();
        this.background.remove();
        if(this.title)this.title.remove();
      }
      delete this.horizon;
      delete this.data;

      this.nodes.forEach(function(node){
        delete node.arc;
      });
    }
  };

  return Horizon;
});
