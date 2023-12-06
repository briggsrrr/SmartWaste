from gpiozero import DistanceSensor
import time

# GPIO pins
GPIO_TRIGGER = 16
GPIO_ECHO = 18

sensor = DistanceSensor(echo=GPIO_ECHO, trigger=GPIO_TRIGGER)

def distance():
    # Wait for the sensor to settle
    time.sleep(0.1)
    
    # Measure distance in centimeters
    dist = sensor.distance * 100
    return round(dist, 2)

if __name__ == '__main__':
    try:
        while True:
            dist = distance()
            print("Measured Distance = %.1f cm" % dist)
            time.sleep(1)

    except KeyboardInterrupt:
        pass
    finally:
        sensor.close()
