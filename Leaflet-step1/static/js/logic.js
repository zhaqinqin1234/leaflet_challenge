var myMap = L.map("mapid", {
  center: [37.773972, -122.431297],
  zoom: 8
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

//2020-10-01 to 2020-10-07 info
var url = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-10-01&endtime=" +
  "2020-10-07&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

function colorPicker(magnitude){
  var result = 'greenyellow';

  if (magnitude >5) {
    result = 'red';
  } 
  else if (magnitude >4) {
    result = 'darkorange'
  }
  else if (magnitude >3) {
    result = 'orange'
  }
  else if (magnitude >2) {
    result = 'gold'
  }
  else if (magnitude >1) {
    result = 'yellowgreen'
  }
      
  return result;
};

d3.json(url, function(response) {
  var earthquake = response.features;
  console.log(earthquake[0].properties);
  earthquake.forEach(report => {
    const magnitude = report.properties.mag;
    const location = report.geometry;
    if (magnitude){
      L.circle([location.coordinates[1], location.coordinates[0]],{
        fillOpacity: 0.75,
        color: "white",
        fillColor: colorPicker(magnitude),
        radius: magnitude*10000
      }).bindPopup(`<h2>${report.properties.place}</h2><hr /><h3>Time: ${report.properties.time}<br />Magnitude: ${magnitude}</h3>`)
      .addTo(myMap);
    }; 
  });
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function(){
    var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5],
    // var limits = geojson.options.limits;
    // var colors = geojson.options.colors;
      labels = [];
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + colorPicker(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}
    return div;
  };
  legend.addTo(myMap);
});



 