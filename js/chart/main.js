define([
'chart/mmap',
'chart/pie'
], function(MMap, Pie){
  var chart = {};

  chart = {
    Types: [
      {},
      {},
      {},
      {},
      {}
    ],
    MMap: MMap,
    Pie: Pie
  };

  return chart;
});
