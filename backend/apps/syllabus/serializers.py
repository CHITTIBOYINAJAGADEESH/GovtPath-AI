from rest_framework import serializers
from .models import Subject, Chapter, Topic, LearningResource


class LearningResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningResource
        fields = '__all__'


class TopicSerializer(serializers.ModelSerializer):
    resources = LearningResourceSerializer(many=True, read_only=True)
    resources_count = serializers.IntegerField(source='resources.count', read_only=True)

    class Meta:
        model = Topic
        fields = ['id', 'chapter', 'name', 'difficulty', 'estimated_hours', 'status', 'subtopics', 'order', 'resources', 'resources_count']


class ChapterSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)

    class Meta:
        model = Chapter
        fields = ['id', 'subject', 'name', 'order', 'topics']


class SubjectSerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)

    class Meta:
        model = Subject
        fields = ['id', 'exam', 'name', 'weightage', 'order', 'chapters']
