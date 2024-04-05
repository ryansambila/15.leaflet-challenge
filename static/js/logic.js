// Initialize the map and set the initial view to Seattle, WA
var mymap = L.map('map').setView([47.6062, -122.3321], 4);

// Add a base tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(mymap);

// Function to determine color shades of green 
function getColor(d) {
    return d > 90 ? '#004d00' :
        d > 70 ? '#006400' :
        d > 50 ? '#228B22' :
        d > 30 ? '#32CD32' :
        d > 10 ? '#7FFF00' : 
        '#90EE90';
}

// Function to determine the radius of the marker based on earthquake magnitude
function getRadius(magnitude) {
    return magnitude * 40000;  // Scale up the magnitude for visibility
}

// Fetch the GeoJSON data from USGS
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

fetch(url)
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circle(latlng, {
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    color: '#FF0000',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup("Magnitude: " + feature.properties.mag +
                    "<br>Depth: " + feature.geometry.coordinates[2] +
                    "<br>Location: " + feature.properties.place);
            }
        }).addTo(mymap);
    });

// Create the legend
var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [0, 10, 30, 50, 70, 90],
        labels = [];

    // Add title to the legend
    div.innerHTML += '<h4>Depth of Earthquakes</h4>';

    // Add depth labels with color indicators
    for (var i = 0; i < depths.length; i++) {
            labels.push(
                '<i style="background:' + getColor(depths[i] + 1) + '; width: 36px; height: 36px; display: inline-block;"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] : '+'));
        }
    
    // Combine title and depth labels
    div.innerHTML += labels.join('<br>');
    return div;
};

legend.addTo(mymap);