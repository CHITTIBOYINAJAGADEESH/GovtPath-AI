from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Subject, Chapter, Topic, LearningResource
from .serializers import (
    SubjectSerializer,
    ChapterSerializer,
    TopicSerializer,
    LearningResourceSerializer,
)
from apps.accounts.permissions import IsAdminOrReadOnly
from apps.exams.models import Exam


class ExamSyllabusView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, exam_slug):
        try:
            exam = Exam.objects.get(slug=exam_slug)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        subjects = exam.subjects.all().prefetch_related('chapters__topics__resources')
        serializer = SubjectSerializer(subjects, many=True)
        return Response({
            'exam': exam.name,
            'slug': exam.slug,
            'subjects': serializer.data
        })


class SubjectListCreateView(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        exam = self.request.query_params.get('exam')
        if exam:
            qs = qs.filter(exam__slug=exam)
        return qs


class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAdminOrReadOnly]


class ChapterListCreateView(generics.ListCreateAPIView):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = [IsAdminOrReadOnly]


class ChapterDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = [IsAdminOrReadOnly]


class TopicListCreateView(generics.ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsAdminOrReadOnly]


class TopicDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsAdminOrReadOnly]


class LearningResourceListCreateView(generics.ListCreateAPIView):
    queryset = LearningResource.objects.all()
    serializer_class = LearningResourceSerializer
    permission_classes = [IsAdminOrReadOnly]
