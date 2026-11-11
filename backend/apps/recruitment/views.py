from rest_framework import generics, permissions
from .models import JobPosting
from .serializers import JobPostingSerializer
from apps.accounts.permissions import IsAdminOrReadOnly


class JobPostingListCreateView(generics.ListCreateAPIView):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search')
        state = self.request.query_params.get('state')
        important = self.request.query_params.get('important')

        if search:
            qs = qs.filter(title__icontains=search) | qs.filter(organization__icontains=search) | qs.filter(qualification__icontains=search)
        if state:
            qs = qs.filter(state__iexact=state)
        if important is not None:
            qs = qs.filter(is_important=True)
        return qs


class JobPostingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    lookup_field = 'job_id'
    permission_classes = [IsAdminOrReadOnly]
