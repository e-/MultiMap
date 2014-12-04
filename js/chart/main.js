define([
'chart/mmap',
'chart/geoHeatmap',
'chart/pie'
], function(
MMap, 
GeoHeatmap,
Pie){
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
    GeoHeatmap: GeoHeatmap,
    Pie: Pie
  };

  return chart;
});
