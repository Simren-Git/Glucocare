from rest_framework import serializers
from .models import Users, Patient,BloodSugarRecord


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class BloodSugarRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodSugarRecord
        fields = '__all__'