var map;
var timeSlider;
var time;
var timeExtent_main;
require([
  "esri/map", "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/TimeExtent", "esri/dijit/TimeSlider", "esri/urlUtils",
  "esri/arcgis/utils",
  "esri/layers/FeatureLayer", "esri/InfoTemplate", "myModules/InfoWindow",
  "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
  "esri/renderers/UniqueValueRenderer", "esri/Color",
  "dojo/_base/array", "dojo/dom", "dojo/dom-construct","dojo/domReady!"
], function(
  Map, ArcGISDynamicMapServiceLayer,
  TimeExtent, TimeSlider, urlUtils, arcgisUtils, FeatureLayer, InfoTemplate, InfoWindow,
        SimpleLineSymbol, SimpleFillSymbol,
        UniqueValueRenderer, Color,
  arrayUtils, dom, domConstruct
) {
  var infoWindow = new  InfoWindow({
     domNode: domConstruct.create("div", null, dom.byId("mapDiv"))
  });
  arcgisUtils.createMap("6f046a9aa0be46f18ad45afcb0c17fe7","mapDiv").then(function(response){
    map = response.map;
    console.log(map);
  });
  // var search = new Search({
  //       map: map
  //     }, "ui-dijit-search");
  // search.startup();

  //create the custom info window specifying any input options
  //define the info template that is used to display the popup content.
      var template = new InfoTemplate();
      template.setTitle("<b>${neighborho}</b>");
      // template.setContent("hello");
      template.setContent(getTextContent);
var main_data;
  function initSlider(date,data) {
    console.log("inside init slider "+date);
    main_data=data;

    date=date.split("-");
    year=date[0];
    month=date[1];
    date_week=date[2];
    console.log(year);
    console.log(month);
    console.log(date_week);
    //console.log("Initslider was called");
     timeSlider = new TimeSlider({
      style: "width: 100%;"
    }, dom.byId("timeSliderDiv"));
    //map.setTimeSlider(timeSlider);
    timeExtent_main = new TimeExtent();
    timeExtent_main.startTime = new Date(year,month-1,date_week,0);
    console.log(timeExtent_main);
    timeExtent_main.endTime = new Date(year,month-1,date_week,23);
    console.log(timeExtent_main.startTime+" "+timeExtent_main.endTime);
    timeSlider.setThumbCount(1);
    timeSlider.createTimeStopsByTimeInterval(timeExtent_main, 1, "esriTimeUnitsHours");
    timeSlider.setThumbIndexes([0]);
    //timeSlider.setThumbMovingRate(2000);
    timeSlider.startup();

    //add labels for every other time stop
    var labels = arrayUtils.map(timeSlider.timeStops, function(timeStop, i) {
      return i;
    });

    timeSlider.setLabels(labels);

    timeSlider.on("time-extent-change", function(evt) {

      time = timeSlider.getCurrentTimeExtent().endTime.getHours();
      console.log(time);
      make_feature_layer(data,time);
    });

  }

 function getTextContent(graphic){
   var district = graphic.attributes.neighborho;
   console.log("district "+district);

   // console.log(Object.keys(main_data[district][0])[0]);
   // return Object.keys(main_data[district][0])[0];

   var arr = Object.keys( main_data[district][time] ).map(function ( key ) { return main_data[district][time][key]; });
   var max = Math.max.apply( null, arr );
   //console.log(max);
   keys=Object.keys(main_data[district][time]);
   console.log(keys);
   var crimes = Object.keys(main_data[district][time]).sort(function(a,b){return main_data[district][time][b] - main_data[district][time][a]});
   console.log(crimes);
   //crime = crimes.toString();
   string="<ul>"
   for(var x=0;x<crimes.length;x++){
     string+="<li>"+crimes[x]+"</li>";
   }
   string+="</ul>";
   return string;
 }
  function make_renderer(time){
    console.log(main_data);
    console.log(time);
    var defaultSymbol = new SimpleFillSymbol().setStyle(SimpleFillSymbol.STYLE_NULL);
    defaultSymbol.outline.setStyle(SimpleLineSymbol.STYLE_NULL);
    //console.log("1");
    var renderer = new UniqueValueRenderer(defaultSymbol, function(feature){
    var district = feature.attributes.neighborho;
    console.log("district "+district);

    // console.log(Object.keys(main_data[district][0])[0]);
    // return Object.keys(main_data[district][0])[0];

    var arr = Object.keys( main_data[district][time] ).map(function ( key ) { return main_data[district][time][key]; });
    var max = Math.max.apply( null, arr );
    //console.log(max);
    keys=Object.keys(main_data[district][time]);
    if(max>=0.3){
      //console.log(arr.indexOf(max));
      //console.log(keys[arr.indexOf(max)]);
      console.log(keys[arr.indexOf(max)]);
      return keys[arr.indexOf(max)];
    }



    });
    renderer.addValue("ARSON", new SimpleFillSymbol().setColor(new Color([255, 227, 140, 1])));
    renderer.addValue("ASSAULT", new SimpleFillSymbol().setColor(new Color([120, 138, 255, 1])));
    renderer.addValue("BURGLARY", new SimpleFillSymbol().setColor(new Color([127, 52, 37, 1])));
    renderer.addValue("DISORDERLY CONDUCT", new SimpleFillSymbol().setColor(new Color([151, 231, 154, 1])));
    renderer.addValue("DRUG/NARCOTIC", new SimpleFillSymbol().setColor(new Color([255, 130, 117, 1])));
    renderer.addValue("JUVENILE CRIMES", new SimpleFillSymbol().setColor(new Color([255, 255, 255, 1])));
    renderer.addValue("LOITERING", new SimpleFillSymbol().setColor(new Color([166, 244, 255, 1])));
    renderer.addValue("NON-CRIMINAL", new SimpleFillSymbol().setColor(new Color([122, 85, 71, 1])));
    renderer.addValue("ROBBERY", new SimpleFillSymbol().setColor(new Color([243, 175, 255, 1])));
    renderer.addValue("VANDALISM", new SimpleFillSymbol().setColor(new Color([255, 136, 178, 1])));
    renderer.addValue("VEHICLE THEFT", new SimpleFillSymbol().setColor(new Color([56, 205, 190, 1])));
    renderer.addValue("WEAPON LAWS", new SimpleFillSymbol().setColor(new Color([216, 216, 216, 1])));
    //console.log(renderer);
    return renderer;
}

 function make_feature_layer(data,time){
    console.log("inside make feature layer");

    try{
    map.removeLayer(map.getLayer("custom_layer"));
  }
  catch(err){
    console.log("first time application of layer");
  }
      // for(var y=0;y<24;y++){
            var featureLayer = new FeatureLayer("http://services.arcgis.com/6DIQcwlPy8knb6sg/arcgis/rest/services/Neighborhoods/FeatureServer/0", {
                  mode: FeatureLayer.MODE_SNAPSHOT,
                  outFields: ["neighborho"],
                  infoTemplate: template
            });
            featureLayer.id="custom_layer";
      //       timeSlider.play();
      //       timeSlider.pause();
             featureLayer.setRenderer(make_renderer(time));
      //       console.log("I just called everything");
           map.addLayer(featureLayer);
      //       //setTimeout(donothing,20000);
      //       // for(var x=0;x<10000;x++){
      //       //   for(var v;v<10000;v++){
      //       //
      //       //   }
      //       // }
      //       function donothing(){}
      //       timeSlider.play();
      //
      // }

    }

  (
  function($){
  function processForm(e){
    $('#loader').show();
    document.getElementsByTagName("BODY")[0].style.opacity = .4;
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
      $('#loader').hide();
      document.getElementsByTagName("BODY")[0].style.opacity = 1;
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
