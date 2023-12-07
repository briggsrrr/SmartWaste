import paho.mqtt.client as mqtt
import time, argparse, random, sys, os, ssl, datetime, json
import string
VERBOSE=False #flag for verbose debugging output set with -d
connected=False #flag indicating whether client is connected set by mqtt callbacks


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
    global VERBOSE #allow this function to set this flag
    parser = argparse.ArgumentParser(description='Virtual sensor microservice')
    parser.add_argument('max_sensor',action='store',type=int,help='largest sensor ID in databse')
    parser.add_argument('--rate',action='store',type=int,default=10,help='number of seconds to sleep between publishes')
    parser.add_argument('--tls', action='store_true', default=False, help='if used, the program will attempt to connect to the broker using TLS settings and the flags below.')
    parser.add_argument('--broker', '-b', action='store', default="localhost", help='broker IP address (mosquitto -d) or cloud endpoint (AWS)')
    parser.add_argument('--port', '-p', action='store', type=int, default="1883", help='broker IP address')
    parser.add_argument('--cert', action='store', default='/~/SmartWaste/certs/certificate.pem.crt', help='aws thing certificate')
    parser.add_argument('--priv', action='store', default='/~/SmartWaste/certs/private.pem.key', help='aws thing private key')
    parser.add_argument('--rootCA', action='store', default='/~/SmartWaste/certs/rootCA.pem', help='aws IoT rootCA')
    parser.add_argument('--topic', '-t', action='store', default='smartwaste', help='default topic, use the string smartfarm to randomly select sensor X (topics: smartfarm/X) for lab3, else put a valid topic')
    parser.add_argument('--verbose', action='store_true', default=False, help='set the VERBOSE flag')
    parser.add_argument('--debug', '-d', action='store_true', help='for debugging/testing: end after one pass throught the loop')
    args = parser.parse_args()
    broker = args.broker
    port = args.port #1883 and 8883 is the default MQTT port for most brokers
    topic = args.topic
    VERBOSE = args.verbose
    microservice_id = f"VSensor" 
    client= mqtt.Client(microservice_id)
    client.on_publish = on_publish #register call back for each call to publish
    client.on_connect = on_connect #same for connect
    client.on_disconnect = on_disconnect #same for disconnect
    smartfarm_topic_flag = False
    if topic == 'smartfarm':
        smartfarm_topic_flag = True

    try:
        if args.tls: 
            client.tls_set(args.rootCA,
                certfile=args.cert,
                keyfile=args.priv,
                cert_reqs=ssl.CERT_REQUIRED,
                tls_version=ssl.PROTOCOL_TLSv1_2,
                ciphers=None)

        client.connect(broker,port)
    except Exception as e:
        print(f"Unable to connect to {broker} at {port}: {e}")
        if not args.tls:
            print("The local flag is set (instructing use of localhost).\nIs your local broker running (sudo mosquitto -d)?")
        else:
            print("The tls flag is set. Are your credentials files set correctly and available? Is the port set correctly (AWS uses 8883)?")
            found=os.path.isfile(args.cert)
            print(f"\tcertfile: {args.cert} found={found}")
            found=os.path.isfile(args.priv)
            print(f"\tkeyfile: {args.priv} found={found}")
            found=os.path.isfile(args.rootCA)
            print(f"\tkeyfile: {args.rootCA} found={found}")
        sys.exit(1)
    
    client.loop_start()
    time.sleep(1) #give client a chance to get setup
    if VERBOSE:
        print(f'publishing every {args.rate} seconds via broker {broker} at port {port}...')
    while connected:
        #publish
        sensor_id = random.randint(1,args.max_sensor) #includes min,max
        if smartfarm_topic_flag:
            topic = f"smartfarm/{sensor_id}"
        val = random.randint(1,10) #includes min,max
        val2= ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        timestamp = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
        payload = json.dumps({"sensorID": sensor_id, "timestamp": timestamp, "value": val, "value2": val2})
        print(f"publishing to {topic}, val={val}")
        if VERBOSE: 
            print(f"Published payload: {payload}")
        err,mid = client.publish(topic, payload=payload, qos=0, retain=False)
        if err != 0:
            python(f"{microservice_id} Error: unable to publish data")
        if args.debug: #exit loop after one pass
            break
        time.sleep(args.rate)
    client.loop_stop()

    
if __name__ == "__main__":
    main()
