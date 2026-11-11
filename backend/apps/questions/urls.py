from django.urls import path
from .views import (
    QuestionListCreateView,
    QuestionDetailView,
    BulkImportQuestionsView,
)

urlpatterns = [
    path('', QuestionListCreateView.as_view(), name='question_list_create'),
    path('<int:pk>/', QuestionDetailView.as_view(), name='question_detail'),
    path('bulk-import/', BulkImportQuestionsView.as_view(), name='bulk_import_questions'),
]
