from django.db import models
from apps.exams.models import Exam
from apps.syllabus.models import Subject, Topic


class Question(models.Model):
    class QuestionType(models.TextChoices):
        SINGLE_MCQ = 'Single Correct MCQ', 'Single Correct MCQ'
        MULTIPLE_MCQ = 'Multiple Correct MCQ', 'Multiple Correct MCQ'
        NUMERICAL = 'Numerical Answer', 'Numerical Answer'
        TRUE_FALSE = 'True/False', 'True/False'

    class Difficulty(models.TextChoices):
        EASY = 'Easy', 'Easy'
        MEDIUM = 'Medium', 'Medium'
        HARD = 'Hard', 'Hard'

    class Status(models.TextChoices):
        PUBLISHED = 'Published', 'Published'
        DRAFT = 'Draft', 'Draft'
        REVIEW = 'Pending Review', 'Pending Review'

    exam = models.ForeignKey(Exam, on_delete=models.SET_NULL, null=True, blank=True, related_name='questions')
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True, related_name='questions')
    topic = models.ForeignKey(Topic, on_delete=models.SET_NULL, null=True, blank=True, related_name='questions')
    
    question_text = models.TextField('Question Statement')
    question_type = models.CharField(max_length=50, choices=QuestionType.choices, default=QuestionType.SINGLE_MCQ)
    options = models.JSONField('Answer Options', default=list)
    correct_answer = models.CharField(max_length=255)
    explanation = models.TextField('Detailed Solution / Explanation', blank=True, default='')
    difficulty = models.CharField(max_length=20, choices=Difficulty.choices, default=Difficulty.MEDIUM)
    marks = models.FloatField(default=2.0)
    negative_marks = models.FloatField(default=0.66)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PUBLISHED)
    source_reference = models.CharField(max_length=255, blank=True, default='Official Question Bank')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.difficulty}] {self.question_text[:50]}..."
