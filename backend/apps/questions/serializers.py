from rest_framework import serializers
from .models import Question


class QuestionSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='exam.name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    topic_name = serializers.CharField(source='topic.name', read_only=True)

    class Meta:
        model = Question
        fields = [
            'id', 'exam', 'exam_name', 'subject', 'subject_name',
            'topic', 'topic_name', 'question_text', 'question_type',
            'options', 'correct_answer', 'explanation', 'difficulty',
            'marks', 'negative_marks', 'status', 'source_reference',
            'created_at', 'updated_at'
        ]
