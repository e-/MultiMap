define([
'chart/mmap',
'chart/geoHeatmap',
'chart/pie',
'chart/line'
], function(
MMap, 
GeoHeatmap,
Pie,
Line){
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
    Pie: Pie,
    Line: Line
  };

  return chart;
});
