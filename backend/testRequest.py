import psycopg
from userDB import connect_to_database, database_unavailable


def testPostRequest(test: str):
    try:
        with connect_to_database() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO "testLog" (result)
                    VALUES (%s)
                    RETURNING datetime, result;
                    """,
                    (test,)
                )

                response = cursor.fetchone()

            return {
                "message": "Successfully saved",
                "data": {
                    "datetime": response[0],
                    "result": response[1]
                }
            }

    except psycopg.Error as error:
        database_unavailable(error)
    return {"Saving Fail Post": test}

def testGetRequest(test: str):
    try:
        with connect_to_database() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO "testLog" (result)
                    VALUES (%s)
                    RETURNING datetime, result;
                    """,
                    (test,)
                )

                response = cursor.fetchone()

            return {
                "message": "Successfully saved",
                "data": {
                    "datetime": response[0],
                    "result": response[1]
                }
            }

    except psycopg.Error as error:
        database_unavailable(error)
    return {"Saving Fail Get": test}