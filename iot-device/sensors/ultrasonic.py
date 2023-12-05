#for ultrasonic distance sensor (HC-SR04)
from gpiozero import DistanceSensor
import RPi.GPIO as GPIO
import time

# PIO mode
GPIO.setmode(GPIO.BCM)

# set GPIO pins
GPIO_TRIGGER = 18
GPIO_ECHO = 24

# set GPIO direction
GPIO.setup(GPIO_TRIGGER, GPIO.OUT)
GPIO.setup(GPIO_ECHO, GPIO.IN)


def distance():
    # set Trigger to HIGH
    GPIO.output(GPIO_TRIGGER, True)
 
    # set Trigger after 0.01ms to LOW
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIGGER, False)
 
    StartTime = time.time()
    StopTime = time.time()
 
    # record StartTime
    while GPIO.input(GPIO_ECHO) == 0:
        StartTime = time.time()
 
    # record time of arrival
    while GPIO.input(GPIO_ECHO) == 1:
        StopTime = time.time()
 
    
    TimeElapsed = StopTime - StartTime

    # multiply with the ultrasonic speed (34300 cm/s) and divide by 2
    distance = TimeElapsed * 17150
    distance = round(distance, 2)

    #distance = (TimeElapsed * 34300) / 2
 
    return distance
 
if __name__ == '__main__':
    try:
        while True:
            dist = distance()
            print ("Measured Distance = %.1f cm" % dist)
            time.sleep(1)
 
    except KeyboardInterrupt:
        GPIO.cleanup()
