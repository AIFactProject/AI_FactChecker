import os

import uvicorn
from fastapi import Depends, FastAPI
from testRequest import testPostRequest, testGetRequest
from userAuth import get_current_user
from user import get_or_create_user_role, get_or_create_user_key

from encryption import encryption, decryption
from fastapi.middleware.cors import CORSMiddleware

from analysis import router as analysis_router
from result import router as result_router

app = FastAPI(
    title="Mingence API",
    version="1.0.0",
)
# Allow frontend origins
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://mingence.pages.dev",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"Hello": "World"}

@app.post("/testPost")
def testPost(test: str):
    return testPostRequest(test = test)

@app.get("/testGet/{test}")
def testGet(test: str):
    return testGetRequest(test = test)

app.include_router(analysis_router)
app.include_router(result_router)

@app.get("/getUserInfo")
def getUserInfo(current_user=Depends(get_current_user)):
    userInfo = get_or_create_user_role(current_user)
    userKey = get_or_create_user_key(current_user)

    testMessage = "1234abacasdwacd21313 123123"

    encrypt = encryption(userKey, testMessage)
    decrypt = decryption(userKey, encrypt)

    return {
        "message": testMessage + " : " + encrypt,
        "role": userInfo["title"] + " : " + decrypt
    }

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
    )
