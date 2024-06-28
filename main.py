from flask import Flask, request, jsonify, render_template, send_from_directory, redirect, url_for
import requests

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def mainApp():
    if request.method == 'GET':
        return render_template('index.html')
    
    
if __name__ == '__main__':
    app.run(debug=True, port=2233)