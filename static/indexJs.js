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
  
    infoWindow.open(map);
    map.addListener("click", (mapsMouseEvent) => {
      infoWindow.close();
      infoWindow = new google.m      
      aps.InfoWindow({
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

function submitCoordinates() { // change after to submit to backend
    const lat = document.getElementById('lat').value;
    const lng = document.getElementById('lng').value;
    console.log(`Coordinates: Latitude: ${lat}, Longitude: ${lng}`);
}
