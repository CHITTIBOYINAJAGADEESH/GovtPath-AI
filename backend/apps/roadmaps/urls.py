from django.urls import path
from .views import (
    RoadmapTemplateListCreateView,
    RoadmapTemplateDetailView,
    StudentRoadmapListCreateView,
    StudentRoadmapDetailView,
)

urlpatterns = [
    path('templates/', RoadmapTemplateListCreateView.as_view(), name='roadmap_template_list_create'),
    path('templates/<int:pk>/', RoadmapTemplateDetailView.as_view(), name='roadmap_template_detail'),
    path('my/', StudentRoadmapListCreateView.as_view(), name='student_roadmaps'),
    path('my/<int:pk>/', StudentRoadmapDetailView.as_view(), name='student_roadmap_detail'),
]
