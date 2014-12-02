define(function(){
  function Node(data, level){
    this.data = data;
    this.children = [];
    this.level = level;
    this.id = data.id;
  }

  Node.prototype = {
    addChild: function(child){
      this.children.push(child);
    },
    getLeaves: function(){
      if(this.children.length == 0) 
        return [this];

      var leaves = [];
      this.children.forEach(function(child){
        leaves = leaves.concat(child.getLeaves());
      });
      return leaves;
    },
    getNodesAtLevel: function(level){
      if(this.level == level)
        return [this];
      else if(this.level > level)
        return [];

      var nodes = [];
      this.children.forEach(function(child){
        nodes = nodes.concat(child.getNodesAtLevel(level));
      });
      return nodes;
    },
    isHighlighted: function(){
      return Node.isHighlighted(this);
    },
    unhighlightMap: function(){
      if(this.children.length) {
        this.children.forEach(function(child){
          child.unhighlightMap();
        });
      } else {
        this.mapG.selectAll('path').attr('fill', this.color).attr('stroke', '#aaa').attr('stroke-width', 1);
      }
    },
    highlightMap: function(){
      if(this.children.length) {
        this.children.forEach(function(child){
          child.highlightMap();
        });
      } else {
        this.mapG.selectAll('path').attr('fill', this.color.darker(0.8)).attr('stroke', this.color.darker(3)).attr('stroke-width', 3);
      }
    },
    getLeafIds: function(){
      var ids = [];
      if(this.children.length) {
        this.children.forEach(function(child){
          ids = ids.concat(child.getLeafIds());
        });
        return ids;
      } else {
        return [this.id];
      }
    }
  };

  return Node;
});
