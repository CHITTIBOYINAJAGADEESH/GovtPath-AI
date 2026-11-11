from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import ExamCategory, Exam, CustomExamRequest
from .serializers import ExamCategorySerializer, ExamSerializer, CustomExamRequestSerializer
from apps.accounts.permissions import IsAdminOrReadOnly, IsAdminUserRole


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = ExamCategory.objects.all().order_by('sort_order', 'name')
    serializer_class = ExamCategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ExamCategory.objects.all()
    serializer_class = ExamCategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class ExamListCreateView(generics.ListCreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        level = self.request.query_params.get('level')
        search = self.request.query_params.get('search')
        popular = self.request.query_params.get('popular')

        # Students only see Active exams by default
        if not (self.request.user and self.request.user.is_authenticated and self.request.user.is_admin_user):
            qs = qs.filter(status=Exam.Status.ACTIVE)

        if category:
            qs = qs.filter(category__slug=category) | qs.filter(category__name__iexact=category)
        if level:
            qs = qs.filter(level__iexact=level)
        if popular is not None:
            qs = qs.filter(is_popular=True)
        if search:
            qs = qs.filter(name__icontains=search) | qs.filter(conducting_body__icontains=search)
        return qs


class ExamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    lookup_field = 'slug'
    permission_classes = [IsAdminOrReadOnly]


class CustomExamRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = CustomExamRequestSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [IsAdminUserRole()]

    def get_queryset(self):
        if self.request.user.is_admin_user:
            return CustomExamRequest.objects.all()
        return CustomExamRequest.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class CustomExamRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomExamRequest.objects.all()
    serializer_class = CustomExamRequestSerializer
    permission_classes = [IsAdminUserRole]


@api_view(['POST'])
@permission_classes([IsAdminUserRole])
def approve_custom_exam(request, pk):
    try:
        custom_req = CustomExamRequest.objects.get(pk=pk)
    except CustomExamRequest.DoesNotExist:
        return Response({'error': 'Custom examination request not found'}, status=status.HTTP_404_NOT_FOUND)

    slug = request.data.get('slug') or custom_req.exam_name.lower().replace(' ', '-').replace('/', '-')
    
    # Create or update catalog exam
    exam, created = Exam.objects.get_or_create(
        slug=slug,
        defaults={
            'name': custom_req.exam_name,
            'conducting_body': custom_req.conducting_body,
            'description': custom_req.description,
            'official_website': custom_req.official_website,
            'status': Exam.Status.ACTIVE,
        }
    )

    custom_req.status = CustomExamRequest.Status.APPROVED
    custom_req.admin_notes = request.data.get('admin_notes', 'Approved into official catalog.')
    custom_req.approved_exam = exam
    custom_req.save()

    return Response({
        'message': 'Custom examination approved and added to active catalog.',
        'exam': ExamSerializer(exam).data,
        'request': CustomExamRequestSerializer(custom_req).data
    })
