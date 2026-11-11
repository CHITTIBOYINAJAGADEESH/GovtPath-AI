from django.db import models


class AuditLog(models.Model):
    action = models.CharField(max_length=50)
    module = models.CharField(max_length=100)
    record_id = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField()
    admin_name = models.CharField(max_length=150, default='System Administrator')
    admin_email = models.CharField(max_length=150, default='admin@govtpath.ai')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.action}] {self.module} - {self.description[:40]}"


class Announcement(models.Model):
    title = models.CharField(max_length=255)
    message = models.TextField()
    category = models.CharField(max_length=50, default='Notice')
    priority = models.CharField(max_length=20, default='Normal')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
