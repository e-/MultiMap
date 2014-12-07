define(['util', 'model/node', 'd3'], function(util, Node){
  function Line(rootG, width, height, nodes, parent, ui, level, attr){
    this.rootG = rootG;
    this.g = rootG.append('g');
    this.width = width;
    this.height = height;
    this.nodes = nodes;
    this.ui = ui;
    this.level = level || 0;
    this.parent = parent;
    this.attr = attr;
    this.isRemoving = false;
  }

  function translate(x, y){
    return 'translate(' + x + ',' + y + ')';
  }
 
  Line.prototype = {
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
      
      this.yScale = d3.scale.linear()
        .domain([
          d3.min(this.nodes, function(node){return d3.min(node.data[self.attr.name]);}),
          d3.max(this.nodes, function(node){return d3.max(node.data[self.attr.name]);})
        ])

      this.xScale = d3.scale.linear()
        .domain([0, 19])
      ;
      
      this.line = d3.svg.line()
        .interpolate('basis')
        .x(function(_, i){return self.xScale(i);})
        .y(function(d){return self.yScale(d);})

      if(this.parent) {
        this.titleString = this.parent.data.name;
        if(this.attr)
          this.titleString +=  ' - ' + this.attr.realName;
      
        this.titleHeight = this.height / 10;
        this.title = this.rootG.append('text').text(this.titleString).attr('class', 'label').attr('transform', translate(this.width / 2, this.titleHeight / 2));
      }

      this.backgroundColor = this.nodes[0].color.brighter(0);
      this.backgroundColor.l = 99;
      this.backgroundColor.c = 5;
           
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

      var marginTop = 20,
          marginLeft = 10,
          marginBottom = 20,
          marginRight = 30
      ;
      
      this.xScale.range([marginLeft, actualWidth - marginRight])
      this.yScale.range([marginTop, actualHeight - marginBottom])

      this.gs = 
      this.g
        .selectAll('g')
          .data(this.nodes, function(node){return node.id;})
      
      var gsEnter =  
      this.gs
        .enter()
          .append('g')
          .each(function(node){node.lineG = d3.select(this);});

      gsEnter
        .append('path')
          .attr('stroke', function(node){return node.color.darker(1.0);})
          .attr('stroke-width', '3px')
          .attr('opacity', 0.5)
          .attr('fill', 'none')
          .on('mouseover', function(node){
            node.isHovered = true;
            self.ui.map.updateHighlight();
            self.updateHighlight();
            self.ui.detail.show(node);
          })
          .on('mouseout', function(node){
            node.isHovered = false;
            self.ui.map.updateHighlight();
            self.updateHighlight();
            self.ui.detail.empty();
          })

      gsEnter
       .append('circle')
       .attr('stroke', function(node){return node.color.darker(1.0);})
       .attr('opacity', 0.5)
       .attr('stroke-width', '3px')
       .attr('r', 10)
       .attr('fill', function(node){return node.color;})
    
      var k = 0, n = this.nodes[0].data[self.attr.name].length;

      if(this.init) {
        this.gs.select('path')
          .transition()
          .attr('d', function(node){
            return self.line(node.data[self.attr.name]);
          })
        this.gs.select('circle')
          .transition()
          .attr('transform', function(d, i){return translate(self.xScale(n-1), self.yScale(d.data[self.attr.name][n-1]));})
      } else {


        function draw(k){
          self.gs.each(function(d){
            var e = d3.select(this);
            e.select('path')
              .attr('d', function(d){return self.line(d.data[self.attr.name].slice(0, k+1));});
            e.select('circle')
              .attr('transform', function(d, i){return translate(self.xScale(k), self.yScale(d.data[self.attr.name][k]));})
          });
        }

        d3.timer(function(){
          draw(k);
          k++;
          if(k >= n)
            return true;
        });
        this.init = true;
      }
      this.gs.exit().remove();
    },
    highlight: function(node){
      node.lineG.select('path')
        .attr('opacity', 0.9)
        .attr('stroke', node.color.darker(1.5))
        .attr('stroke-width', '7px')
      node.lineG.select('circle')
        .attr('opacity', 1)
        .attr('stroke', node.color.darker(1.5))
        .attr('stroke-width', '7px')

    },
    unhighlight: function(node){
      node.lineG
        .select('path')
        .attr('stroke', node.color.darker(1.0))
        .attr('opacity', 0.5)
        .attr('stroke-width', '3px')
      node.lineG.select('circle')
        .attr('opacity', 0.5)
        .attr('stroke', node.color.darker(1.0))
        .attr('stroke-width', '3px')

    },
    updateHighlight: function(){
      if(this.isRemoving)return;
      var highlighted = this.nodes.filter(Node.IsHighlighted),
          highlightedIds = highlighted.map(Node.GetId),
          self = this;
       
      // remove all highlight
      this.nodes.forEach(self.unhighlight);
      
      //sort
      this.gs.sort(function (a, b){
        if(highlightedIds.indexOf(a.id) >= 0) return 1;
        return -1;
      });
        
      highlighted.forEach(self.highlight);
    },
    remove: function(option){
      this.isRemoving = true;
      if(option == 'grace') {
        this.g.transition().attr('opacity', 0).remove();
        this.background.transition().attr('opacity', 0).remove();
        if(this.title)this.title.transition().attr('opacity', 0).remove();
      } else {
        this.g.remove();
        this.background.remove();
        if(this.title)this.title.remove();
      }

      this.nodes.forEach(function(node){
        delete node.lineG;
      });
    }
  };


  return Line;
});
