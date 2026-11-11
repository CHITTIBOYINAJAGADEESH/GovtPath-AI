from rest_framework import generics, permissions
from .models import AuditLog, Announcement
from .serializers import AuditLogSerializer, AnnouncementSerializer
from apps.accounts.permissions import IsAdminUserRole, IsAdminOrReadOnly


class AuditLogListCreateView(generics.ListCreateAPIView):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminUserRole]

    def perform_create(self, serializer):
        req = self.request
        admin_name = req.user.name if req.user.is_authenticated else 'Administrator'
        admin_email = req.user.email if req.user.is_authenticated else 'admin@govtpath.ai'
        serializer.save(admin_name=admin_name, admin_email=admin_email)


class AnnouncementListCreateView(generics.ListCreateAPIView):
    queryset = Announcement.objects.filter(is_active=True)
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAdminOrReadOnly]
