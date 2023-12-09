from flask import Flask, request
from twilio.rest import Client
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/send_sms": {"origins": "http://localhost:3000"}})

@app.route('/send_sms', methods=['POST'])
def send_sms():
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    client = Client(account_sid, auth_token)

    try:
        message = client.messages.create(
            to=request.json['to'],
            from_="+18669684459",
            body="Take out the trash!")
        return {"message": "SMS sent successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True)
