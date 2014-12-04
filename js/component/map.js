define(['model/node', 
//'model/nodeSet', 
'd3'], function(Node
//, 
//NodeSet
){
  function Map(svg, width, height, root, visibleNodes, leaves, ui){
    this.svg = svg;
    this.g = svg.append('g');
    this.width = width;
    this.height = height;
    this.root = root;
    this.visibleNodes = visibleNodes;
    this.leaves = leaves;
    this.ui = ui;
  }

  function getCenter(root){
    if(!root.children.length) return;
    
    var sumx = 0, sumy = 0;
    root.children.forEach(function(child){
      getCenter(child);
      sumx += child.ix;
      sumy += child.iy;
    });
    root.ix = sumx / root.children.length;
    root.iy = sumy / root.children.length;
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
            leaf.isHovered = true;
            self.ui.mmap.updateHighlight();
            self.updateHighlight();
          })
          .on('mouseout', function(leaf){
            leaf.isHovered = false;
            self.ui.mmap.updateHighlight();
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

      getCenter(this.root);
      
      this.root.children[0].children[2].iy += 30;
      this.root.children[3].ix -= 30;
    },
    updateHighlight: function(){
      var highlighted = this.visibleNodes.filter(Node.IsHighlighted),
          highlightedIds = highlighted.reduce(function(result, node){
            return result.concat(node.getLeafIds());
          }, []);
      
      // remove all highlight
      this.visibleNodes.forEach(function(node){
        node.unhighlightMap();
      });
     
      //sort
      this.g.selectAll('g').sort(function (a, b){
        if(highlightedIds.indexOf(a.id) >= 0) return 1;
        return -1;
      });
        
      highlighted.forEach(function(node){
        node.highlightMap();
      });
    }
  };

  return Map;
});
