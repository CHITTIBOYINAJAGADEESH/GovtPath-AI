from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email address is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.SUPER_ADMIN)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'
        ADMIN = 'ADMIN', 'Admin / Content Moderator'
        STUDENT = 'STUDENT', 'Student / Aspirant'

    class AccountStatus(models.TextChoices):
        ACTIVE = 'Active', 'Active'
        SUSPENDED = 'Suspended', 'Suspended'
        PENDING = 'Pending', 'Pending'

    username = None
    email = models.EmailField('Email Address', unique=True)
    name = models.CharField('Full Name', max_length=255, blank=True)
    role = models.CharField(
        'User Role',
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT,
    )
    status = models.CharField(
        'Account Status',
        max_length=20,
        choices=AccountStatus.choices,
        default=AccountStatus.ACTIVE,
    )
    department = models.CharField('Department / Organization', max_length=150, blank=True, default='')
    phone = models.CharField('Phone Number', max_length=25, blank=True, default='')
    avatar = models.URLField('Avatar URL', blank=True, default='')
    
    # Aspirant preferences
    target_exam = models.CharField('Target Examination', max_length=100, blank=True, default='')
    study_hours_per_day = models.IntegerField('Daily Study Hours', default=4)
    preparation_level = models.CharField('Preparation Level', max_length=50, default='Beginner')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return f"{self.name or self.email} ({self.role})"

    @property
    def is_admin_user(self):
        return self.role in [self.Role.SUPER_ADMIN, self.Role.ADMIN] or self.is_superuser
