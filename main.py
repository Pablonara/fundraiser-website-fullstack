from flask import Flask, request, jsonify, render_template, send_from_directory, redirect, url_for
import requests
import json
import random

app = Flask(__name__)

# Sample data
# points = [
#     {"lat": 40.7128, "lng": -74.0059},
#     {"lat": 34.0522, "lng": -118.2437},
# ]

points = []

data = [
    {
        "123456": {
            "text": "helloworld"
        }
    }
]

def savepoints():
    with open('points.json', 'w') as file:
        json.dump(points, file)

def savedata():
    with open('data.json', 'w') as file:
        json.dump(data, file)
        

def loadDataByKeys(keys):
  try:
    with open('data.json', 'r') as file:
        data = json.load(file)
        if data:
          return [{key: item[key] for key in keys} for item in data]
  except:
    return []
  
def appendData(data):
  try:
    data = []
    with open('data.json', 'r') as file:
        data = json.load(file)
        data.append(data)
    with open('data.json', 'w') as file:
        json.dump(data, file)
  except:
    data = []
    data.append(data)
    with open('data.json', 'w') as file:
      json.dump(data, file)

def loadpoints():
  try:
    with open('points.json', 'r') as file:
        points = json.load(file)
        return points
  except:
    return []

print(points)

points = loadpoints()

print(points)

@app.route('/', methods=['GET', 'POST'])
def mainApp():
    if request.method == 'GET':
        return render_template('index.html')
    if request.method == 'POST':
        lat = float(request.form.get('lat'))
        lng = float(request.form.get('lng'))
        id = random.randint(0, 1000000)
        addToDb = {"lat": lat, "lng": lng, "id": id}
        
        data = str(request.form.get('data'))
        print(data)
        addToData = {id: data}
        print(addToData)
        appendData(addToData)  
        print(addToDb)
        points.append(addToDb)
        print(points)
        savepoints()
        return render_template('index.html')


@app.route('/getMarkers', methods=['GET'])
def getPoints():
    # Replace with your logic to fetch points from database or other source
    return jsonify(points)  # Return points data as JSON

@app.route('/getContent', methods=['GET'])
def getContent():
    uuid = request.args.get('uuid')
    try:
      data = loadDataByKeys([uuid])
      return jsonify(data)
    except:
      return jsonify([])
    return f'Hello world! Requested uuid is: {uuid}' 

@app.route('/addContent', methods=['POST'])
def addContent():
    try:
      data = request.json
      appendData(data)
      return jsonify({"status": "success"})
    except:
      return jsonify({"status": "error"})

if __name__ == '__main__':
    app.run(debug=True, port=2233)
