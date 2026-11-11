from django.urls import path
from .views import (
    MockTestListCreateView,
    MockTestDetailView,
    SubmitAttemptView,
    StudentAttemptsListView,
)

urlpatterns = [
    path('', MockTestListCreateView.as_view(), name='mock_test_list_create'),
    path('<int:pk>/', MockTestDetailView.as_view(), name='mock_test_detail'),
    path('<int:test_id>/submit/', SubmitAttemptView.as_view(), name='submit_attempt'),
    path('attempts/', StudentAttemptsListView.as_view(), name='student_attempts'),
]
