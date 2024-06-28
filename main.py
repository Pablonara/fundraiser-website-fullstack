from flask import Flask, request, jsonify, render_template, send_from_directory, redirect, url_for
import requests

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def mainApp():
    if request.method == 'GET':
        return render_template('index.html')
    if request.method == 'POST':
        lat = request.form.get('lat')
        lng = request.form.get('lng')
        print(f"Received coordinates: Latitude={lat}, Longitude={lng}")
        return "Coordinates received!"


if __name__ == '__main__':
    app.run(debug=True, port=2233)
