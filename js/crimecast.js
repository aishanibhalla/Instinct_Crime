var map;
require([
  "esri/map", "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/TimeExtent", "esri/dijit/TimeSlider", "esri/urlUtils",
  "esri/arcgis/utils",
  "dojo/_base/array", "dojo/dom", "dojo/domReady!"
], function(
  Map, ArcGISDynamicMapServiceLayer,
  TimeExtent, TimeSlider, urlUtils, arcgisUtils,
  arrayUtils, dom
) {
  arcgisUtils.createMap("ebef4df1bbd240d7aade012c472b2538","mapDiv").then(function(response){
    map = response.map;
    //map.on("layers-add-result", initSlider);
    initSlider();
  });

  //var opLayer = new ArcGISDynamicMapServiceLayer("https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Petroleum/KSWells/MapServer");
  //opLayer.setVisibleLayers([0]);

  //apply a definition expression so only some features are shown
  //var layerDefinitions = [];
  //layerDefinitions[0] = "FIELD_KID=1000148164";
  //opLayer.setLayerDefinitions(layerDefinitions);

  //add the gas fields layer to the map
  //map.addLayers([opLayer]);



  function initSlider() {
    console.log("I was called");
    var timeSlider = new TimeSlider({
      style: "width: 100%;"
    }, dom.byId("timeSliderDiv"));
    map.setTimeSlider(timeSlider);

    var timeExtent = new TimeExtent();
    timeExtent.startTime = new Date("1/1/1921 UTC");
    timeExtent.endTime = new Date("12/31/2009 UTC");
    timeSlider.setThumbCount(1);
    timeSlider.createTimeStopsByTimeInterval(timeExtent, 2, "esriTimeUnitsYears");
    timeSlider.setThumbIndexes([0,1]);
    timeSlider.setThumbMovingRate(2000);
    timeSlider.startup();

    //add labels for every other time stop
    var labels = arrayUtils.map(timeSlider.timeStops, function(timeStop, i) {
      if ( i % 2 === 0 ) {
        return timeStop.getUTCFullYear();
      } else {
        return "";
      }
    });

    timeSlider.setLabels(labels);

    timeSlider.on("time-extent-change", function(evt) {
      var startValString = evt.startTime.getUTCFullYear();
      var endValString = evt.endTime.getUTCFullYear();
      dom.byId("daterange").innerHTML = "<i>" + startValString + " and " + endValString  + "<\/i>";
    });
  }
});
