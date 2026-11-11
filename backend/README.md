# GovtPath AI - Django REST Backend

Enterprise RESTful API backend for GovtPath AI powered by Django 6.1, Django REST Framework, SimpleJWT, and PostgreSQL 18.

## Technology Stack
- **Framework**: Django 6.1.3 & Django REST Framework 3.18.3
- **Authentication**: `djangorestframework-simplejwt` (JWT Access & Refresh Tokens)
- **Database**: PostgreSQL 18 (Database: `govtpath_db`)
- **pgAdmin 4**: Fully compatible and inspectable
- **CORS**: `django-cors-headers`

## Architecture & Domain Apps (`apps/`)
- `accounts`: Custom `User` model, Roles (`SUPER_ADMIN`, `ADMIN`, `STUDENT`), JWT token generation, registration, profile views, and RBAC permissions.
- `exams`: Examination catalog, Categories, Custom examination submission & approval pipeline, Exam patterns.
- `syllabus`: Multi-tiered syllabus hierarchy (Exam -> Subject -> Chapter -> Topic -> Learning Resources).
- `questions`: Question bank with options, marking schemes, explanations, difficulty ratings, and bulk import.
- `mock_tests`: Mock test definitions, sections, student test attempts, and auto-scoring.
- `roadmaps`: Roadmap templates, preparation rules, and personalized student roadmaps.
- `recruitment`: Official Government Job notices, gazette references, and eligibility details.
- `audit`: Administrative audit trail, system notices, and platform analytics.
- `core`: Shared aggregate KPI endpoint (`/api/dashboard/stats/`) and database seed command.

## Setup & Running

### 1. Database Configuration
PostgreSQL 18 is configured with the following credentials:
- **Host**: `127.0.0.1`
- **Port**: `5432`
- **Database**: `govtpath_db`
- **User**: `postgres`
- **Password**: `jagga2527`

### 2. Apply Migrations & Seed Data
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py seed_data
```

### 3. Start Development Server
```bash
python manage.py runserver 127.0.0.1:8000
```

## Default Credentials
- **Super Administrator**:
  - Email: `jagadeeshchittiboyina07@gmail.com`
  - Password: `jagga12`
  - Role: `SUPER_ADMIN`
- **Sample Aspirant / Student**:
  - Email: `rahul.aspirant@gmail.com`
  - Password: `aspirant123`
  - Role: `STUDENT`

## Core API Endpoints
- `POST /api/auth/token/` - JWT Login (returns access & refresh tokens)
- `POST /api/auth/token/refresh/` - JWT Token Refresh
- `POST /api/auth/register/` - Student Registration
- `GET /api/auth/me/` - Authenticated User Profile
- `GET, POST /api/exams/` - Examination Catalogue
- `GET, POST /api/exams/requests/custom/` - Custom Exam Requests
- `POST /api/exams/requests/custom/<id>/approve/` - Approve Custom Exam into Catalogue
- `GET /api/syllabus/exam/<slug>/` - Complete Syllabus Hierarchy
- `GET, POST /api/questions/` - Question Bank
- `POST /api/questions/bulk-import/` - Bulk Question Import
- `GET, POST /api/mock-tests/` - Mock Examinations
- `POST /api/mock-tests/<id>/submit/` - Submit Mock Test Attempt
- `GET /api/jobs/` - Government Job Recruitment Notices
- `GET /api/dashboard/stats/` - Live Platform KPI Aggregations
