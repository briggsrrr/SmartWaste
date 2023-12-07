from picamera import PiCamera
import time

camera = PiCamera()
time.sleep(2)

for i in range(10):
    camera.capture('image{0:04d}.jpg'.format(i))
    time.sleep(1)