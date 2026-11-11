from rest_framework import serializers
from .models import ExamCategory, Exam, CustomExamRequest


class ExamCategorySerializer(serializers.ModelSerializer):
    exams_count = serializers.IntegerField(source='exams.count', read_only=True)

    class Meta:
        model = ExamCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'is_visible', 'sort_order', 'exams_count']


class ExamSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category = serializers.PrimaryKeyRelatedField(
        queryset=ExamCategory.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Exam
        fields = [
            'slug', 'name', 'category', 'category_name', 'conducting_body',
            'level', 'state', 'qualification', 'age_eligibility',
            'official_website', 'application_portal', 'pattern',
            'description', 'status', 'is_popular', 'created_at', 'updated_at'
        ]

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        cat_val = data.get('category')
        if isinstance(cat_val, str) and not cat_val.isdigit():
            cat = ExamCategory.objects.filter(slug__iexact=cat_val).first() or \
                  ExamCategory.objects.filter(name__icontains=cat_val).first()
            if cat:
                data['category'] = cat.id
            else:
                data.pop('category', None)
        return super().to_internal_value(data)


class CustomExamRequestSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)

    class Meta:
        model = CustomExamRequest
        fields = [
            'id', 'student', 'student_name', 'student_email', 'exam_name',
            'category', 'conducting_body', 'description', 'syllabus_info',
            'official_website', 'status', 'admin_notes', 'approved_exam',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
