from rest_framework import serializers
from .models import RoadmapTemplate, StudentRoadmap


class RoadmapTemplateSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='exam.name', read_only=True)

    class Meta:
        model = RoadmapTemplate
        fields = '__all__'


class StudentRoadmapSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='exam.name', read_only=True)
    student_name = serializers.CharField(source='student.name', read_only=True)

    class Meta:
        model = StudentRoadmap
        fields = '__all__'
        read_only_fields = ['id', 'student', 'created_at', 'updated_at']
