from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import Group, Permission

class Product(AbstractUser):
    product_id = models.AutoField(primary_key=True)
    is_empty = models.BooleanField(default=True)
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        Token.objects.get_or_create(user=self)
    groups = models.ManyToManyField(Group, related_name='product_groups')
    user_permissions = models.ManyToManyField(Permission, related_name='product_user_permissions')

class IrrigationRecord(models.Model):
    id = models.AutoField(primary_key=True)
    plant_id = models.IntegerField(default=0)
    volume = models.FloatField()
    timestamp = models.DateTimeField()

class Record(models.Model):
    plant_id = models.IntegerField(default=0)
    humidity = models.FloatField()
    temperature = models.FloatField()
    timestamp = models.DateTimeField()

class Plant(models.Model):
    plant_id = models.AutoField(primary_key=True)
    product_id = models.IntegerField(default=0)
    name = models.CharField(max_length=255,default="Flower")
    humidity_low = models.FloatField()
    humidity_high = models.FloatField()
    temperature_low = models.FloatField()
    temperature_high = models.FloatField()
    description = models.CharField(max_length=255,default="")
    status = models.CharField(max_length=30,default="In Progress")

class Alert(models.Model):
    # product_id = models.ForeignKey(Product,on_delete=models.CASCADE)
    plant_id = models.ForeignKey(Plant, on_delete=models.CASCADE)
    # alert_id = models.IntegerField(default=1)
    alert_type = models.CharField(max_length=255,default="")
    timestamp = models.DateTimeField()
    content = models.CharField(max_length=255,default="")

class History(models.Model):
    name = models.CharField(max_length=255,default="Flower")
    product_id = models.IntegerField(default=0)
    description = models.CharField(max_length=255,default="")
    status = models.CharField(max_length=30)
