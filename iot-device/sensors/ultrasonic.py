import RPi.GPIO as GPIO
import paho.mqtt.client as mqtt
import time, argparse, random, sys, os, ssl, datetime, json
VERBOSE=False #flag for verbose debugging output set with -d
connected=False #flag indicating whether client is connected set by mqtt callbacks
GPIO.setmode(GPIO.BCM)
GPIO_TRIGGER = 23
GPIO_ECHO = 24
GPIO.setup(GPIO_TRIGGER, GPIO.OUT)
GPIO.setup(GPIO_ECHO, GPIO.IN)

GPIO.output(GPIO_TRIGGER, True)
time.sleep(0.00001)
GPIO.output(GPIO_TRIGGER, False)

mqtt_broker = os.getenv('AWS_IOT_ENDPOINT')
mqtt_port = 1883
ca_cert = os.getenv('AWS_IOT_ROOT_CA')
cert_file = os.getenv('AWS_IOT_CERTIFICATE')
key_file = os.getenv('AWS_SECRET_ACCESS_KEY')


def on_connect(client, userdata, flags, rc):
    global connected #allow this function to set this flag
    if rc == 0 and client.is_connected():
        print("Connected to MQTT Broker!")
        connected = True
    else:
        connected = False
        print(f'Failed to connect, return code {rc}')

def on_message(client, userdata, message):
    if VERBOSE:
        print("message received " ,str(message.payload.decode("utf-8")))
        print("message topic=",message.topic)
        print("message qos=",message.qos)
        print("message retain flag=",message.retain)


def on_publish(client, userdata, result):
    print(f"\tdata published to broker, result returned = {result}")


def on_disconnect(client, userdata, rc):
    global connected #allow this function to set this flag
    #flags used for reconnect attempts:
    FIRST_RECONNECT_DELAY = 1
    RECONNECT_RATE = 2
    MAX_RECONNECT_COUNT = 12
    MAX_RECONNECT_DELAY = 60
    connected = False
    if VERBOSE: 
        print(f"Disconnected with result code: {rc}")
    reconnect_count = 0
    reconnect_delay = FIRST_RECONNECT_DELAY
    while reconnect_count < MAX_RECONNECT_COUNT:
        if VERBOSE:
            print(f"Reconnecting in {reconnect_delay} seconds...")
        time.sleep(reconnect_delay)
        try:
            client.reconnect()
            if VERBOSE:
                print(f"Reconnected successfully!")
            connected = True
            return
        except Exception as err:
            if VERBOSE:
                print("{err}. Reconnect failed. Retrying...")

        reconnect_delay *= RECONNECT_RATE
        reconnect_delay = min(reconnect_delay, MAX_RECONNECT_DELAY)
        reconnect_count += 1
    if VERBOSE: 
        print("Reconnect failed after {reconnect_count} attempts. Exiting...")

def connect_mqtt():
    client = mqtt_client.Client(CLIENT_ID)
    client.username_pw_set(USERNAME, PASSWORD)
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(BROKER, PORT, keepalive=120)
    client.on_disconnect = on_disconnect
    return client


def main():
    microservice_id = f"SmartWaste" 
    client= mqtt.Client(microservice_id)
    client.on_publish = on_publish 
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect 

    try:
        
        client.tls_set(ca_cert,
            certfile=cert_file,
            keyfile=key_file,
            cert_reqs=ssl.CERT_REQUIRED,
            tls_version=ssl.PROTOCOL_TLSv1_2,
            ciphers=None)
        client.connect(broker,port)
    except Exception as e:
        print(f"Unable to connect error: {e}")
    
    try:
        client.loop_start()
        
        while True:
            dist = distance()
            publish_distance(dist)
            time.sleep(1)
    except KeyboardInterrupt:
        GPIO.cleanup()
        client.loop_stop()
        client.disconnect()

def distance():
    StartTime = time.time()
    StopTime = time.time()

    while GPIO.input(GPIO_ECHO) == 0:
        StartTime = time.time()

    while GPIO.input(GPIO_ECHO) == 1:
        StopTime = time.time()

    TimeElapsed = StopTime - StartTime
    dist = TimeElapsed * 17150
    return round(dist, 2)

def publish_distance(dist):
    if not mqtt_topic:
        print("MQTT topic is invalid or not set")
        return
    timestamp = datetime.datetime.now().isoformat()
    payload = json.dumps({"distance": dist, "timestamp": timestamp, "sensor_id": "YourSensorID"})
    print(f"Publishing: {payload}")
    client.publish(mqtt_topic, payload, qos=0)
    

if __name__ == '__main__':
    main()
F