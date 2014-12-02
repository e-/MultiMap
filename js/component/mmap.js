define(['jquery', 'model/node', 'd3', 'component/nmap', 'component/safeBrush'], function($, Node){
  function MMap(svg, width, height, leaves){
    this.svg = svg;
    this.g = svg.append('g');
    this.width = width;
    this.height = height;
    this.leaves = leaves;
  }
    
  function translate(x, y){
   return 'translate(' + x + ',' + y + ')';
  }

  MMap.prototype = {
    draw: function(ref){
      var self = this;

      this.svg.attr('width', this.width).attr('height', this.height);
    
      var nmap = d3.layout.nmap().value(function(node){return node.data.population;}).width(this.width).height(this.height);
    
      nmap(this.leaves);
      
      this
        .g
        .attr('id', 'rects')
        .selectAll('rect')
        .data(this.leaves)
        .enter()
        .append('rect')
          .attr('width', function(leaf){return leaf.dx;})
          .attr('height', function(leaf){return leaf.dy;})
          .attr('fill', function(leaf){return leaf.color;})
          .attr('transform', function(leaf){return translate(leaf.x, leaf.y);})
          .attr('stroke', '#aaa')
          .attr('stroke-width', 1)
          .each(function(leaf){
            leaf.area = d3.select(this);
          })
          .on('mouseover', function(leaf){
            leaf.isHovered = true;
            ref.map.updateHighlight();
            self.updateHighlight();
          })
          .on('mouseout', function(leaf){
            leaf.isHovered = false;
            ref.map.updateHighlight();
            self.updateHighlight();
          })
      ;

      var brush = 
            d3.svg.safeBrush()
              .x(d3.scale.linear().domain([0, this.width]).range([0, this.width]))
              .y(d3.scale.linear().domain([0, this.height]).range([0, this.height]))
              .on('brush', brushed)
          ;
      
      this.svg.call(brush);

      function isPointContainedInBox(x, y, startX, startY, endX, endY) {
        return startX <= x && x <= endX && startY <= y && y <= endY;
      }

      function isLeafContainedInBox(leaf, startX, startY, endX, endY) {
        return !(leaf.y + leaf.dy < startY || 
                 leaf.y > endY ||
                 leaf.x + leaf.dx < startX ||
                 leaf.x > endX);
      }

      function brushed(startX, startY, endX, endY){
        var highlightLeaves = [], dirty = false;
        self.leaves.forEach(function(leaf){
          if(isLeafContainedInBox(leaf, startX, startY, endX, endY)) {
            if(!leaf.isSelected) dirty = true;
            leaf.isSelected = true;
          } else {
            if(leaf.isSelected) dirty = true;
            leaf.isSelected = false;
          }
        });
        if(dirty) {
          ref.map.updateHighlight();
          self.updateHighlight();
        }
      }
    },
    updateHighlight: function(){
      var highlighted = this.leaves.filter(Node.isHighlighted),
          highlightedIds = highlighted.map(Node.getId);
      
      // remove all highlight
      this.leaves.forEach(function(leaf){
        leaf.area.attr('fill', leaf.color).attr('stroke', '#aaa').attr('stroke-width', 1);
      });
      
      //sort
      this.g.selectAll('rect').sort(function (a, b){
        if(highlightedIds.indexOf(a.id) >= 0) return 1;
        return -1;
      });
        
      highlighted.forEach(function(leaf){
        leaf.area.attr('fill', leaf.color.darker(0.8)).attr('stroke', leaf.color.darker(3)).attr('stroke-width', 3);
      });
    }
 
  };

  return MMap;
});
