import paho.mqtt.client as mqtt #make sure you have installed mqtt client library for python
import ssl
import json
import time
import thread

#defining necessary pins
led = 13

#Importing Intel Galileo Official UPM Library
import pyupm_grove as grove

# Create the temperature sensor object using AIO pin 0
temp = grove.GroveTemp(0)

# Create the light sensor object using AIO pin 0
light = grove.GroveLight(1)

# make sure python wiring x86 library is installed.
# Import the GPIOEdison class from the wiringx86 module.
from wiringx86 import GPIOGalileoGen2 as GPIO
gpio = GPIO()

gpio.pinMode(led, gpio.OUTPUT)

#defining topics
ledTopic    = "things/galileo"


def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe(ledTopic)
    print("Subscribed to Necessary Topics")

def on_message(client, userdata, msg):
    print "Message Topic :" + str(msg.topic)
    print "Message :" + str(msg.payload)
    if str(msg.topic) == ledTopic:
	blinkLED(str(msg.payload))



def blinkLED(msg):
    jsonData = json.loads(msg)
    print jsonData
    for x in range(0,(jsonData['loopFor'])):
        gpio.digitalWrite(led, gpio.HIGH)
        time.sleep(jsonData['Period'])
        gpio.digitalWrite(led, gpio.LOW)
        time.sleep(jsonData['Period'])
    print "Blink LED Done"



client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.tls_set(ca_certs='./cert/rootCA.pem', certfile='./cert/805dfbd8a4-certificate.pem.crt', keyfile='./cert/805dfbd8a4-private.pem.key', tls_version=ssl.PROTOCOL_SSLv23)
client.tls_insecure_set(True)
client.connect("a3625s8vviv03p.iot.us-east-1.amazonaws.com", 8883, 60) #Taken from REST API endpoint


client.loop_forever() #MQTT's will never end
