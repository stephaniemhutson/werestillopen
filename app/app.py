from flask import Flask
import pymysql.cursors
from flask import json, make_response, request
from flask_cors import CORS
from .store.sql import Storage
from .store.businesses import Business
from .store.locations import Location
from . import config

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": config.ORIGINS}})

app.config['MYSQL_HOST'] = config.MYSQL_HOST
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB


# Connect to the database
def connect():
    connection = pymysql.connect(host=config.MYSQL_HOST,
                             user=config.MYSQL_USER,
                             password=config.MYSQL_PASSWORD,
                             db=config.MYSQL_DB,
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)
    storage = Storage(connection)
    return connection, storage


@app.route('/')
def index():
    data = request.args
    where = {"is_deleted": False}
    kwargs = {}
    if data.get('page'):
        kwargs['offset'] = config.PAGE_LIMIT * (int(data['page']) - 1)

    if data.get('business_type'):
        where['business_type'] = data['business_type']

    connection, storage = connect()
    businesses = storage.select(
        Business,
        where=where,
        limit=config.PAGE_LIMIT,
        **kwargs)
    if not businesses:
        return json.jsonify(businesses=[])
    businesses_by_id = {business['business_id']: business for business in businesses}
    locations = storage.select(Location, where={"business_id": businesses_by_id.keys()})
    results = []
    for location in locations:
        business = businesses_by_id[location['business_id']]
        business['location'] = location
        results.append(business)
    connection.close()
    return json.jsonify(businesses=results)

@app.route('/businesses', methods=['POST'])
def add_business():
    connection, storage = connect()
    data = request.get_json()
    business_data = {row: column for row, column in data.items() if row in Business.ROWS}
    location_data = {row: column for row, column in data.items() if row in Location.ROWS}
    try:
        business_id = storage.insert(Business, business_data)
        location_data['business_id'] = business_id
        location_id = storage.insert(Location, location_data)
    except:
        connection.rollback()
        raise
    else:
        connection.commit()
    new_business = storage.get(Business, business_id)
    location = storage.get(Location, location_id)
    new_business['location'] = location
    connection.close()
    return json.jsonify(business=new_business)

@app.route('/businesses/<business_id>', methods=['DELETE', 'PUT', 'OPTIONS'])
def alter_business(business_id):
    if request.method == 'DELETE':
        connection, storage = connect()
        storage.delete(Business, {'business_id': business_id})
        connection.commit()
        connection.close()
        return make_response()
    elif request.method == 'PUT':
        connection, storage = connect()
        data = request.get_json()
        business_data = {row: column for row, column in data.items() if row in Business.ROWS}
        location_data = {row: column for row, column in data.items() if row in Location.ROWS}

        try:
            if business_data:
                business = storage.update(Business, business_id, business_data)
            else:
                business = storage.get(Business, business_id)
            if location_data:
                location = storage.update_where(Location, {'business_id': business_id}, location_data)
            else:
                locations = storage.select(Location, {'business_id': business_id})
                location = location[0] if locations else None
        except:
            connection.rollback()
            raise
        else:
            connection.commit()
        connection.commit()
        connection.close()

        business['location'] = location
        return json.jsonify(business=business)

@app.route('/mapid/<mapbox_id>', methods=['GET'])
def get_by_mapbox_id(mapbox_id):
    connection, storage = connect()
    locations = storage.select(Location, {'mapbox_id': mapbox_id})
    if not locations:
        return json.jsonify(business=None)
    # in theory there should be only one, but there is currently (4/10/2020) no
    # uniqueness constraint on mapbox_id
    location = locations[0]
    business = storage.get(Business, location['business_id'])
    business['location'] = location
    return json.jsonify(business=business)

