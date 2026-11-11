from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Question
from .serializers import QuestionSerializer
from apps.accounts.permissions import IsAdminOrReadOnly, IsAdminUserRole


class QuestionListCreateView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        exam = self.request.query_params.get('exam')
        subject = self.request.query_params.get('subject')
        difficulty = self.request.query_params.get('difficulty')
        search = self.request.query_params.get('search')

        if not (self.request.user and self.request.user.is_authenticated and self.request.user.is_admin_user):
            qs = qs.filter(status=Question.Status.PUBLISHED)

        if exam:
            qs = qs.filter(exam__slug=exam)
        if subject:
            qs = qs.filter(subject__name__iexact=subject) | qs.filter(subject__id=subject)
        if difficulty:
            qs = qs.filter(difficulty__iexact=difficulty)
        if search:
            qs = qs.filter(question_text__icontains=search)
        return qs


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAdminOrReadOnly]


class BulkImportQuestionsView(APIView):
    permission_classes = [IsAdminUserRole]

    def POST(self, request):
        items = request.data.get('questions', [])
        if not isinstance(items, list) or len(items) == 0:
            return Response({'error': 'Please provide a non-empty list of question objects'}, status=status.HTTP_400_BAD_REQUEST)

        created_objs = []
        errors = []
        for idx, item in enumerate(items):
            serializer = QuestionSerializer(data=item)
            if serializer.is_valid():
                created_objs.append(serializer.save())
            else:
                errors.append({'index': idx, 'errors': serializer.errors})

        return Response({
            'message': f"Successfully imported {len(created_objs)} questions.",
            'imported_count': len(created_objs),
            'errors': errors
        }, status=status.HTTP_201_CREATED if len(created_objs) > 0 else status.HTTP_400_BAD_REQUEST)
