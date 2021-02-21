import collections

class ForbiddenError(Exception):
    pass

class Storage(object):

    def __init__(self, connection):
        self._connection = connection

    def _construct_where_clause(self, where, custom_where, data_tuple):
        clause = " WHERE "
        if custom_where is not None:
            clause += custom_where
        if where is not None:
            for column, value in where.items():
                if isinstance(value, collections.Iterable) and not isinstance(value, str):
                    clause += f'{column} IN (' + ','.join(['%s' for v in value]) + ') AND '
                    data_tuple = data_tuple + tuple(value)
                else:
                    clause += f'{column} = %s AND '
                    data_tuple = data_tuple + (value, )
        return clause[:-4], data_tuple

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

    def select(self,
               model,
               where=None,
               custom_where=None,
               include_deleted=False,
               offset=None,
               limit=None,
               order_by=None):
        table = model.TABLE
        sql_base = f'SELECT * FROM {table}'
        data_tuple = tuple()
        if where is not None or custom_where is not None:
            where_clause, data_tuple = self._construct_where_clause(where, custom_where, data_tuple)
            sql_base += where_clause
        if order_by is not None:
            sql_base += f' ORDER BY {order_by} '
        elif model.DEFAULT_ORDER is not None:
            sql_base += f' ORDER BY {model.DEFAULT_ORDER} '
        if limit is not None:
            sql_base += f' LIMIT {limit} '
        if offset is not None:
            sql_base += f' OFFSET {offset} '

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
        where_clause, data_tuple = self._construct_where_clause(where, None, tuple())
        sql = f'DELETE FROM {table} {where_clause}'
        with self._connection.cursor() as cursor:
            cursor.execute(
                sql,
                data_tuple
            )

    def update(self, model, pk, data):
        """Updates by id only"""
        table = model.TABLE
        sql_base = sql_base = f"UPDATE {table} SET "
        sql_values = None
        values = []
        with self._connection.cursor() as cursor:
            first = True
            for column, value in data.items():
                sql_base += f"{'' if first else ','} {column} = %s "
                first = False
                values.append(value)

            sql = sql_base + f' WHERE {model.PRIMARY_KEY} = {pk};'

            cursor.execute(
                sql,
                tuple(values)
            )
            return self.get(model, pk)

    def update_where(self, model, where, data):
        """Updates by id only"""
        table = model.TABLE
        sql_base = sql_base = f"UPDATE {table} SET "
        sql_values = None
        values = []
        with self._connection.cursor() as cursor:
            first = True
            for column, value in data.items():
                sql_base += f"{'' if first else ','} {column} = %s "
                first = False
                values.append(value)
            data_tuple = tuple(values)
            where_clause, data_tuple = self._construct_where_clause(where, None, data_tuple)

            sql = sql_base + where_clause

            cursor.execute(
                sql,
                data_tuple
            )
