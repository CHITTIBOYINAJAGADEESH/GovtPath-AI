from django.db import models
from django.conf import settings
from apps.exams.models import Exam
from apps.questions.models import Question


class MockTest(models.Model):
    class TestCategory(models.TextChoices):
        FULL_LENGTH = 'Full-Length Tests', 'Full-Length Tests'
        SUBJECT_WISE = 'Subject-Wise Tests', 'Subject-Wise Tests'
        CHAPTER_WISE = 'Chapter-Wise Tests', 'Chapter-Wise Tests'
        PYQ = 'Previous-Year Practice Tests', 'Previous-Year Practice Tests'

    class Status(models.TextChoices):
        PUBLISHED = 'Published', 'Published'
        DRAFT = 'Draft', 'Draft'
        ARCHIVED = 'Archived', 'Archived'

    title = models.CharField(max_length=255)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='mock_tests')
    category = models.CharField(max_length=50, choices=TestCategory.choices, default=TestCategory.FULL_LENGTH)
    duration_minutes = models.IntegerField(default=120)
    total_marks = models.FloatField(default=200.0)
    passing_marks = models.FloatField(default=80.0)
    negative_marking = models.FloatField(default=0.66)
    instructions = models.TextField(blank=True, default='Read all instructions carefully before starting.')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PUBLISHED)
    questions = models.ManyToManyField(Question, blank=True, related_name='mock_tests')
    attempts_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.exam.name})"


class TestAttempt(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='test_attempts')
    mock_test = models.ForeignKey(MockTest, on_delete=models.CASCADE, related_name='attempts')
    score = models.FloatField(default=0.0)
    total_marks = models.FloatField(default=200.0)
    accuracy_percentage = models.FloatField(default=0.0)
    time_spent_seconds = models.IntegerField(default=0)
    answers = models.JSONField(default=dict)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-completed_at']

    def __str__(self):
        return f"{self.student.name} - {self.mock_test.title} ({self.score}/{self.total_marks})"
