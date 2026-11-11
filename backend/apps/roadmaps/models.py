from django.db import models
from django.conf import settings
from apps.exams.models import Exam


class RoadmapTemplate(models.Model):
    class Level(models.TextChoices):
        BEGINNER = 'Beginner', 'Beginner'
        INTERMEDIATE = 'Intermediate', 'Intermediate'
        ADVANCED = 'Advanced', 'Advanced'

    class Status(models.TextChoices):
        PUBLISHED = 'Published', 'Published'
        DRAFT = 'Draft', 'Draft'

    title = models.CharField(max_length=255)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='roadmap_templates')
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.BEGINNER)
    duration_weeks = models.IntegerField(default=24)
    daily_study_hours = models.IntegerField(default=4)
    revision_frequency_days = models.IntegerField(default=7)
    mock_test_frequency_weeks = models.IntegerField(default=2)
    phases = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PUBLISHED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.exam.name} - {self.level})"


class StudentRoadmap(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_roadmaps')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='student_roadmaps')
    template = models.ForeignKey(RoadmapTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    target_date = models.DateField(null=True, blank=True)
    daily_study_hours = models.IntegerField(default=4)
    level = models.CharField(max_length=50, default='Beginner')
    generated_schedule = models.JSONField(default=dict)
    progress_percentage = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.name} - {self.exam.name} Roadmap"
