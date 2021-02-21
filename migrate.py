import pymysql.cursors

import glob, os
import re
# os.chdir("/mydir")
# for file in glob.glob("*.txt"):
#     print(file)

from .app import config

connection = pymysql.connect(host=config.MYSQL_HOST,
                             user=config.MYSQL_USER,
                             password=config.MYSQL_PASSWORD,
                             db=config.MYSQL_DB,
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)
storage = Storage(connection)

pattern = r'V\d*__\.*sql'

def find_last():

    with connection.cursor() as cursor:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS `schema_migrations` (
                migration_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                migration_number BIGINT UNIQUE,
                migration_name VARCHAR(256) UNIQUE,
                migrated_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """
        )
        results = cursor.execute("""
            SELECT migration_number FROM schema_migrations
            ORDER BY migrated_ts DESC LIMIT 1
            """)
    if results:
        return results[0]['migration_number']
    return None

def find_unmigrated(last):
    unmigrated = []
    if last is None:
        last = 0

    os.chdir("/migrations")
    for migration in glob.glob("*.sql"):
        re.findall

def main():


