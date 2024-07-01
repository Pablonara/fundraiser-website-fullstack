from flask import Flask, request, jsonify, render_template, send_from_directory, redirect, url_for, Blueprint
from flask_login import login_required, current_user, LoginManager
import requests
import json
import random
from . import db

main = Blueprint('main', __name__)

# Sample data
# points = [
#     {"lat": 40.7128, "lng": -74.0059},
#     {"lat": 34.0522, "lng": -118.2437},
# ]

points = []

# data = [
#     {
#         "123456": {
#             "text": "helloworld"
#         }
#     }
# ]

def savepoints():
    with open('points.json', 'w') as file:
        json.dump(points, file)
        
def saveDataWithArgs(data):
    with open('data.json', 'w') as file:
        json.dump(data, file)
        

def loadDataByKey(key):
    data = loadData()
    for entry in data:
        if key in entry:
            return entry[key]
    return []

def loadData():
  try:
    with open('data.json', 'r') as file:
        data = json.load(file)
        return data
  except:
    return []
  
def appendData(data):
  data = loadData() + [data]
  with open('data.json', 'w') as file:
    json.dump(data, file)

def loadpoints():
  try:
    with open('points.json', 'r') as file:
        points = json.load(file)
        return points
  except:
    return []

def appendDataUnderKey(data, key, newEntry):
    if key in data:
        data[key].append(newEntry)
    else:
        # tempdata = {key, {newEntry}}
        # data.append(tempdata)
        print(f"Creating new key {key} with value [{newEntry}]")
        data.append({key: [newEntry]})
    return data

print(points)

points = loadpoints()

print(points)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', name=current_user.name)

@main.route('/map', methods=['GET', 'POST'])
def mainApp():
    if request.method == 'GET':
        return render_template('map.html')
    if request.method == 'POST':
        lat = float(request.form.get('lat'))
        lng = float(request.form.get('lng'))
        id = random.randint(0, 1000000)
        addToDb = {"lat": lat, "lng": lng, "id": id}
        formData = str(request.form.get('data'))
        print(formData)
        savepoints()
        formComments = str(request.form.get('comments'))
        print(formComments)
        formDate = str(request.form.get('date'))
        print(formDate)
        addToData = {"text": formData,}, {"comments": formComments,}, {"date": formDate,},
        points.append(addToDb)
        data = appendDataUnderKey(loadData(), id, addToData)
        saveDataWithArgs(data) # fix incorrect data save
        return render_template('map.html')


@main.route('/getMarkers', methods=['GET'])
def getPoints():
    # Replace with your logic to fetch points from database or other source
    return jsonify(points)  # Return points data as JSON

@main.route('/getContent', methods=['GET'])
def getContent():
    uuid = request.args.get('uuid')
    try:
      data = loadDataByKey(uuid)
      print(data)
      return jsonify(data)
    except:
      return jsonify([])
    return f'Hello world! Requested uuid is: {uuid}' 

@main.route('/addContent', methods=['POST'])
def addContent():
    try:
      data = request.json
      appendData(data)
      return jsonify({"status": "success"})
    except:
      return jsonify({"status": "error"})

# if __name__ == '__main__':
#     app.run(debug=True, port=2233)
