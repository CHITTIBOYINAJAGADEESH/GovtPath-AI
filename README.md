# GovtPath AI – Full-Stack Competitive Examination Platform

GovtPath AI is an enterprise all-in-one preparation and administration platform for Indian Government and Competitive Examinations (UPSC, JEE, NEET, SSC, RRB, Banking, State PSCs, and more).

## Project Architecture

```
govtpath-ai/
├── backend/                              # Django 6.1 + DRF + PostgreSQL 18
│   ├── apps/                             # Modular Domain Apps
│   │   ├── accounts/                     # Custom User, Roles & JWT Auth
│   │   ├── exams/                        # Exam Catalog & Approvals
│   │   ├── syllabus/                     # Syllabus Hierarchies
│   │   ├── questions/                    # Question Bank
│   │   ├── mock_tests/                   # Mock Test Engine
│   │   ├── roadmaps/                     # AI Roadmaps
│   │   ├── recruitment/                  # Govt Job Notices
│   │   ├── audit/                        # Audit Logging
│   │   └── core/                         # Core Stats & Seeding
│   ├── govtpath_backend/                 # Settings & Root Routing
│   └── manage.py
│
└── frontend/                             # React 18 + Vite + Tailwind CSS
    ├── src/
    │   ├── admin/                        # Administrative Management Portal (24+ modules)
    │   ├── api/                          # Axios API Client with JWT Bearer Interceptors
    │   ├── components/                   # Reusable UI & Layout Components
    │   ├── pages/                        # Student Portal Pages
    │   ├── services/                     # Synchronized Service Layer
    │   └── store/                        # Zustand Global State
    ├── package.json
    └── tailwind.config.js
```

## Quick Start Guide

### 1. Backend (Django + PostgreSQL)
```bash
cd backend

# Apply database migrations
python manage.py migrate

# Seed initial examinations, questions, mock tests, and admin
python manage.py seed_data

# Run development server (runs on port 8000)
python manage.py runserver 127.0.0.1:8000
```

### 2. Frontend (React + Vite)
```bash
cd frontend

# Install dependencies
npm install

# Start development server (runs on port 5173)
npm run dev

# Or build and preview production bundle
npm run build
npm run preview -- --port 4173
```

## Database & pgAdmin 4 Access
- **Database**: `govtpath_db`
- **Host**: `127.0.0.1` | **Port**: `5432`
- **User**: `postgres` | **Password**: `YOUR_PASSWORD`
- Open **pgAdmin 4**, connect to `PostgreSQL 18`, and expand `Databases -> govtpath_db -> Schemas -> public -> Tables` to inspect all 28 tables.


