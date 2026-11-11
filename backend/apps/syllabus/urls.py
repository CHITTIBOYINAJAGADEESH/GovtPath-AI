from django.urls import path
from .views import (
    ExamSyllabusView,
    SubjectListCreateView,
    SubjectDetailView,
    ChapterListCreateView,
    ChapterDetailView,
    TopicListCreateView,
    TopicDetailView,
    LearningResourceListCreateView,
)

urlpatterns = [
    path('exam/<slug:exam_slug>/', ExamSyllabusView.as_view(), name='exam_syllabus'),
    path('subjects/', SubjectListCreateView.as_view(), name='subject_list_create'),
    path('subjects/<int:pk>/', SubjectDetailView.as_view(), name='subject_detail'),
    path('chapters/', ChapterListCreateView.as_view(), name='chapter_list_create'),
    path('chapters/<int:pk>/', ChapterDetailView.as_view(), name='chapter_detail'),
    path('topics/', TopicListCreateView.as_view(), name='topic_list_create'),
    path('topics/<int:pk>/', TopicDetailView.as_view(), name='topic_detail'),
    path('resources/', LearningResourceListCreateView.as_view(), name='resource_list_create'),
]
