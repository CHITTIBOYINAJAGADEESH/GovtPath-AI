from django.contrib import admin
from django.urls import path, include
from apps.core.views import DashboardStatsView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/exams/', include('apps.exams.urls')),
    path('api/syllabus/', include('apps.syllabus.urls')),
    path('api/questions/', include('apps.questions.urls')),
    path('api/mock-tests/', include('apps.mock_tests.urls')),
    path('api/roadmaps/', include('apps.roadmaps.urls')),
    path('api/jobs/', include('apps.recruitment.urls')),
    path('api/audit/', include('apps.audit.urls')),
    path('api/dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
]
