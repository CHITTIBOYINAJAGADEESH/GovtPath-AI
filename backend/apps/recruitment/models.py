from django.db import models


class JobPosting(models.Model):
    class Status(models.TextChoices):
        VERIFIED = 'Verified', 'Verified'
        ACTIVE = 'Active', 'Active'
        EXPIRED = 'Expired', 'Expired'
        UPCOMING = 'Upcoming', 'Upcoming'

    job_id = models.CharField(max_length=100, unique=True, primary_key=True)
    title = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    organization = models.CharField(max_length=255)
    qualification = models.TextField()
    age_limit = models.CharField(max_length=150)
    vacancies = models.CharField(max_length=100)
    location = models.CharField(max_length=150, default='All India')
    state = models.CharField(max_length=150, default='All India')
    application_start_date = models.DateField(null=True, blank=True)
    application_closing_date = models.DateField(null=True, blank=True)
    application_window = models.CharField(max_length=150, blank=True, default='')
    official_portal = models.URLField()
    apply_portal = models.URLField()
    gazette_reference = models.CharField(max_length=255, blank=True, default='')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.VERIFIED)
    is_important = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_important', '-created_at']

    def __str__(self):
        return f"{self.title} ({self.organization})"
