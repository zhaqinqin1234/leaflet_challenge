var myMap = L.map("mapid", {
  center: [36.778259, -110.417931],
  zoom: 6
});

// Add a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

//2020-10-01 to 2020-10-07 info
var url = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-10-01&endtime=" +
  "2020-10-07&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

function colorPicker(gap){
  var result = 'lightgreen';

  if (gap >90) {
    result = 'red';
  } 
  else if (gap >70) {
    result = 'darkorange'
  }
  else if (gap >50) {
    result = 'tan'
  }
  else if (gap >30) {
    result = 'yellow'
  }
  else if (gap >10) {
    result = 'yellowgreen'
  }
      
  return result;
};

d3.json(url, function(response) {
  console.log(response);
  var earthquake = response.features;
  console.log(earthquake[0].properties);
  earthquake.forEach(report => {
    const magnitude = report.properties.mag;
    const location = report.geometry;
    const gap=location.coordinates[2];
    if (gap){
      L.circle([location.coordinates[1], location.coordinates[0]],{
        fillOpacity: 0.9,
        color: "white",
        fillColor: colorPicker(gap),
        radius: magnitude*10000
      }).bindPopup(`<h2>${report.properties.place}</h2><hr /><h3>Time: ${report.properties.time}<br />Magnitude: ${magnitude}</h3>`)
      .addTo(myMap);
    }; 
  });
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function(){
    var div = L.DomUtil.create('div', 'info legend'),
      grades = [-10, 10, 30, 50, 70, 90],
    
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



 