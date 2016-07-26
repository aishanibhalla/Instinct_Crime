var map;
require([
  "esri/map",
  "esri/urlUtils",
  "esri/arcgis/utils",
  "esri/dijit/Search",
  "esri/geometry/Extent",
  "esri/graphic",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/geometry/screenUtils",
  "dojo/_base/array",
  "dojo/dom",
  "dojo/dom-construct",
  "dojo/query",
  "dojo/_base/Color",
  "dojo/domReady!"
], function(
  Map, urlUtils, arcgisUtils,
  arrayUtils, Search, Extent, Graphic, SimpleMarkerSymbol, screenUtils, dom, domConstruct, query, Color
) {
  arcgisUtils.createMap("6f046a9aa0be46f18ad45afcb0c17fe7","mapDiv").then(function(response){
    map = response.map;
    searchFun();
  });
  function searchFun(){
    var search = new Search({
       map: map
    }, "search");
    console.log(map);
    search.startup();
  }
});
