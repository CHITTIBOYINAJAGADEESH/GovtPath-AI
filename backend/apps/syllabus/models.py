from django.db import models
from apps.exams.models import Exam


class Subject(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='subjects')
    name = models.CharField(max_length=255)
    weightage = models.FloatField('Weightage %', default=25.0)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.exam.name} - {self.name}"


class Chapter(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='chapters')
    name = models.CharField(max_length=255)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.subject.name} -> {self.name}"


class Topic(models.Model):
    class Difficulty(models.TextChoices):
        EASY = 'Easy', 'Easy'
        MEDIUM = 'Medium', 'Medium'
        HARD = 'Hard', 'Hard'

    class Status(models.TextChoices):
        DRAFT = 'Draft', 'Draft'
        PUBLISHED = 'Published', 'Published'
        ARCHIVED = 'Archived', 'Archived'

    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='topics')
    name = models.CharField(max_length=255)
    difficulty = models.CharField(max_length=20, choices=Difficulty.choices, default=Difficulty.MEDIUM)
    estimated_hours = models.FloatField(default=6.0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PUBLISHED)
    subtopics = models.JSONField(default=list, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class LearningResource(models.Model):
    class ResourceType(models.TextChoices):
        PDF = 'PDF', 'PDF Notes'
        VIDEO = 'Video', 'Video Lecture'
        ARTICLE = 'Article', 'Reference Article'
        PYQ = 'PYQ', 'Previous Year Questions'

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='resources')
    title = models.CharField(max_length=255)
    resource_type = models.CharField(max_length=20, choices=ResourceType.choices, default=ResourceType.PDF)
    url = models.URLField()
    is_verified = models.BooleanField(default=True)
    author = models.CharField(max_length=150, blank=True, default='Official / Verified Staff')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.resource_type}] {self.title}"
