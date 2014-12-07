define(['util', 'model/node', 'd3'], function(util, Node){
  var dimensions = [
    'Car',
    'Taxi',
    'Bus',
    'Truck'
  ];

  function PCoordinate(rootG, width, height, nodes, parent, ui, level, attr){
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
 
  PCoordinate.prototype = {
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
      this.backgroundColor.l = 99;
      this.backgroundColor.c = 5;
      
      this.xScale = d3.scale.ordinal()
        .domain(d3.range(dimensions.length))
      
      this.yScales = [];
      this.yAxes = [];

      for(var i=0;i<4;++i){
        var ex = d3.extent(this.nodes, function(node){
              return node.data[self.attr.name][i];
        });
        this.yScales.push(
          d3.scale.linear()
            .domain(
              [
                ex[0] * 0.85,
                ex[1] * 1.05
              ]
            )
        );

        this.yAxes.push(
          d3.svg.axis().orient('left').scale(this.yScales[i]).tickSize(5,1).ticks(4)
        );
      }

      this.line = d3.svg.line();

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

      this.xScale.rangePoints([0, actualWidth], 1)
      for(var i=0;i<4;++i)
        this.yScales[i].range([actualHeight - 10, 40]);

      this.background
        .transition()
        .attr('fill', this.backgroundColor)
        .attr('width', actualWidth)
        .attr('height', actualHeight)
      
      this.dgs = this.g
          .selectAll('.dimension')
            .data(dimensions)

      var dEnter = this.dgs
            .enter()
              .append('g')
              .attr('class', 'dimension axis')

      this.dgs
        .transition()
          .attr('transform', function(_, i){
            return translate(self.xScale(i), 0)
          })
          .each(function(d, i){
            d3.select(this).call(self.yAxes[i]);
          })

      dEnter
        .append('text')
        .attr('class', 'label')
        .style('font-size', '1.7em')
        .style('alignment-baseline', 'auto')
        .attr('transform', translate(0, 30))
        .text(function(_, i){return dimensions[i];})
       
      
      this.gs = 
      this.g
        .selectAll('.node')
          .data(this.nodes)

      var nEnter =  
      this.gs
        .enter()
          .append('g')
          .attr('class', 'node')


      nEnter  
        .append('path')
          .attr('fill', 'none')
          .attr('stroke-width', '3px')
          .attr('opacity', 0.5)
          .attr('stroke', function(node){
            return node.color.darker(1.0);
          })
          .each(function(node){
            node.pcPath = d3.select(this);
          })
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

      
      this.gs.select('path')
        .transition()
          .attr('d', function(node, i){
            return self.line(dimensions.map(function(_, i){
              return [
                self.xScale(i),
                self.yScales[i](node.data[self.attr.name][i])
              ];
            }));
          })
      
      this.gs.exit().remove();
    },
    highlight: function(node){
      node.pcPath
        .attr('opacity', 0.9)
        .attr('stroke', node.color.darker(1.5))
        .attr('stroke-width', '7px')
    },
    unhighlight: function(node){
      node.pcPath
        .attr('stroke', node.color.darker(1.0))
        .attr('opacity', 0.5)
        .attr('stroke-width', '3px')
    },
    updateHighlight: function(){
      if(this.isRemoving) return;
      var highlighted = this.nodes.filter(Node.IsHighlighted),
          highlightedIds = highlighted.map(Node.GetId),
          self = this;
      
      // remove all highlight
      this.nodes.forEach(self.unhighlight);
      
      //sort
      this.gs.sort(function (a, b){
        if(highlightedIds.indexOf(a.data.id) >= 0) return 1;
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
        delete node.pcPath;
      });
    }
  };


  return PCoordinate;
});
