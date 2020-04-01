from flask import Flask
import pymysql.cursors
from flask import json, make_response, request
from flask_cors import CORS

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

@app.route('/')
def index():
    # try:
    with connection.cursor() as cursor:
        sql = '''
            SELECT
                business_id, name, is_open, take_out, delivery,
                online, details, website, phone_number
            FROM businesses WHERE is_deleted IS FALSE
        '''
        cursor.execute(sql)
        businesses_raw = cursor.fetchall()
    # finally:
    #     try :
    #         connection.close()
    #     except Exception:
    #         pass

    return json.jsonify(businesses=businesses_raw)

@app.route('/businesses', methods=['POST'])
def add_business():
    data = request.get_json()
    with connection.cursor() as cursor:
        sql = (
            f"INSERT INTO businesses (name, is_open, take_out, "
            f"   delivery, online, details, website, phone_number) "
            f"VALUES ( "
            f"'{data['name']}', {data['isOpen']}, {data['takeout']}, "
            f"{data['delivery']}, {data['online']}, '{data['details']}', '{data['website']}', "
            f"'{data['phone']}')"
        )
        cursor.execute(sql)
    connection.commit()
    return make_response()
    # try:
    #     with connection.cursor() as cursor:
