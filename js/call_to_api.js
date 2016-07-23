var map;
require([
  "esri/map", "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/TimeExtent", "esri/dijit/TimeSlider", "esri/urlUtils",
  "esri/arcgis/utils",
  "esri/layers/FeatureLayer", "esri/InfoTemplate",
  "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
  "esri/renderers/UniqueValueRenderer", "esri/Color",
  "dojo/_base/array", "dojo/dom", "dojo/domReady!"
], function(
  Map, ArcGISDynamicMapServiceLayer,
  TimeExtent, TimeSlider, urlUtils, arcgisUtils, FeatureLayer, InfoTemplate,
        SimpleLineSymbol, SimpleFillSymbol,
        UniqueValueRenderer, Color,
  arrayUtils, dom
) {
  arcgisUtils.createMap("ebef4df1bbd240d7aade012c472b2538","mapDiv").then(function(response){
    map = response.map;
    console.log(map);
    //map.on("layers-add-result", initSlider);
  //  test();
    //initSlider();
  });
  function addFeatureLayer() {
    var defaultSymbol = new SimpleFillSymbol().setStyle(SimpleFillSymbol.STYLE_NULL);
    defaultSymbol.outline.setStyle(SimpleLineSymbol.STYLE_NULL);

    //create renderer
    var renderer = new UniqueValueRenderer(defaultSymbol, "SUB_REGION");

    //add symbol for each possible value
    renderer.addValue("Pacific", new SimpleFillSymbol().setColor(new Color([255, 0, 0, 0.5])));
    renderer.addValue("Mtn", new SimpleFillSymbol().setColor(new Color([0, 255, 0, 0.5])));
    renderer.addValue("N Eng", new SimpleFillSymbol().setColor(new Color([0, 0, 255, 0.5])));
    renderer.addValue("S Atl", new SimpleFillSymbol().setColor(new Color([255, 0, 255, 0.5])));
    renderer.addValue("Mid Atl", new SimpleFillSymbol().setColor(new Color([255, 255, 255, 0.75])));
    renderer.addValue("E N Cen", new SimpleFillSymbol().setColor(new Color([0, 255, 255, 0.5])));
    renderer.addValue("W N Cen", new SimpleFillSymbol().setColor(new Color([255, 255, 0, 0.5])));
    renderer.addValue("E S Cen", new SimpleFillSymbol().setColor(new Color([127, 127, 127, 0.5])));
    renderer.addValue("W S Cen", new SimpleFillSymbol().setColor(new Color([0, 0, 0, 0.5])));

    var featureLayer = new FeatureLayer("https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/1", {
      infoTemplate: new InfoTemplate(" ", "${SUB_REGION}"),
      mode: FeatureLayer.MODE_ONDEMAND,
      outFields: ["SUB_REGION"]
    });

    featureLayer.setRenderer(renderer);
    map.addLayer(featureLayer);
  }
  function initSlider(date,data) {
    console.log("inside init slider "+date);

    make_feature_layer(data);
    date=date.split("-");
    year=date[0];
    month=date[1];
    date_week=date[2];
    console.log(year);
    console.log(month);
    console.log(date_week);
    //console.log("Initslider was called");
    var timeSlider = new TimeSlider({
      style: "width: 100%;"
    }, dom.byId("timeSliderDiv"));
    //map.setTimeSlider(timeSlider);
    var timeExtent = new TimeExtent();
    timeExtent.startTime = new Date(year,month-1,date_week,0);
//    console.log(timeExtent.startTime.getDay());
    timeExtent.endTime = new Date(year,month-1,date_week,23);
    console.log(timeExtent.startTime+" "+timeExtent.endTime);
    timeSlider.setThumbCount(1);
    timeSlider.createTimeStopsByTimeInterval(timeExtent, 1, "esriTimeUnitsHours");
    timeSlider.setThumbIndexes([0]);
    timeSlider.setThumbMovingRate(2000);
    timeSlider.startup();

    //add labels for every other time stop
    var labels = arrayUtils.map(timeSlider.timeStops, function(timeStop, i) {
      return i;
    });

    timeSlider.setLabels(labels);

    timeSlider.on("time-extent-change", function(evt) {
      var startValString = evt.startTime.getUTCFullYear();
      var endValString = evt.endTime.getUTCFullYear();
      dom.byId("daterange").innerHTML = "<i>" + startValString + " and " + endValString  + "<\/i>";
    });
  }


// function make_feature_layer(){
//   csv = new CSVLayer("", {
//           //copyright: "USGS.gov"
//         });
//         var orangeRed = new Color([238, 69, 0, 0.5]); // hex is #ff4500
//         var marker = new SimpleMarkerSymbol("solid", 15, null, orangeRed);
//         var renderer = new SimpleRenderer(marker);
//         csv.setRenderer(renderer);
//         var template = new InfoTemplate("${type}", "${place}");
//         csv.setInfoTemplate(template);
//         map.addLayer(csv);
// }



  (
  function($){
  function processForm(e){
    console.log("hello");
    date=$('#date').val();
    console.log($('#date').val());

      $.ajax({
      type:'GET',
      url:"http://localhost:5009/stats?date="+$('#date').val(),
      crossDomain:true,
      dataType:'jsonp',
      success:function(data,textStatus,jQxhr){
      console.log("success");
      console.log(data);
      initSlider(date,data);
      },
      error:function(jqXhr,textStatus,errorThrown){
      alert("failed");
      }});
      e.preventDefault();

  }
  $('#dateTime').submit( processForm );
  })(jQuery);

});
