from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import MockTest, TestAttempt
from .serializers import MockTestSerializer, MockTestDetailSerializer, TestAttemptSerializer
from apps.accounts.permissions import IsAdminOrReadOnly, IsAdminUserRole


class MockTestListCreateView(generics.ListCreateAPIView):
    queryset = MockTest.objects.all()
    serializer_class = MockTestSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        exam = self.request.query_params.get('exam')
        category = self.request.query_params.get('category')

        if not (self.request.user and self.request.user.is_authenticated and self.request.user.is_admin_user):
            qs = qs.filter(status=MockTest.Status.PUBLISHED)

        if exam:
            qs = qs.filter(exam__slug=exam)
        if category:
            qs = qs.filter(category=category)
        return qs


class MockTestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MockTest.objects.all()
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return MockTestDetailSerializer
        return MockTestSerializer


class SubmitAttemptView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, test_id):
        try:
            mock_test = MockTest.objects.get(pk=test_id)
        except MockTest.DoesNotExist:
            return Response({'error': 'Mock test not found'}, status=status.HTTP_404_NOT_FOUND)

        answers = request.data.get('answers', {})
        time_spent = request.data.get('time_spent_seconds', 0)

        # Calculate score
        score = 0.0
        correct_count = 0
        total_q = mock_test.questions.count()

        for q in mock_test.questions.all():
            q_id_str = str(q.id)
            if q_id_str in answers:
                if str(answers[q_id_str]).strip().lower() == str(q.correct_answer).strip().lower():
                    score += q.marks
                    correct_count += 1
                else:
                    score = max(0, score - q.negative_marks)

        accuracy = (correct_count / max(1, len(answers))) * 100 if len(answers) > 0 else 0.0

        attempt = TestAttempt.objects.create(
            student=request.user,
            mock_test=mock_test,
            score=round(score, 2),
            total_marks=mock_test.total_marks,
            accuracy_percentage=round(accuracy, 1),
            time_spent_seconds=time_spent,
            answers=answers
        )

        mock_test.attempts_count += 1
        mock_test.save()

        return Response(TestAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)


class StudentAttemptsListView(generics.ListAPIView):
    serializer_class = TestAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_admin_user:
            return TestAttempt.objects.all()
        return TestAttempt.objects.filter(student=self.request.user)
