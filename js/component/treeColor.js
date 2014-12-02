define(['d3'], function(){
  d3.treeColor = function(){
    var hueRange = [0, 360];

    function permutate(ranges){
      var n = ranges.length,
          m = Math.ceil(Math.sqrt(n)),
          arr = new Array(n * n);

      ranges.forEach(function(range, i){
        var row = Math.floor(i / m),
            col = i % m;

        arr[col * m + row] = range;
      });

      return arr.filter(function(range){return range;});
    }

    function assignColors(data, range){
      data.color = d3.hcl((range[0] + range[1]) / 2, 55 - 5 * data.level, 65 + 10 * data.level);

      if(data.level == 0)
        data.color = '#aaa';
      
      if(!data.children) return;

      var 
          n = data.children.length,
          delta = (range[1] - range[0]) / n,
          padding = delta > 0 ? .25 : -.25, 
          ranges = []
          ;
      d3.range(n).forEach(function(i){
        ranges.push([range[0] + delta * i + padding * delta, range[0] + delta * (i + 1) - padding * delta]);
      });
      ranges = permutate(ranges);
      data.children.forEach(function(child, i){
        assignColors(child, (i % 2 == 0 ? ranges[i] : [ranges[i][1], ranges[i][0]]));
      });
    }
   
    function treeColor(data){
      assignColors(data, hueRange);
    }

    return treeColor;
  };
});
