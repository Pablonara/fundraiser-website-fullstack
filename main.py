from flask import Flask, request, jsonify, render_template, send_from_directory, redirect, url_for
import requests

app = Flask(__name__)

# Sample data (replace with your data fetching logic)
points = [
  {"lat": 40.7128, "lng": -74.0059},
  {"lat": 34.0522, "lng": -118.2437},
]

@app.route('/', methods=['GET', 'POST'])
def mainApp():
    if request.method == 'GET':
        return render_template('index.html')
    if request.method == 'POST':
        lat = request.form.get('lat')
        lng = request.form.get('lng')
        print(f"Received coordinates: Latitude={lat}, Longitude={lng}")
        return "Coordinates received!"

@app.route('/getMarkers', methods=['GET'])
def getPoints():
  # Replace with your logic to fetch points from database or other source
  return jsonify(points)  # Return points data as JSON

if __name__ == '__main__':
    app.run(debug=True, port=2233)
