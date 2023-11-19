from rest_framework import serializers
from .models import IrrigationRecord
from django.contrib.auth import get_user_model
class IrrigationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = IrrigationRecord
        fields = ['plant_id', 'volume', 'timestamp']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'password')
        extra_kwargs = {'password': {'write_only': True, 'min_length': 8}}

    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)
