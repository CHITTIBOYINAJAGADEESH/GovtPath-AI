from django.urls import path
from .views import (
    CategoryListCreateView,
    CategoryDetailView,
    ExamListCreateView,
    ExamDetailView,
    CustomExamRequestListCreateView,
    CustomExamRequestDetailView,
    approve_custom_exam,
)

urlpatterns = [
    path('categories/', CategoryListCreateView.as_view(), name='category_list_create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category_detail'),
    path('', ExamListCreateView.as_view(), name='exam_list_create'),
    path('<slug:slug>/', ExamDetailView.as_view(), name='exam_detail'),
    path('requests/custom/', CustomExamRequestListCreateView.as_view(), name='custom_exam_requests'),
    path('requests/custom/<int:pk>/', CustomExamRequestDetailView.as_view(), name='custom_exam_request_detail'),
    path('requests/custom/<int:pk>/approve/', approve_custom_exam, name='approve_custom_exam'),
]
