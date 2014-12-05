define([
'chart/mmap',
'chart/geoHeatmap',
'chart/pie',
'chart/line',
'chart/horizon',
'chart/treemap',
'chart/pcoordinate'
], function(
MMap, 
GeoHeatmap,
Pie,
Line,
Horizon,
Treemap,
PCoordinate){
  var chart = {};

  chart = {
    Types: [
      {
        name: 'MultiMap',
        chart: MMap,
        d: 'M0 999.936l0 -437.472l437.472 0l0 437.472l-437.472 0zm0 -562.464l0 -437.472l437.472 0l0 437.472l-437.472 0zm562.464 562.464l0 -437.472l437.472 0l0 437.472l-437.472 0zm0 -562.464l0 -437.472l437.472 0l0 437.472l-437.472 0z',
        transform: 'translate(-13, 13)scale(0.025)rotate(272)'
      },
      {
        name: 'GeoHeatmap',
        chart: GeoHeatmap,
        d: 'M256,32C132.3,32,32,132.3,32,256s100.3,224,224,224s224-100.3,224-224S379.7,32,256,32z M120.2,391.8C84,355.5,64,307.3,64,256c0-36.2,10-70.9,28.6-100.9c0.1,0.1,0.1,0.3,0.2,0.3c0.2,0.1,0.3,0.3,0.4,0.4c0.2,0.1,0.3,0.2,0.5,0.3c-0.1,0.6-0.1,1.2-0.2,1.8c-0.4,3.3-0.9,6.5-1.3,9.8c-0.3,2,0.1,3.9,0.9,5.7c0.6,1.4,1.5,2.7,2.6,3.9c1.3,1.5,2.8,2.7,4.4,3.8c2.7,1.9,5.6,3.3,8.6,4.5c0.3,0.1,0.5,0.2,0.9,0.3c-0.1,1.4-0.3,2.7-0.5,4c-0.2,1.3-0.5,2-0.4,3.1c0.1,0.7,0.3,1.4,0.6,1.6c1.6,1.4,3.2,2.9,4.9,4.3c0.5,0.4,1.1,2.4,1.2,3c0.8,3.5,1.3,5.3,2.2,8.8c0.1,0.6,0.4,1.1,0.9,1.4c1.8,1.3,3.5,2.7,5.2,4c0.3,0.2,0.7,0.5,1,0.6c1.7,0.9,2.7,2.2,3.2,4c0.3,1.1,0.4,2.2,0.4,3.4c0,2.2-0.5,4.2-1.1,6.3c-0.4,1.5-1.1,2.9-1.9,4.1c-1.3,1.8-2.5,3.6-3.8,5.4c-1.6,2.2-3.2,4.5-4.7,6.7c-0.6,0.8-1.1,1.8-1.6,2.6c-1.2,1.9-1.7,3.9-2,6.1c-0.3,2.5-0.4,4.9-0.2,7.4c0.2,2.3,0.6,4.5,1.4,6.6c0.2,0.5,0.2,0.9,0.1,1.5c-0.5,2.3-0.2,4.4,0.7,6.5c0.5,1.3,1.2,2.5,2,3.6c0.9,1.2,1.8,2.3,2.7,3.5c1.5,1.8,2.9,3.5,4.3,5.4c3,4,6.7,7.2,10.8,9.9c0.3,0.2,0.6,0.4,1,0.6c-0.1,0.3-0.1,0.5-0.2,0.8c-0.6,1.8-1,3.7-1,5.7c-0.1,2.8,0.5,5.4,2.1,7.7c0.7,1,1.2,1.5,2.7,2.7c0.1,0.4,0,0.8-0.1,1.3c-0.4,3.2-0.9,6.4-1.3,9.6c-0.2,1.7-0.4,3.4-0.7,5.1c-0.1,0.7-0.2,1.4-0.4,2c-0.7,2.4-1.2,4.8-1.5,7.2c-0.1,1.6-0.2,3.1,0.1,4.7c0.2,1.3,0.7,2.6,1.7,3.6c-0.1,0.8-0.2,1.6-0.3,2.4c-0.3,2.6-0.7,5.1-1,7.7c-0.2,1.2-0.4,2.3-0.6,3.4c-0.4,2.6-0.6,5.2-0.5,7.8c0.1,1.4,0.2,2.7,0.6,4c0.3,1.1,0.7,2.2,1.4,3.1c0.2,0.2,0.3,0.5,0.3,0.8c0.5,3.4,0.9,6.7,1.4,10.1c0.3,2.1,0.6,4.3,0.9,6.4c0.1,0.4,0.2,0.7,0.3,1c2.4,4.1,3.4,9.5,6.5,13.1c1.9,2.2,4.7,4.8,7,6.5c0.8,0.6,2.1,2.1,3.5,3.5C143.8,412.6,131.5,403,120.2,391.8z M434.6,197.1c-1.8-0.4-3.6-0.6-5.4-0.7c-3-0.2-6.1-0.3-9.1-0.1c-0.2,0-0.4,0-0.6,0c-0.6,0.1-1.1-0.1-1.5-0.5c-4.6-3.6-9.2-7.1-13.8-10.7c-0.6-0.4-1.1-0.8-1.7-1.3c-0.7-0.5-1.4-0.9-2.2-1.2c-1.8-0.6-3.6-0.9-5.5-1.2c-2.8-0.3-5.5-0.3-8.3-0.2c-0.7,0-1.3-0.1-1.9-0.3c-2.5-1-5.2-1.7-7.9-2.1c-2.5-0.4-5-0.5-7.6-0.4c-2.8,0.1-5.6,0.5-8.3,1.4c-3.6,1.1-7.2,2.2-10.8,3.3c-0.6,0.2-1.1,0.5-1.5,1c-2.5,3-5,5.9-7.4,8.9c-0.4,0.4-0.8,0.7-1.3,0.8c-6.8,1.6-11.8,5.5-15,11.8c-0.3,0.7-0.6,1.3-0.9,2c-0.2,0.4-0.3,0.8-0.4,1.2c-0.2,0.6-0.1,1.2,0.2,1.8c0.1,0.1,0.1,0.2,0.2,0.4c0.5,0.9,0.7,1.8,0.7,2.8c0.1,1.6-0.1,3.2-0.3,4.8c-0.3,2-0.7,4-1.3,5.9c-1.5,4.8-2.6,9.6-3.5,14.5c-0.7,3.7-1.2,7.5-1.1,11.3c0,1.8,0.2,3.5,0.6,5.2c0.1,0.4,0.3,0.9,0.4,1.3c0.1,0.4,0.4,0.7,0.7,1c3.4,3.3,6.7,6.6,10.2,9.7c3.1,2.8,6.3,5.4,9.8,7.7c2.6,1.7,5.4,3.2,8.3,4.3c3.2,1.2,6.5,1.7,9.9,1.4c3.5-0.3,7-0.5,10.6-0.6c2.5-0.1,5,0,7.5,0.5c0.8,0.2,1.6,0.4,2.4,0.8c0.9,0.4,1.7,1,2.3,1.9c0.1,0.2,0.2,0.3,0.4,0.5c0.6,0.7,1.4,1,2.3,0.8c0.5-0.1,1-0.3,1.4-0.5c0.5-0.2,1-0.4,1.5-0.7c0.4-0.2,0.8-0.3,1.2-0.5c1-0.3,1.7,0,2.1,1c0.2,0.6,0.4,1.2,0.5,1.8c0.6,2.5,0.9,5,0.5,7.6c-0.2,1.8-0.7,3.5-1.3,5.2c-0.6,1.7-1.3,3.3-1.9,5c-0.5,1.2-0.9,2.5-1.3,3.8c-1.1,3.4-1.1,6.9-0.1,10.3c0.5,1.8,1.2,3.5,1.8,5.3c0.7,1.8,1.3,3.6,1.7,5.5c0.7,3.1,0.4,6.1-0.8,9c-0.8,2.1-1.9,3.9-3.4,5.6c-1.1,1.2-2.2,2.4-3.3,3.6c-0.4,0.4-0.8,0.9-1.2,1.3c-1.7,1.9-3.2,3.9-4.3,6.2c-0.9,1.8-1.8,3.7-2.5,5.6c-1,2.8-1.2,5.6-0.6,8.5c0.5,2.2,1,4.4,1.4,6.6c0.3,1.4,0.5,2.8,0.7,4.1c0.1,0.7,0.1,1.5-0.1,2.2c-0.3,1.2-0.7,2.3-1.2,3.5c-1.2,3.1-2.7,6-4.1,9c-1.6,3.3-3.1,6.6-4.6,9.9c-0.7,1.6-1.3,3.3-1.8,5c-0.2,0.7-0.3,1.5-0.4,2.3c-0.1,1,0.6,2.2,1.6,2.8c-31.8,22-69.5,33.9-109,33.9c-32.7,0-64.1-8.1-91.9-23.4c0-0.3-0.1-0.6-0.1-0.9c-1.2-6.5-3.6-19-4.8-25.4c-0.1-0.7-0.2-1.5-0.2-1.9s0.1-1.4,0.3-1.8c1-2.1,1.7-3.8,2.7-5.9c0.9-1.9,1.7-3.8,2.6-5.7c0.3-0.6,0.7-1.2,1.2-1.7c2.3-2.2,4.5-4.4,6.7-6.5c0.3-0.3,0.7-0.6,1.1-0.9c4.3-2.9,8.7-5.8,13-8.7c0.7-0.5,1.2-1,1.7-1.7c1.9-2.9,3.9-5.8,5.8-8.8c0.8-1.3,1.5-2.6,2.3-3.9c0.2-0.3,0.4-0.6,0.6-0.8c2.6-3.3,5.2-6.6,7.7-9.9c0.4-0.5,0.8-0.8,1.5-0.9c4.2-0.9,8.3-2.2,12.1-4.1c0.9-0.5,1.8-1,2.7-1.5c0.4-0.2,0.7-0.5,0.9-0.9c2.8-3.8,5.5-7.7,8.3-11.5c0.3-0.4,0.5-0.9,0.7-1.3c1.9-5.2,3.9-10.3,5.8-15.5c0.2-0.6,0.5-1,1-1.3c5.5-3.6,8.8-8.6,9.8-15.1c0.2-1.5,0.3-2.9,0.1-4.4c-0.2-1.5-1-2.9-1.6-3.6c-2.6-3.2-4.8-4.6-8.3-6.7c-4.5-2.6-9.2-4.4-14.3-5.6c-1.2-0.3-2.9-0.8-3.3-1s-0.7-0.4-0.8-0.8c-1.1-2.2-2.2-4.4-3.6-6.4c-1.2-1.8-2.5-3.5-4.1-5c-0.3-0.3-0.4-0.6-0.5-1c-0.4-1.3-0.8-2.7-1.3-4c-1.7-4.3-4.2-8.1-7.4-11.4c-5.3-5.4-11.7-9.2-18.9-11.6c-0.6-0.2-1-0.5-1.4-1c-2.7-3.8-6.3-6.4-10.5-8.1c-1.5-0.6-3-1.1-4.6-1.4c-0.4-0.1-0.8-0.2-1.1-0.4c-2.8-1.4-5.7-2.8-8.5-4.2c-0.5-0.2-0.9-0.5-1.2-0.9c-0.7-0.8-1.6-1.4-2.5-2c-1.1-0.6-2.2-0.9-3.4-0.9c-1.4,0.1-2.6,0.7-3.6,1.7c-0.2,0.2-0.4,0.5-0.6,0.8c-0.7,1.2-1.4,2.4-2.4,3.4c-1.5,1.5-3.2,2.5-5.4,2.8c-1.4,0.2-2.9,0-4.2-0.4c-1.8-0.5-3.4-1.4-5-2.5c-0.4-0.3-0.8-0.5-1.3-0.8c-2.9-1.7-4.7-4.2-5.2-7.5c-0.1-0.7-0.1-1.4-0.2-2.1c-0.1-3.1,0.1-6.3,0.4-9.4c0.1-0.8,0.2-1.1,0.2-1.6c0-0.4-0.2-1.1-0.7-1.3c-0.7-0.3-1.3-0.7-1.8-1.2c-0.4-0.3-0.7-0.7-1-1.1c-0.6-0.9,0.2-1.5,0.7-2.5c0.4-0.8,0-1.8,0.8-2.3c0.8-0.5,1.7-1.1,2.5-1.7c0.9-0.7,1.7-1.4,2.5-2.3c0.4-0.5,0.7-1,0.9-1.6c0.4-1.2,0.3-2.3-0.5-3.3c-0.7-0.9-1-1.6-2.1-2.1c-0.3-0.1-1.2,0-1.5,0.1c-1.2,0.3-2.3,0.6-3.5,0.8c-1.5,0.3-3.1,0.3-4.7-0.1c-2-0.5-3.3-1.7-4.1-3.6c-0.5-1.4-0.7-2.8-0.6-4.3c0.1-2.9,0.7-5.7,1.6-8.4c0.1-0.3,0.2-0.6,0.4-0.9c4.6-6.5,10.6-11.1,18.3-13.4c1.9-0.5,3.7-0.9,5.7-1.1c0.8-0.1,1.5,0,2.3,0.1c2.2,0.2,4.3,0.6,6.3,1.4c1.2,0.4,2.2,1,3.2,1.8c2.1,1.6,3.3,3.6,3.5,6.2c0.1,1.7,0.6,3.3,1.2,4.8c0.3,1,0.7,1.9,1.2,2.9c0.3,0.6,0.6,1.1,1,1.6c0.3,0.4,0.7,0.7,1.1,1c0.7,0.5,1.5,0.4,2.3,0.1c0.4-0.2,0.7-0.5,0.8-1c0.1-0.9,0.3-1.8,0.4-2.8c0.6-3.7,1.2-7.4,1.7-11c0.3-1.9,0.6-3.7,0.9-5.6c0-0.2,0.1-0.4,0.1-0.6c3.7-5.5,16.7-6.4,22-12.1c0.2,0.1,0.3,0.2,0.5,0.4c0.6,0.5,1.2,0.7,1.9,0.7c1,0.1,2-0.1,3-0.3c1.4-0.4,2.8-0.9,4.1-1.6c1.1-0.5,2.1-1.1,3.1-1.7c0.5-0.3,0.9-0.5,1.5-0.6c3.1-0.9,6.2-1.8,9.3-2.7c0.6-0.2,1.2-0.2,1.8-0.1c2.6,0.3,5.2,0.3,7.9,0c1.8-0.2,3.5-0.5,5.2-1c0.3-0.1,0.6-0.2,0.9-0.3c0.4-0.1,0.6-0.3,0.8-0.7c0.4-0.8,0.9-1.5,1.4-2.2c0.4-0.6,0.9-1.1,1.5-1.6c0.4-0.3,0.8-0.6,1.3-0.8c0.9-0.4,1.9-0.4,2.9-0.1c0.8,0.3,1.4,0.7,2,1.3c0.5,0.5,1,0.8,1.6,1.1c0.8,0.4,1.7,0.7,2.6,0.9c2,0.4,3.8-0.1,5.2-1.5c0.8-0.7,1.3-1.6,1.8-2.5c0.8-1.5,1.3-3,1.7-4.7c0.5-2,0.8-4,1-6.1c0-0.3,0-0.7,0-1.1c-0.2,0.1-0.5,0.1-0.6,0.2c-0.9,0.4-1.7,0.7-2.6,0.9c-0.3,0-0.5,0.1-0.8,0c-0.6-0.1-0.9-0.5-0.8-1.1c0.1-0.5,0.2-1,0.5-1.4c0.5-0.9,1-1.7,1.5-2.6c0.6-1,1.2-1.9,1.7-2.9c0.3-0.6,0.5-1.3,0.5-2c0.1-0.9-0.2-1.7-0.9-2.3c-0.4-0.4-0.9-0.8-1.4-1.1c-0.6-0.4-1.2-0.8-1.8-1.3c-0.9-0.7-1.7-1.5-2.3-2.6c-0.1-0.1-0.2-0.3-0.3-0.4c-1.1-1.6-2.6-2.1-4.4-1.6c-1.4,0.4-2.6,1.2-3.7,2.3c-0.6,0.6-1.1,1.1-1.7,1.7c-0.7,0.6-1.5,1.2-2.3,1.6c-1.4,0.7-2.9,0.7-4.3,0c-0.4-0.2-0.7-0.4-1.1-0.6c-0.2-0.1-0.5-0.2-0.7-0.3c-0.6-0.2-1-0.1-1.4,0.5c-0.2,0.3-0.4,0.6-0.5,1c-0.5,1.5-1.5,2.7-2.6,3.8c-1.4,1.3-2.9,2.3-4.6,3.2c-1.3,0.7-2.6,1.2-4,1.8c-0.5,0.2-1.1,0.3-1.7,0.3c-1.6-0.1-2.7-0.8-3.4-2.3c-0.4-1-0.6-2-0.6-3c-0.1-1.9,0.1-3.7,0.5-5.6c0.1-0.7,0.3-1.3,0.4-1.9c0.1-0.5,0.3-0.8,0.7-1c1.9-1.2,3.7-2.4,5.5-3.6c0.2-0.1,0.4-0.3,0.7-0.4c1.3-0.8,2.5-1.7,3.6-2.7c0.9-0.9,2-1.7,3.1-2.4c0.5-0.3,1-0.5,1.5-0.7c0.2-0.1,0.5-0.1,0.8-0.2c0.8-0.1,1.4,0.2,1.8,0.9c0.8,1.6,2.2,1.9,3.8,1.8c0.8,0,1.7-0.2,2.5-0.4c0.9-0.2,1.7-0.6,2.5-0.9c0.4-0.2,0.8-0.3,1.3-0.3c2-0.1,3.9-0.1,5.9-0.2c0.3,0,0.6,0,0.9,0.3c1.6,1.1,3.1,2.2,4.5,3.5c0.9,0.9,1.2,1.3,1.7,2.4c0.2-0.2,0.5-0.4,0.7-0.6c1.7-1.5,3.3-3.1,5-4.6c0.4-0.3,0.8-0.7,1.1-1c1.7-1.3,3.3-2.5,5-3.8c0.3-0.2,0.5-0.4,0.8-0.6c0.1-0.4-0.2-0.7-0.3-1c-1.1-2.5-2.3-4.9-3.5-7.4c-0.1-0.2-0.2-0.4-0.3-0.6c1.1,0,2.3,0,3.4,0c1.7,0,3.3,0,5,0.1c0,0,0,0,0,0c0.2,0.6,0.5,1.2,0.7,1.8c0.1,0.3,0.2,0.6,0,1c-0.3,0.9-0.7,1.7-1,2.6c-1.2,3.1-2.4,6.2-3.6,9.3c-0.2,0.5-0.3,0.9-0.2,1.5c0.4,4,1.1,7.8,2.6,11.6c0.9,2.2,2,4.4,3.5,6.3c1.4,1.8,3.1,3.3,5.2,4.3c0.2,0.1,0.5,0.2,0.7,0.3c0.1,0,0.1,0,0.3,0c0.2-0.2,0.4-0.5,0.6-0.7c2.8-3.5,5.7-7,8.5-10.4c1.9-2.3,3.9-4.5,5.9-6.8c0.2-0.2,0.4-0.4,0.5-0.6c1-1.1,1-1.1,2.5-1.4c2.1-0.4,4.2-0.7,6.3-1.1c1.2-0.2,0.9,0,1.5-1.1c2.2-3.5,4.4-7,6.6-10.5c0.1-0.2,0.3-0.4,0.4-0.6c20.3,4.9,39.5,13.2,57.1,24.4c-3.2,0.4-6.4,0.6-9.5,1c-0.1,0.2-0.1,0.4-0.1,0.6c-0.4,3.9-0.4,7.8,0.2,11.7c0.3,1.6,0.7,3.3,1.4,4.8c0.5,1.1,1.1,2,2,2.8c0.4,0.4,0.8,0.6,1.4,0.7c1.7,0.2,3.3,0.4,4.9,0.7c0.4,0.1,0.8,0.1,1.3,0.2c1.3,2.1,2.5,4.2,3.8,6.3c3,0.5,6.1,0.8,9.1,1.3c0,0.8-0.2,1.5-0.2,2.2c-0.2,1.7-0.5,3.4-0.7,5c-0.1,0.5,0,1,0.2,1.6c0.7,1.5,1.3,3.1,2,4.6c0.1,0.3,0.2,0.5,0.3,0.8c-0.2,0.2-0.3,0.5-0.5,0.7c-1.6,2.1-3.2,4.1-4.7,6.2c-0.2,0.3-0.5,0.6-0.8,0.8c-2.4,1.5-4.8,3-7.1,4.5c-0.9-0.1-1.8-0.2-2.6-0.2c-1.8,0-3.6,0.3-5.4,0.8c-1.2,0.3-2.3,0.8-3.5,1.2c-0.3,0.1-0.6,0.2-0.8,0.4c-1.4,0.8-2.8,1.6-4.3,2.4c-0.1,0.1-0.3,0.2-0.4,0.3c0.1,0.2,0.2,0.4,0.3,0.6c1.9,3.4,3.7,6.8,5.6,10.1c1.1,2,2.6,3.8,4.3,5.4c1.3,1.2,2.7,2.1,4.3,2.7c2,0.8,4.1,0.9,6.2,0.4c2.8-0.7,5.7-1.4,8.5-2.2c0.3-0.1,0.5-0.2,0.8-0.2c0.1-0.5,0.1-0.9,0.2-1.4c0.3-2.5,0.5-5,0.9-7.5c0.2-1.5,0.5-3,0.8-4.4c0.1-0.5,0.3-0.9,0.5-1.4c0-0.1,0.2-0.2,0.3-0.2c0.1,0,0.3,0.1,0.3,0.2c0.2,0.8,2.7-1.5,2.7-1.5s6.2-4.4,23.6,16s27.1,14.4,27.1,14.4c1.1,1.3,2,2.8,2.7,4.3c0.9,2,1.5,4.1,1.8,6.2c0,0.3,0,0.5,0,0.8C435.3,197.2,435,197.1,434.6,197.1z',
        transform: 'translate(-15, 15)scale(0.06)rotate(273)'
      },
      {
        name: 'Pie',
        chart: Pie,
        d: 'M424 594.5l-296 295q-110 -128 -110 -295t110 -295zm44 -39l-362 -360q157 -130 362 -142l0 502zm55 -390q143 21 238 129.5t95 256.5q0 164 -115 279.5t-278 115.5q-127 0 -233 -78l293 -289l0 -414z',
        transform: 'translate(-15, 13)scale(0.03)rotate(270)'
      },
      {
        name: 'Line',
        chart: Line,
        d: 'M84.089 800.689c-18.75 0 -37.5 -6.25 -52.5 -18.75 -36.25 -28.75 -42.5 -82.5 -12.5 -118.75l240 -297.5c26.25 -32.5 72.5 -41.25 108.75 -20l228.75 133.75 202.5 -250c28.75 -35 82.5 -41.25 118.75 -11.25 36.25 28.75 41.25 82.5 12.5 118.75l-247.5 305c-26.25 31.25 -72.5 40 -108.75 18.75l-228.75 -132.5 -195 241.25c-17.5 21.25 -41.25 31.25 -66.25 31.25z',
        transform: 'translate(-15, 13)scale(0.03)rotate(270)'
      },
      {
        name: 'Horizon',
        chart: Horizon,
        d: 'M0 939.35l0 -156.24l999.936 0l0 156.24l-999.936 0zm0 -240.219l0 -156.24l999.936 0l0 156.24l-999.936 0zm0 -242.172l0 -156.24l999.936 0l0 156.24l-999.936 0zm0 -240.219l0 -156.24l999.936 0l0 156.24l-999.936 0z',
        transform: 'translate(-14, 11)scale(0.025)rotate(275)'
      },
      {}
    ],
    MMap: MMap,
    GeoHeatmap: GeoHeatmap,
    Pie: Pie,
    Line: Line,
    Horizon: Horizon,
    Treemap: Treemap,
    PCoordinate: PCoordinate
  };

  return chart;
});
