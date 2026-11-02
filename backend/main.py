import logging
import os
from pathlib import Path
from typing import Annotated, NoReturn

import psycopg
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Path as PathParameter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator



ROOT_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ROOT_ENV_PATH, override=True)

DB_HOST = os.getenv("DB_HOST", "").strip()
DB_PORT = os.getenv("DB_PORT", "").strip()
DB_NAME = os.getenv("DB_NAME", "").strip()
DB_USER = os.getenv("DB_USER", "").strip()
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

app = FastAPI()

@app.get("/")
def root():
    return {"Hello": "World"}

@app.post("/testPost")
def testPost(test: str):
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

@app.get("/testGet/{test}")
def testGet(test: str):
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


def connect_to_database() -> psycopg.Connection:
    credentials = (DB_HOST, DB_NAME, DB_USER, DB_PASSWORD)
    placeholders = {
        "your_database_host",
        "your_database_name",
        "your_database_username",
        "your_database_password",
    }
    if not all(credentials) or any(value in placeholders for value in credentials):
        raise HTTPException(
            status_code=503,
            detail="Database is not configured. Set DB_HOST, DB_PORT, DB_NAME, DB_USER, and DB_PASSWORD.",
        )
    try:
        port = int(DB_PORT)
    except ValueError as error:
        raise HTTPException(status_code=503, detail="DB_PORT must be a valid port number.") from error
    if not 1 <= port <= 65535:
        raise HTTPException(status_code=503, detail="DB_PORT must be between 1 and 65535.")

    return psycopg.connect(
        host=DB_HOST,
        port=port,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        sslmode="require",
        connect_timeout=10,
    )


def database_unavailable(error: psycopg.Error) -> NoReturn:
    error_type = type(error).__name__
    logging.error("PostgreSQL operation failed (%s)", error_type)
    raise HTTPException(
        status_code=503,
        detail=(
            f"PostgreSQL connection failed ({error_type}). Check DB_HOST, DB_PORT, "
            "DB_NAME, DB_USER, DB_PASSWORD, and the provider's SSL/network settings. " + DB_HOST
        ),
    )



if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
    )
