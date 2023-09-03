document.addEventListener('DOMContentLoaded', function() {
  const getLocationBtn = document.getElementById('getLocationBtn');
  const latitudeElement = document.getElementById('latitude');
  const longitudeElement = document.getElementById('longitude');
  var latitude = 0;
  var longitude = 0;
  shwoingTheMap(longitude, latitude);
  var map;

  getLocationBtn.addEventListener('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  });

  function successCallback(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    shwoingTheMap(longitude, latitude);

    latitudeElement.textContent = latitude;
    longitudeElement.textContent = longitude;

    // Send the location data to the backend
    sendLocationToBackend(latitude, longitude);
  }

  function errorCallback(error) {
    console.log('Error occurred while retrieving location:', error.message);
  }

  function sendLocationToBackend(latitude, longitude) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/save-location', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    const data = {
      latitude: latitude,
      longitude: longitude
    };

    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);

        // Update the frontend elements with the received weather data
        const weatherDescriptionElement = document.getElementById('weather-description');
        const weatherIconElement = document.getElementById('weather-icon');
        weatherDescriptionElement.textContent = 'Weather: ' + response.weather;
        weatherIconElement.src = 'http://openweathermap.org/img/wn/' + response.weathericon + '.png';
      }
    };

    xhr.send(JSON.stringify(data));
  }

  // The Map Code
  function shwoingTheMap(longitude, latitude) {
    if (!map) {
      map = L.map('map').setView([longitude, latitude], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: "Map data © <a href='https://openstreetmap.org'>OpenStreetMap</a> contributors",
      }).addTo(map);

      var marker = L.marker([longitude, latitude]).addTo(map);
      marker.bindPopup("<b>Hello!</b><br>Specify your location by clicking on the Get Location :D.").openPopup();
    } else {
      map.flyTo([latitude, longitude], 13);
      var marker = L.marker([latitude, longitude]).addTo(map);
      marker.bindPopup("<b>Hello!</b><br>This is a new location.").openPopup();
    }
  }
});