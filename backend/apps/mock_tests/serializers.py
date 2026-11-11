from rest_framework import serializers
from .models import MockTest, TestAttempt
from apps.questions.serializers import QuestionSerializer


class MockTestSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='exam.name', read_only=True)
    questions_count = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = MockTest
        fields = [
            'id', 'title', 'exam', 'exam_name', 'category', 'duration_minutes',
            'total_marks', 'passing_marks', 'negative_marking', 'instructions',
            'status', 'questions', 'questions_count', 'attempts_count',
            'created_at', 'updated_at'
        ]


class MockTestDetailSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='exam.name', read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = MockTest
        fields = '__all__'


class TestAttemptSerializer(serializers.ModelSerializer):
    mock_test_title = serializers.CharField(source='mock_test.title', read_only=True)
    student_name = serializers.CharField(source='student.name', read_only=True)

    class Meta:
        model = TestAttempt
        fields = '__all__'
        read_only_fields = ['id', 'student', 'completed_at']
