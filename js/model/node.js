define(function(){
  var id = 0;

  function Node(data, level){
    this.id = ++id;
    this.data = data;
    this.children = [];
    this.level = level;
  }

  Node.prototype = {
    addChild: function(child){
      this.children.push(child);
      child.parent = this;
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
    getLeafIds: function(){
      return this.getLeaves.map(Node.GetId);
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
        this.mapG.selectAll('path').attr('fill', this.color.darker(0.5)).attr('stroke', this.color.darker(3)).attr('stroke-width', 3);
      }
    },
    unhighlightElement: function(ele){
      ele.attr('fill', this.color).attr('stroke', '#aaa').attr('stroke-width', 1);
    },
    highlightElement: function(ele){
      ele.attr('fill', this.color.darker(0.5)).attr('stroke', this.color.darker(3)).attr('stroke-width', 3);
    },
    unhighlightArea: function(){
      this.rect.attr('fill', this.color).attr('stroke', '#aaa').attr('stroke-width', 1);
    },
    highlightArea: function(){
      this.rect.attr('fill', this.color.darker(0.5)).attr('stroke', this.color.darker(3)).attr('stroke-width', 3);
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
    },
    getMapHighlighted: function(){
      if(Node.IsHighlighted(this))
        return [this];
      if(this.children.length) {
        var arr = [];
        this.children.forEach(function(child){
          arr = arr.concat(child.getMapHighlighted());
        });
        return arr;
      }
      return [];
    }
  };

  Node.Attributes = [
    {
      name: 'population',
      realName: 'Population (#)'
    },
    {
      name: 'size',
      realName: 'Area Size (km²)'
    },
    {
      name: 'popRatio',
      realName: 'Gender Ratio'
    },
    {
      name: 'temperature',
      realName: 'Temperature (℃)'
    },
    {
      name: 'vehicle',
      realName: 'Vehicle (#)'
    }
  ];
  
  Node.GetId = function(node){
    return node.id;
  };

  Node.IsHighlighted = function(node){
    return node.isHovered || node.isSelected || node.isBrushed;
  };

  Node.IsSelected = function(node){
    return node.isSelected;
  };


  return Node;
});
