define(function(){
  var id = 1;

  function NodeSet(nodes) {
    this.id = id++;
    this.nodes = nodes;
    this.update();
  };

  NodeSet.prototype = {
    add: function(node){
      this.nodes.push(node);
      this.update();
    },
    update: function(){
      var self = this;

      this.size = 0;
      this.population = 0;
      this.ix = 0;
      this.iy = 0;

      this.nodes.forEach(function(node){
        self.size += node.data.size;
        self.population += node.data.population
        self.ix += node.ix * node.data.size;
        self.iy += node.iy * node.data.size;
      });

      this.ix /= this.size;
      this.iy /= this.size;

      this.color = this.nodes[0].color;
      this.name = this.nodes[0].data.name;
    },
    unhighlightArea: function(){
      this.area.attr('fill', this.color).attr('stroke', '#aaa').attr('stroke-width', 1);
    },
    highlightArea: function(){
      this.area.attr('fill', this.color.darker(0.5)).attr('stroke', this.color.darker(3)).attr('stroke-width', 3);
    },
    unhighlightMap: function(){
      this.nodes.forEach(function(node){
        node.unhighlightMap();
      });
    },
    highlightMap: function(){
      this.nodes.forEach(function(node){
        node.highlightMap();
      });
    },
    getNodeIds: function(){
      var ids = [];
      this.nodes.forEach(function(node){
        ids = ids.concat(node.getLeafIds());
      });
      return ids;
    }
  };

  NodeSet.isHighlighted = function(nodeSet){
    return nodeSet.isHovered || nodeSet.isSelected;
  };

  NodeSet.getId = function(nodeSet){
    return nodeSet.id;
  };
  
  NodeSet.isSelected = function(nodeSet){
    return nodeSet.isSelected;
  };

  return NodeSet;

});
