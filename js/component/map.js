define(['model/node', 'd3'], function(Node){
  function Map(svg, width, height, leaves){
    this.svg = svg;
    this.g = svg.append('g');
    this.width = width;
    this.height = height;
    this.leaves = leaves;
  }
  Map.prototype = {
    draw: function(ref){
      var self = this;
      
      this.svg.attr('width', this.width).attr('height', this.height);
      this.g.attr('transform', 'scale(0.7)');
    
      var leaveG = 
        this.g
        .selectAll('g')
        .data(this.leaves)
        .enter()
          .append('g')
          .on('mouseover', function(leaf){
            leaf.isHovered = true;
            ref.mmap.updateHighlight();
            self.updateHighlight();
          })
          .on('mouseout', function(leaf){
            leaf.isHovered = false;
            ref.mmap.updateHighlight();
            self.updateHighlight();
          })
      ;

      leaveG
        .selectAll('path')
        .data(function(leaf){
          return leaf.data.d.map(function(d){return [d, leaf.color];})
        })
        .enter()
          .append('path')
            .attr('d', function(d){return d[0];})
            .attr('fill', function(d){return d[1];})
            .attr('stroke', '#aaa')
            .attr('stroke-width', 1)
      
      leaveG.each(function(leaf){
        var bbox = this.getBBox();
        
        leaf.ix = bbox.x + bbox.width / 2;
        leaf.iy = bbox.y + bbox.height / 2;
        leaf.mapG = d3.select(this);
      });
    },
    updateHighlight: function(){
      var highlighted = this.leaves.filter(Node.isHighlighted),
          highlightedIds = highlighted.map(Node.getId);
      
      // remove all highlight
      this.leaves.forEach(function(leaf){
        leaf.mapG.selectAll('path').attr('fill', leaf.color).attr('stroke', '#aaa').attr('stroke-width', 1);
      });
      
      //sort
      this.g.selectAll('g').sort(function (a, b){
        if(highlightedIds.indexOf(a.id) >= 0) return 1;
        return -1;
      });
        
      highlighted.forEach(function(leaf){
        leaf.mapG.selectAll('path').attr('fill', leaf.color.darker(0.8)).attr('stroke', leaf.color.darker(3)).attr('stroke-width', 3);
      });
    }
  };

  return Map;
});
