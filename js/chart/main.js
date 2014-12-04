define([
'chart/mmap',
'chart/geoHeatmap',
'chart/pie',
'chart/line',
'chart/horizon'
], function(
MMap, 
GeoHeatmap,
Pie,
Line,
Horizon){
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
    Line: Line,
    Horizon: Horizon
  };

  return chart;
});
