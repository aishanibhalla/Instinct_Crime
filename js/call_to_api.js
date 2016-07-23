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
var main_data;
  function initSlider(date,data) {
    console.log("inside init slider "+date);
    main_data=data;
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


 function make_feature_layer(data){
    console.log("inside make feature layer");
    //console.log(data);
    for(var key in data){
      //console.log(key);
      predictions=data[key][0];
      //console.log(predictions);

}
function mapping(graphic){
  console.log("mapping")
  var company = graphic.attributes.DISTRICT;
  console.log(company);
  console.log(main_data[company][0].keys()[0]);
  return main_data[company][0].keys()[0];

}
      var defaultSymbol = new SimpleFillSymbol().setStyle(SimpleFillSymbol.STYLE_NULL);
      defaultSymbol.outline.setStyle(SimpleLineSymbol.STYLE_NULL);
      console.log("1");
      var renderer = new UniqueValueRenderer(defaultSymbol, function(feature){
        //console.log("hello");
        //console.log(main_data);
        var district = feature.attributes.DISTRICT;
        console.log("district "+district);
        console.log(Object.keys(main_data[district][0])[0]);
        return Object.keys(main_data[district][0])[0];
      });

      console.log("2");
      renderer.addValue("LARCENY/THEFT", new SimpleFillSymbol().setColor(new Color([255, 0, 0, 0.5])));
      renderer.addValue("NON-CRIMINAL", new SimpleFillSymbol().setColor(new Color([0, 255, 0, 0.5])));
      renderer.addValue("OTHER OFFENSES", new SimpleFillSymbol().setColor(new Color([0, 0, 255, 0.5])));
      renderer.addValue("ASSAULT", new SimpleFillSymbol().setColor(new Color([255, 0, 255, 0.5])));
      renderer.addValue("VANDALISM", new SimpleFillSymbol().setColor(new Color([255, 255, 255, 0.75])));
      renderer.addValue("DRUG/NARCOTIC", new SimpleFillSymbol().setColor(new Color([0, 255, 255, 0.5])));
      renderer.addValue("VEHICLE THEFT", new SimpleFillSymbol().setColor(new Color([255, 255, 0, 0.5])));
      console.log("3");
      console.log(renderer);


      var featureLayer = new FeatureLayer("http://services1.arcgis.com/ohIVh2op2jYT7sku/arcgis/rest/services/SFPD_Districts/FeatureServer/0", {
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["DISTRICT"],
                //infoTemplate: infoTemplate
              });
              featureLayer.setRenderer(renderer);
          map.addLayer(featureLayer);






    }





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
      //console.log(data);
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
