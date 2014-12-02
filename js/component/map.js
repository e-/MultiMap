define(['d3'], function(){
  function Map(svg, width, height, leaves){
    this.svg = svg;
    this.g = svg.append('g');
    this.width = width;
    this.height = height;
    this.leaves = leaves;
  }
  Map.prototype = {
    draw: function(){
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
      /*      highlightArea(leaf);
            highlightMap(leaf);*/
          })
          .on('mouseout', function(leaf){
/*            unhighlightArea(leaf);
            unhighlightMap(leaf);*/
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
        leaf.map = d3.select(this);
      });
    }
  };

  return Map;
});
