rom django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import *
import openai
import os
from ai import chatGPT
from django.utils import timezone
from datetime import timedelta
from rest_framework import status
from django.contrib.auth.views import LoginView

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes,api_view

# Create your views here.

openai.api_key = os.getenv("OPENAI_API_KEY")

import paho.mqtt.client as mqtt

class CustomLoginView(LoginView):
    template_name = 'login.html'

def loginPage(request):
    return render(request,'login.html')

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def TokenCheck(request):
    return JsonResponse({"status":"success"},status=200) 

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def findHistoryByID(request):
    result = Plant.objects.get(plant_id=request.GET['plant_id'])
    return HttpResponse(result)

def index(request):
    return render(request,"index.html")

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def configration(request):
    Plant.objects.create(plant_id=request.GET['plant_id'],plant_name=request.GET['plant_name'],plant_type=request.GET['plant_type'],plant_location=request.GET['plant_location'])

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getRecord(request):
    plant_id = request.GET['id']
    items = Record.objects.filter(plant_id=plant_id)
    data = data = [{"humidity": env.humidity, "temperature": env.temperature, "timestamp": env.timestamp.strftime('%Y-%m-%d %H:%M:%S')} for env in items]
    return JsonResponse(data, safe=False)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def autoConfig(request):
    plant = request.GET['plant_name']
    result = chatGPT(plant)
    return HttpResponse(result)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def applyConfig(request):
    plant_id = request.GET['plant_id']
    humidity_low = request.GET['humidity_low']
    humidity_high = request.GET['humidity_high']
    temperature_low = request.GET['temperature_low']
    temperature_high = request.GET['temperature_high']
    description = request.GET['description']
    name = request.GET['plant_name']
    if Plant.objects.filter(plant_id=plant_id).exists():
        Plant.objects.filter(plant_id=plant_id).update(humidity_low=humidity_low,humidity_high=humidity_high,temperature_low=temperature_low,temperature_high=temperature_high,name=name,description=description,status="In progress")
    else:    
        product_id = request.GET['product_id']
        Plant.objects.create(plant_id=plant_id,product_id=product_id,name=name,humidity_low=humidity_low,humidity_high=humidity_high,temperature_low=temperature_low,temperature_high=temperature_high,description=description,status="In progress")
    broker_address= "localhost"
    broker_port = 1883
    client = mqtt.Client()
    client.connect(broker_address, broker_port)
    client.publish('config',"{} {} {} {} {}".format(plant_id,humidity_low,humidity_high,temperature_low,temperature_high))
    client.disconnect()
    Product.objects.filter(product_id=0).update(is_empty=0)
    return HttpResponse("success")

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getLatest(request):
    plant_id = request.GET['plant_id']
    now = timezone.now()
    start_time = now - timedelta(days=1)
    latest = Record.objects.filter(plant_id=plant_id).order_by('-timestamp')[0]
    return JsonResponse({"temperature":latest.temperature,"humidity":latest.humidity})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getPlantinfo(request):
    if Product.objects.get(product_id=0).is_empty == 1:
        return JsonResponse({"unknown":"product is empty"})
    plant_id = request.GET['plant_id']
    if not Plant.objects.filter(plant_id=plant_id).exists():
        return JsonResponse({"unknown":"plant not found"})
    plant = Plant.objects.get(plant_id=plant_id)
    return JsonResponse({"plant_name":plant.name,"humidity_low":plant.humidity_low,"humidity_high":plant.humidity_high,"temperature_low":plant.temperature_low,"temperature_high":plant.temperature_high,"description":plant.description})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getAlertLast3(request):
    plant_id = request.GET['plant_id']
    if not Alert.objects.filter(plant_id=plant_id).exists():
        return JsonResponse({"unknown":"alert not found"})
    als=[]
    alerts = Alert.objects.filter(plant_id=plant_id).order_by('-timestamp')
    for alert in alerts:
        als.append({"alert_type":alert.alert_type,"timestamp":alert.timestamp,"content":alert.content})
    return JsonResponse(als,safe=False)

# def getAlertLastAll(request):
#     plant_id = request.GET['plant_id']
#     if not Plant.objects.filter(plant_id=plant_id).exists():
#         return JsonResponse({"unknown":"plant not found"})
#     alert = Alert.objgects.filter(plant_id=plant_id).order_by('-timestamp')
#     return JsonResponse({"alert_id":alert.id, "alert_type": alert.type, "timestamp": alert.timestamp, "content":alert.content})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def terminate(request):
    id = request.GET['id']
    if not Plant.objects.filter(plant_id=id).exists():
        return JsonResponse({"unknown":"plant not found"})
    else:
        target_plant =Plant.objects.get(plant_id=id)        
        target_plant.status="Finished"
        History.objects.create(name=target_plant.name,product_id=target_plant.product_id,description=target_plant.description,status=target_plant.status)
        target_plant.save()
        Product.objects.filter(product_id=target_plant.product_id).update(is_empty=True)
    return HttpResponse("success")

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def abort(request):
    id = request.GET['id']
    if not Plant.objects.filter(plant_id=id).exists():
        return JsonResponse({"unknown":"plant not found"})
    else:
        target_plant =Plant.objects.get(plant_id=id)        
        target_plant.status="Abort"
        History.objects.create(name=target_plant.name,product_id=target_plant.product_id,description=target_plant.description,status=target_plant.status)
        target_plant.save()
        Product.objects.filter(product_id=target_plant.product_id).update(is_empty=True)
    return HttpResponse("success")                                                                                                                                                                                                                                                     

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])    
def getHistory(request):
    ## product id
    id = request.GET['id']
    if not Product.objects.filter(product_id=id).exists():
        return JsonResponse({"unknown":"product not found"})
    ls = []
    plants = History.objects.filter(product_id=id)
    for plant in plants:
        ls.append({"plant_id":plant.pk,"plant_name":plant.name,"description":plant.description,"status":plant.status})
    return JsonResponse(ls,safe=False)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def clear_alert(request):
    id =  request.GET["id"]
    Alert.objects.filter(plant_id=id).delete()
    return HttpResponse("clear successfully")

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getIrrigation(request):
    id=request.GET['id']
    ls = []
    temp = IrrigationRecord.objects.filter(plant_id=id)
    for i in temp:
        ls.append({"id":i.pk,"volume":i.volume,"timestamp":i.timestamp})
    return JsonResponse(ls,safe=False)

def findHistoryPage(request):
    return render(request,"viewHistory.html")

def changePlantState(request):
    return render(request,"changePlantState.html")

def waterPump(request):
    return render(request, 'waterPump.html')
Foo
