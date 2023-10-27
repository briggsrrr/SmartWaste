# server.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Data(BaseModel):
    distance: float
    unit: str

@app.post("/data")
def receive_data(data: Data):
    print(f"Received distance: {data.distance} {data.unit}")
    return {"message": "Data received"}
