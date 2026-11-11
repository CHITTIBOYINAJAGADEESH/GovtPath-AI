from django.urls import path
from .views import AuditLogListCreateView, AnnouncementListCreateView

urlpatterns = [
    path('logs/', AuditLogListCreateView.as_view(), name='audit_logs'),
    path('announcements/', AnnouncementListCreateView.as_view(), name='announcements'),
]
