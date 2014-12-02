define(function(){
  function Node(data, level){
    this.data = data;
    this.children = [];
    this.level = level;
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
    }
  };

  return Node;
});
