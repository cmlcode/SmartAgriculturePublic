#!/usr/bin/env python

import threading
import paho.mqtt.client as mqtt
import time
import sys
import os
import django
import asyncio
import aioschedule as schedule
from datetime import timedelta
from asgiref.sync import sync_to_async

mqttUsername = "fakeUsername"
mqttPassword = "fakePassword"
mqttUrl = "127.0.0.1"
mqttClientId = "fakeClientId"
mqttPort = "fakePort"

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")
django.setup()

from smart_agriculture.models import *
from django.utils import timezone
from django.db import transaction
from django.db.models import Max

@sync_to_async
def fetch_latest_record(plant_id):
    latest_record = Record.objects.filter(plant_id=plant_id).aggregate(Max('timestamp'))
    if not latest_record['timestamp__max']:
        return None
    return Record.objects.get(plant_id=plant_id, timestamp=latest_record['timestamp__max'])


@sync_to_async
def create_alert_sync(plant, alert_type, value, timestamp):
    with transaction.atomic():
        Alert.objects.create(
            plant_id=plant,
            alert_type=alert_type,
            content=f'{alert_type} is out of range: {value}',
            timestamp=timestamp
        )

@sync_to_async
def get_in_progress_plants():
    return list(Plant.objects.filter(status="In progress"))

async def check_last_record():
    plant_qs = await get_in_progress_plants()
    for plant in plant_qs:
        latest_record = await fetch_latest_record(plant.pk)
        if not latest_record:
            continue

        if latest_record.timestamp < timezone.now() - timedelta(seconds=30):
            print(f'{plant.name} has not been updated for over 30 seconds.')
        humidity_out_of_range = latest_record.humidity < plant.humidity_low or latest_record.humidity > plant.humidity_high
        temperature_out_of_range = latest_record.temperature < plant.temperature_low or latest_record.temperature > plant.temperature_high
        
        if humidity_out_of_range:
            await create_alert_sync(plant, 'Humidity', latest_record.humidity, latest_record.timestamp)
            
        if temperature_out_of_range:
            await create_alert_sync(plant, 'Temperature', latest_record.temperature, latest_record.timestamp)

async def scheduler():
    schedule.every(30).seconds.do(check_last_record)
    while True:
        await schedule.run_pending()
        await asyncio.sleep(1)

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe("esp32/environment")
    client.subscribe("esp32/Irrgation")

def on_message(client, userdata, msg):
    if msg.topic=="esp32/environment":
        print("message come:")
        text = msg.payload.decode()
        print(text)
        temperature,humidity = text.split()
        humidity = float(humidity)
        temperature = float(temperature)
        timezone.now()
        Record.objects.create(plant_id=1,humidity=humidity,temperature=temperature,timestamp=timezone.now())
    elif msg.topic=="esp32/Irrigation":
        text = msg.payload.decode()
        print(text)
        plant_id,volume = text.split()
        volume = float(volume)
        IrrigationRecord.objects.create(plant_id=plant_id,volume=volume,timestamp=timezone.now())

client = mqtt.Client()
client.username_pw_set(mqttUsername, mqttPassword)
client.on_connect = on_connect
client.on_message = on_message
client.connect(mqttUrl, mqttClientId, mqttPort)

def run_mqtt():
    print("start mqtt")
    client.loop_forever()

if __name__ == '__main__':
    mqtt_thread = threading.Thread(target=run_mqtt)
    mqtt_thread.start()

    asyncio.run(scheduler())
