from django.db import models
from django.conf import settings


class ExamCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True, default='')
    icon = models.CharField(max_length=50, default='GraduationCap')
    is_visible = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = 'Exam Categories'
        ordering = ['sort_order', 'name']

    def __str__(self):
        return self.name


class Exam(models.Model):
    class Level(models.TextChoices):
        NATIONAL = 'National', 'National Level'
        STATE = 'State', 'State Level'
        UNIVERSITY = 'University', 'University Level'
        CORPORATE = 'Corporate', 'Corporate / Private'

    class Status(models.TextChoices):
        ACTIVE = 'Active', 'Active'
        DRAFT = 'Draft', 'Draft'
        ARCHIVED = 'Archived', 'Archived'

    slug = models.SlugField(max_length=150, unique=True, primary_key=True)
    name = models.CharField(max_length=255)
    category = models.ForeignKey(ExamCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='exams')
    conducting_body = models.CharField('Conducting Body / Authority', max_length=255)
    level = models.CharField(max_length=50, choices=Level.choices, default=Level.NATIONAL)
    state = models.CharField(max_length=100, default='All India')
    qualification = models.TextField(default='Graduate in any discipline')
    age_eligibility = models.CharField(max_length=100, default='21 to 32 years')
    official_website = models.URLField(blank=True, default='')
    application_portal = models.URLField(blank=True, default='')
    pattern = models.TextField(blank=True, default='')
    description = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    is_popular = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_popular', 'name']

    def __str__(self):
        return self.name


class CustomExamRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        UNDER_REVIEW = 'Under Review', 'Under Review'
        APPROVED = 'Approved', 'Approved'
        REJECTED = 'Rejected', 'Rejected'
        NEEDS_CHANGES = 'Needs Changes', 'Needs Changes'

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='custom_exam_requests'
    )
    exam_name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    conducting_body = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    syllabus_info = models.TextField(blank=True, default='')
    official_website = models.URLField(blank=True, default='')
    status = models.CharField(max_length=25, choices=Status.choices, default=Status.PENDING)
    admin_notes = models.TextField(blank=True, default='')
    approved_exam = models.ForeignKey(Exam, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.exam_name} ({self.status})"
