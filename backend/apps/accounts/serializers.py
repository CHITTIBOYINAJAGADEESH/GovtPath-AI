from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['name'] = user.name
        token['role'] = user.role
        token['is_admin'] = user.is_admin_user
        token['avatar'] = user.avatar
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'name': self.user.name,
            'role': self.user.role,
            'is_admin': self.user.is_admin_user,
            'department': self.user.department,
            'avatar': self.user.avatar,
            'status': self.user.status,
            'target_exam': self.user.target_exam,
            'study_hours_per_day': self.user.study_hours_per_day,
        }
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'role', 'status', 'department',
            'phone', 'avatar', 'target_exam', 'study_hours_per_day',
            'preparation_level', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'name', 'target_exam', 'study_hours_per_day']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(
            role=User.Role.STUDENT,
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user
