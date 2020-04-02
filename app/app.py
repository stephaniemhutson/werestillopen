from flask import Flask
import pymysql.cursors
from flask import json, make_response, request
from flask_cors import CORS
from .store.sql import Storage
from .store.businesses import Business

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": r"http://localhost:3000/*"}})

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'open_dev'


# Connect to the database
connection = pymysql.connect(host='localhost',
                             user='root',
                             password='',
                             db='open_dev',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)

storage = Storage(connection)

@app.route('/')
def index():
    businesses_raw = storage.select(Business, where={"is_deleted": False})
    return json.jsonify(businesses=businesses_raw)

@app.route('/businesses', methods=['POST'])
def add_business():
    data = request.get_json()
    storage.insert(Business, data)
    connection.commit()
    return make_response()

@app.route('/businesses/<business_id>', methods=['DELETE', 'OPTIONS'])
def delete_business(business_id):
    storage.delete(Business, {'business_id': business_id})
    return make_response()
