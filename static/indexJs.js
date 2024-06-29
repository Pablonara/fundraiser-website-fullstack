let markers = []; 

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const myLatlng = { lat: 49.2497, lng: -123.1193 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: myLatlng,
  });
  let infoWindow = new google.maps.InfoWindow({
    content: "Click the map to get latitude and longitude",
    position: myLatlng,
  });

  function addMarker(lat, lng) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
    });
    markers.push(marker); 
  }

  fetch('/getMarkers') 
    .then(response => response.json())
    .then(data => {
      data.forEach(point => addMarker(point.lat, point.lng));
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
