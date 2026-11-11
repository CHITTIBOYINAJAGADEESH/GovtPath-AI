from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import RoadmapTemplate, StudentRoadmap
from .serializers import RoadmapTemplateSerializer, StudentRoadmapSerializer
from apps.accounts.permissions import IsAdminOrReadOnly


class RoadmapTemplateListCreateView(generics.ListCreateAPIView):
    queryset = RoadmapTemplate.objects.all()
    serializer_class = RoadmapTemplateSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        exam = self.request.query_params.get('exam')
        if exam:
            qs = qs.filter(exam__slug=exam)
        return qs


class RoadmapTemplateDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RoadmapTemplate.objects.all()
    serializer_class = RoadmapTemplateSerializer
    permission_classes = [IsAdminOrReadOnly]


class StudentRoadmapListCreateView(generics.ListCreateAPIView):
    serializer_class = StudentRoadmapSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_admin_user:
            return StudentRoadmap.objects.all()
        return StudentRoadmap.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class StudentRoadmapDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StudentRoadmapSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_admin_user:
            return StudentRoadmap.objects.all()
        return StudentRoadmap.objects.filter(student=self.request.user)
