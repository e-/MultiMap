define(['util', 'model/node', 'd3'], function(util, Node){
  function GeoHeatmap(rootG, width, height, nodes, parent, ui, level, attr){
    this.rootG = rootG;
    this.g = rootG.append('g');
    this.background = 
        this.g.append('rect').attr('fill', 'white').attr('stroke', '#aaa');
    this.mapG = this.g.append('g').attr('opacity', 0);
    this.width = width;
    this.height = height;
    this.nodes = nodes;
    this.ui = ui;
    this.level = level || 0;
    this.parent = parent;
    this.attr = attr;
    this.leaves = this.parent.getLeaves();

  }

  function translate(x, y){
    return 'translate(' + x + ',' + y + ')';
  }
 
  GeoHeatmap.prototype = {
    draw: function(){
      var self = this;

      var values = this.leaves.map(function(leaf){return leaf.data[self.attr.name];});

      this.colorScale = d3.scale.linear()
        .domain([
          d3.min(values),
          100,
          d3.max(values)
        ])
        .range(['#0571b0', '#f7f7f7', '#ca0020'])

      
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

      var 
          minX = 9999999,
          minY = 9999999,
          maxX = 0,
          maxY = 0;

      this.gs = 
        this.mapG
          .selectAll('g')
            .data(this.leaves)
      
      this.gs
        .enter()
          .append('g')
            .each(function(d){
              d.geoHeatmapG = d3.select(this);
            })
            .selectAll('path')
            .data(function(node){
              return node.data.d.map(function(d){return [d, self.colorScale(node.data[self.attr.name]), node]});
            })
            .enter()
            .append('path')
              .attr('d', function(d){return d[0];})
              .attr('fill', function(d){return d[1]})
              .attr('stroke', '#aaa')
              .on('mouseover', function(d){
                d[2].isHovered = true;
                self.ui.map.updateHighlight();
                self.updateHighlight();
                self.ui.detail.show(d[2]);
              })
              .on('mouseout', function(d){
                d[2].isHovered = false;
                self.ui.map.updateHighlight();
                self.updateHighlight();
                self.ui.detail.empty();
              })
      
      this.gs
        .selectAll('path')
        .each(function(){
          var bbox = this.getBBox();
          if(bbox.x < minX) minX = bbox.x;
          if(bbox.y < minY) minY = bbox.y;
          if(bbox.x + bbox.width > maxX) maxX = bbox.x + bbox.width;
          if(bbox.y + bbox.height > maxY) maxY = bbox.y + bbox.height;
        });
     
      var mapWidth = maxX - minX,
          mapHeight = maxY - minY,
          scale = Math.min(actualWidth / mapWidth, actualHeight / mapHeight) * 0.9,
          marginTop = (actualHeight - mapHeight * scale) / 2,
          marginLeft = (actualWidth - mapWidth * scale) / 2;

      if(!this.mapG.attr('transform'))
        this.mapG
          .attr('transform', translate(marginLeft, marginTop) + 'scale('+scale+')' + translate(-minX, -minY) )

      this
        .mapG
        .transition()
        .attr('transform', translate(marginLeft, marginTop) + 'scale('+scale+')' + translate(-minX, -minY) )
        .attr('opacity', 1)
      ;
      
      this.gs.exit().remove();
    },
    highlight: function(node){
      node.geoHeatmapG.selectAll('path').attr('stroke', '#333').attr('stroke-width', 1.5)
    },
    unhighlight: function(node){
      node.geoHeatmapG.selectAll('path').attr('stroke', '#aaa').attr('stroke-width', 1);
    },
    updateHighlight: function(){
      var highlighted = this.leaves.filter(Node.IsHighlighted),
          highlightedIds = highlighted.map(Node.GetId),
          self = this;
      
      // remove all highlight
      this.leaves.forEach(function(node){
        self.unhighlight(node);
      });
      
      //sort
      this.gs.sort(function (a, b){
        if(highlightedIds.indexOf(a.id) >= 0) return 1;
        return -1;
      });
        
      highlighted.forEach(function(node){
        self.highlight(node);
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
      this.leaves.forEach(function(leaf){
        delete leaf.geoHeatmapG;
      });
    }
  };

  return GeoHeatmap;
});
