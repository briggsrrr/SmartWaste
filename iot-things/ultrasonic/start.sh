#!/usr/bin/env bash
# stop script on error
set -e


# run pub/sub sample app using certificates downloaded in package
printf "\nSmartWaste Starting...\n"
python3 ultrasonic.py --endpoint a32sdds57c4zsq-ats.iot.us-west-2.amazonaws.com --ca_file root-CA.crt --cert trashThing.cert.pem --key trashThing.private.key --client_id basicPubSub --topic smartwaste/distance --count 0