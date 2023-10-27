# http_client.py
import requests
import ultrasonic

BACKEND_URL = "http://localhost:8000/data"  # Replace with your backend URL

def send_data_to_backend(distance):
    data = {
        "distance": distance,
        "unit": "meters"
    }
    response = requests.post(BACKEND_URL, json=data)
    return response

if __name__ == "__main__":
    distance = ultrasonic.get_distance()
    response = send_data_to_backend(distance)
    print("Data sent. Server responded with:", response.status_code)
