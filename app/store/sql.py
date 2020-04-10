import collections

class ForbiddenError(Exception):
    pass

class Storage(object):

    def __init__(self, connection):
        self._connection = connection

    def _construct_where_clause(self, where, data_tuple):
        clause = " WHERE "
        for column, value in where.items():
            if isinstance(value, collections.Iterable):
                clause += f'{column} IN (' + ','.join(['%s' for v in value]) + ') '
                data_tuple = data_tuple + tuple(value)
            else:
                clause += f'{column} = %s '
                data_tuple = data_tuple + (value, )
        return clause, data_tuple

    def insert(self, model, data):
        table = model.TABLE
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
            return cursor.lastrowid


    def select(self, model, where=None, include_deleted=False):
        table = model.TABLE
        sql_base = f'SELECT * FROM {table}'
        data_tuple = tuple()
        if where is not None:
            where_clause, data_tuple = self._construct_where_clause(where, data_tuple)
            sql_base += where_clause

        sql = f'{sql_base};'
        with self._connection.cursor() as cursor:
            cursor.execute(
                sql,
                data_tuple
            )
            return cursor.fetchall()

    def get(self, model, pk):
        values = self.select(model, where={model.PRIMARY_KEY: pk})
        if values:
            return values[0]
        else:
            return None

    def delete(self, model, where):
        table = model.TABLE
        if where is None:
            raise ForbiddenError("Cannot delete all rows from database.")
        where_clause, data_tuple = self._construct_where_clause(where, tuple())
        sql = f'DELETE FROM {table} {where_clause}'
        with self._connection.cursor() as cursor:
            cursor.execute(
                sql,
                data_tuple
            )

