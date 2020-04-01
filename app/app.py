from flask import Flask
from . import app, connection

@app.route('/')
def index():
    connection = engine.connect()
    print(connection)
    print(connection.execute(
        "SHOW TABLES;"
    ))
    return 'Hello, World!!!'
