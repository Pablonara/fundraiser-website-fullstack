let markers = [];
let infoWindow;

const apiKey = '123'; 

function reverseGeocode(lat, lng) {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);
    const request = {
      latLng: latlng
    };

    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          resolve(results[0].formatted_address); //grab most likely address
        } else {
          reject(new Error('No results found'));
        }
      } else {
        reject(new Error(`Geocoder failed due to: ${status}`));
      }
    });
  });
}

function geocodeAddress(address) {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    const request = {
      address: address
    };

    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        // If there are results, return the location object of the most likely one
        if (results[0]) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          reject(new Error('No results found'));
        }
      } else {
        reject(new Error(`Geocoder failed due to: ${status}`));
      }
    });
  });
}

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const myLatlng = { lat: 49.2497, lng: -123.1193 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: myLatlng,
  });

  infoWindow = new google.maps.InfoWindow({
    content: "Click the map to get latitude and longitude",
    position: myLatlng,
  });

  async function showMarkerInfo(marker, markerId) {
    console.log(marker);
    const lat = marker.getPosition().lat();
    const lng = marker.getPosition().lng();
    const uuid = markerId;

    // Get the data from /getContent endpoint
    console.log(`/getContent?uuid=${uuid}`);

    const response = await fetch(`/getContent?uuid=${uuid}`);

    console.log(response);

    const data = await response.json();

    console.log(data);

    let text, comments, date;

    data.forEach(items => {
      items.forEach(item => {
        if (item.hasOwnProperty('text')) {
          text = item['text'];
        }
        if (item.hasOwnProperty('comments')) {
          comments = item['comments'];
        }
        if (item.hasOwnProperty('date')) {
          date = item['date'];
        }
      });
    });

    console.log(text);
    console.log(comments);
    console.log(date);

    reverseGeocode(lat, lng)
      .then(address => {
        console.log('Formatted address:', address);
      })
      .catch(error => {
        console.error('Error:', error.message);
      });

    const infoWindowContent = `
      <div>
        <b>Latitude:</b> ${lat.toFixed(4)}<br>
        <b>Longitude:</b> ${lng.toFixed(4)}<br>
        <b>UUID:</b> ${uuid}
        <h3>Marker Data</h3>
        <b>Text:</b> ${text}<br>
        <b>Comments:</b> ${comments}<br>
        <b>Date:</b> ${date}<br>
      </div>
    `;
    infoWindow.setContent(infoWindowContent);
    infoWindow.open(map, marker);

    // Update the markerInfo div
    const markerInfoDiv = document.getElementById('markerInfo');
    const markerInfoContent = `
      <div>
        <h2>Marker Information</h2>
        <p><b>Latitude:</b> ${lat.toFixed(4)}</p>
        <p><b>Longitude:</b> ${lng.toFixed(4)}</p>
        <p><b>UUID:</b> ${uuid}</p>
        <h3>Marker Data</h3>
        <b>Text:</b> ${text}<br>
      </div>
    `;
    markerInfoDiv.innerHTML = markerInfoContent;
  }

  function addMarker(lat, lng, uuid) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      id: uuid,
    });
    marker.addListener('click', function () {
      showMarkerInfo(marker, marker.id);
    });
    markers.push(marker);
  }

  fetch('/getMarkers')
    .then(response => response.json())
    .then(data => {
      data.forEach(point => addMarker(point.lat, point.lng, point.id));
    })
    .catch(error => console.error('Error fetching points:', error));

  infoWindow.open(map);

  map.addListener("click", (mapsMouseEvent) => {
    infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    });
    infoWindow.setContent(
      JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2),
    );
    infoWindow.open(map);
    console.log(mapsMouseEvent.latLng.toJSON());
    const coords = mapsMouseEvent.latLng.toJSON();
    document.getElementById('lat').value = coords.lat;
    document.getElementById('lng').value = coords.lng;
  });
}

initMap();


// const address = 'something something';

// geocodeAddress(address)
//   .then(location => {
//     console.log('Latitude:', location.lat);
//     console.log('Longitude:', location.lng);
//   })
//   .catch(error => {
//     console.error('Error:', error.message);
//   });



// document.addEventListener('DOMContentLoaded', function() {
//   var submitButton = document.getElementById('submitButton');
//   submitButton.addEventListener('click', function(e) {
//       e.preventDefault(); // Prevents the default action of the <a> tag
//       var form = document.getElementById('coords');
//       form.submit(); // Submits the form
//   });
// });



// function submitCoordinates(event) { // this works
//   event.preventDefault(); // Prevent the default form submission

//   const latInput = document.getElementById('lat');
//   const lngInput = document.getElementById('lng');

//   // Check if both inputs are filled
//   if (!latInput.value ||!lngInput.value) {
//       alert('Please fill in both latitude and longitude.');
//       return;
//   }


//   const data = {
//       lat: latInput.value,
//       lng: lngInput.value
//   };


//   fetch('/', {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//   }).then(response => {
//       if (response.ok) {
//           return response.text();
//       } else {
//           throw new Error('Error: ' + response.statusText);
//       }
//   }).then(message => {
//       alert(message);
//   }).catch(error => {
//       console.error('There was a problem with your fetch operation:', error);
//   });
// }
