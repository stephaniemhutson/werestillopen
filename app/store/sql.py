import collections

class Storage(object):

    def __init__(self, connection):
        self._connection = connection

    def insert(self, table, data):
        sql_base = None
        sql_values = None
        with self._connection.cursor() as cursor:
            for column, value in data.items():
                if sql_base is None:
                    sql_base = f"INSERT INTO {table} ({column}"
                else:
                    sql_base += ', ' + column
                if sql_values is None:
                    sql_values = "%s"
                else:
                    sql_values += ", %s"
            sql = f'{sql_base}) VALUES ({sql_values});'

            cursor.execute(
                sql,
                tuple(data.values())
            )

    def select(self, table, where=None, include_deleted=False):
        sql_base = f'SELECT * FROM {table}'
        data_tuple = tuple()
        if where is not None:
            sql_base += " WHERE "
            for column, value in where.items():
                if isinstance(value, collections.Iterable):
                    sql_base += f'{column} IN (' + ','.join(['%s' for v in value]) + ') '
                    data_tuple = data_tuple + tuple(value)
                else:
                    sql_base += f'{column} = %s '
                    data_tuple = data_tuple + (value, )

        sql = f'{sql_base};'
        with self._connection.cursor() as cursor:
            cursor.execute(
                sql,
                data_tuple
            )

            return cursor.fetchall()

