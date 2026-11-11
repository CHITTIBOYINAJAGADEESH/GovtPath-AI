from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.exams.models import ExamCategory, Exam, CustomExamRequest
from apps.syllabus.models import Subject, Chapter, Topic, LearningResource
from apps.questions.models import Question
from apps.mock_tests.models import MockTest
from apps.recruitment.models import JobPosting
from apps.audit.models import AuditLog, Announcement

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds initial real examination data, syllabus hierarchies, questions, jobs, and admin user into PostgreSQL.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting PostgreSQL Database Seeding for GovtPath AI...'))

        # 1. Super Admin User
        admin_email = 'jagadeeshchittiboyina07@gmail.com'
        admin_pass = 'jagga12'
        admin_user, created = User.objects.get_or_create(
            email=admin_email,
            defaults={
                'name': 'Jagadeesh Chittiboyina',
                'role': User.Role.SUPER_ADMIN,
                'department': 'Executive Administration',
                'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
                'is_staff': True,
                'is_superuser': True,
                'status': User.AccountStatus.ACTIVE,
            }
        )
        admin_user.set_password(admin_pass)
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.role = User.Role.SUPER_ADMIN
        admin_user.save()
        self.stdout.write(self.style.SUCCESS(f"Super Admin initialized: {admin_email}"))

        # Sample Aspirant Users
        student, _ = User.objects.get_or_create(
            email='rahul.aspirant@gmail.com',
            defaults={
                'name': 'Rahul Sharma',
                'role': User.Role.STUDENT,
                'target_exam': 'upsc-civil-services-exam',
                'study_hours_per_day': 5,
                'status': User.AccountStatus.ACTIVE,
            }
        )
        student.set_password('aspirant123')
        student.save()

        student2, _ = User.objects.get_or_create(
            email='ananya.deshmukh@gmail.com',
            defaults={
                'name': 'Ananya Deshmukh',
                'role': User.Role.STUDENT,
                'target_exam': 'jee-main',
                'study_hours_per_day': 6,
                'status': User.AccountStatus.ACTIVE,
            }
        )
        student2.set_password('aspirant123')
        student2.save()

        # 2. Categories
        categories_data = [
            ('UPSC', 'upsc', 'Civil Services, IFS, IES, NDA & Defence administrative exams', 'Shield', 1),
            ('Engineering', 'engineering', 'JEE Main, Advanced, GATE, State Engineering Entrances', 'Cpu', 2),
            ('Medical', 'medical', 'NEET UG, PG, INI-CET, AIIMS Medical Entrances', 'HeartPulse', 3),
            ('SSC', 'ssc', 'Staff Selection Commission - CGL, CHSL, MTS, CPO', 'Award', 4),
            ('Railways', 'railways', 'RRB NTPC, ALP, Group D, Technician, Railway Police', 'Train', 5),
            ('Banking', 'banking', 'IBPS PO, Clerk, SBI PO, RBI Grade B, SO examinations', 'Building2', 6),
            ('State Government', 'state-government', 'State PSCs (APPSC, TSPSC, MPSC, UPPSC, BPSC)', 'Landmark', 7),
            ('Defence', 'defence', 'CDS, NDA, AFCAT, CAPF, Indian Navy & Airforce exams', 'ShieldAlert', 8),
            ('Teaching', 'teaching', 'CTET, State TETs, UGC NET, CSIR NET, Kendriya Vidyalaya', 'GraduationCap', 9),
            ('Management', 'management', 'CAT, XAT, MAT, CMAT, SNAP, IIFT MBA Entrances', 'Briefcase', 10),
            ('University Entrance', 'university-entrance', 'CUET UG/PG, Delhi University, BHU, JNU, TIFR', 'School', 11),
            ('School Boards', 'school-boards', 'CBSE Class 10 & 12, CISCE, State Secondary Boards', 'BookOpen', 12),
        ]

        cat_objs = {}
        for name, slug, desc, icon, order in categories_data:
            cat, _ = ExamCategory.objects.get_or_create(
                slug=slug,
                defaults={'name': name, 'description': desc, 'icon': icon, 'sort_order': order}
            )
            cat_objs[slug] = cat

        # 3. Examinations
        exams_data = [
            {
                'slug': 'upsc-civil-services-exam',
                'name': 'UPSC Civil Services Examination (IAS, IPS, IFS)',
                'category': cat_objs['upsc'],
                'conducting_body': 'Union Public Service Commission',
                'level': Exam.Level.NATIONAL,
                'qualification': 'Bachelor degree in any discipline from a recognized University',
                'age_eligibility': '21 to 32 years (Relaxations as per rules)',
                'official_website': 'https://upsc.gov.in',
                'application_portal': 'https://upsconline.nic.in',
                'pattern': 'Prelims: 2 Papers (Objective MCQs, 400 Marks) | Mains: 9 Descriptive Papers (1750 Marks) | Personality Test (275 Marks)',
                'description': 'Premier national examination conducted to recruit officers for All India Services (IAS, IPS, IFS) and Central Group A & B services.',
                'is_popular': True,
            },
            {
                'slug': 'jee-main',
                'name': 'JEE Main (Joint Entrance Examination)',
                'category': cat_objs['engineering'],
                'conducting_body': 'National Testing Agency (NTA)',
                'level': Exam.Level.NATIONAL,
                'qualification': 'Passed or appearing in Class 12 / equivalent with Physics, Chemistry, Math',
                'age_eligibility': 'No age limit for candidates attempting within 3 consecutive years of Class 12',
                'official_website': 'https://jeemain.nta.nic.in',
                'application_portal': 'https://jeemain.ntaonline.in',
                'pattern': 'Computer Based Test (CBT): 90 Questions (30 Physics, 30 Chemistry, 30 Math). Total 300 Marks.',
                'description': 'National level undergraduate engineering entrance examination for admission into NITs, IIITs, CFTIs and eligibility for JEE Advanced.',
                'is_popular': True,
            },
            {
                'slug': 'neet-ug',
                'name': 'NEET UG (National Eligibility cum Entrance Test)',
                'category': cat_objs['medical'],
                'conducting_body': 'National Testing Agency (NTA)',
                'level': Exam.Level.NATIONAL,
                'qualification': 'Class 12 pass with Physics, Chemistry, Biology/Biotech and English',
                'age_eligibility': 'Minimum 17 years at time of admission; no upper age limit',
                'official_website': 'https://neet.ntaonline.in',
                'application_portal': 'https://neet.ntaonline.in',
                'pattern': 'Pen & Paper Test: 200 MCQs (Attempt 180). Physics (45), Chemistry (45), Biology (90). Total 720 Marks.',
                'description': 'Single nationwide entrance examination for admission to undergraduate medical courses (MBBS, BDS, AYUSH, BVSc) across India.',
                'is_popular': True,
            },
            {
                'slug': 'ssc-cgl',
                'name': 'SSC Combined Graduate Level Examination (CGL)',
                'category': cat_objs['ssc'],
                'conducting_body': 'Staff Selection Commission (SSC)',
                'level': Exam.Level.NATIONAL,
                'qualification': 'Graduation in any discipline from recognized university',
                'age_eligibility': '18 to 32 years (depending on specific post)',
                'official_website': 'https://ssc.gov.in',
                'application_portal': 'https://ssc.gov.in',
                'pattern': 'Tier 1 (Objective CBT, 200 Marks) & Tier 2 (Mathematical Abilities, Reasoning, English, General Awareness, Computer Test)',
                'description': 'Recruitment for Group B and C non-technical gazetted and non-gazetted posts across Government Ministries and Departments.',
                'is_popular': True,
            },
            {
                'slug': 'ibps-po',
                'name': 'IBPS Probationary Officers / Management Trainees (PO/MT)',
                'category': cat_objs['banking'],
                'conducting_body': 'Institute of Banking Personnel Selection',
                'level': Exam.Level.NATIONAL,
                'qualification': 'Degree (Graduation) in any discipline from recognized university',
                'age_eligibility': '20 to 30 years',
                'official_website': 'https://ibps.in',
                'application_portal': 'https://ibpsonline.ibps.in',
                'pattern': 'Prelims: 100 Marks (1 hour) | Mains: 225 Marks (Objective + Descriptive) | Interview: 100 Marks',
                'description': 'Common recruitment process for Probationary Officer vacancies across 11 participating public sector banks in India.',
                'is_popular': True,
            },
            {
                'slug': 'rrb-alp',
                'name': 'RRB Assistant Loco Pilot (ALP)',
                'category': cat_objs['railways'],
                'conducting_body': 'Railway Recruitment Boards (RRB)',
                'level': Exam.Level.NATIONAL,
                'qualification': 'Matriculation / SSLC plus ITI or Diploma in specified Engineering trades',
                'age_eligibility': '18 to 30 years',
                'official_website': 'https://www.rrbapply.gov.in',
                'application_portal': 'https://www.rrbapply.gov.in',
                'pattern': 'CBT-1 (75 MCQs, 60 min) | CBT-2 (Part A: 100 MCQs, Part B: 75 Trade MCQs) | CBAT (Aptitude Test)',
                'description': 'Crucial Indian Railways technical cadre recruitment for operating locomotives safely across passenger and freight sectors.',
                'is_popular': True,
            },
        ]

        exam_objs = {}
        for ex in exams_data:
            obj, _ = Exam.objects.get_or_create(
                slug=ex['slug'],
                defaults=ex
            )
            exam_objs[ex['slug']] = obj

        # 4. Syllabus Hierarchy for JEE Main & UPSC
        # JEE Main
        jee = exam_objs.get('jee-main')
        if jee and not jee.subjects.exists():
            jee_subjects = [
                ('Physics', 33.3, [
                    ('Mechanics & Kinematics', ['Newton Laws of Motion', 'Work Power Energy', 'Rotational Dynamics', 'Gravitation']),
                    ('Thermodynamics & Heat', ['Thermal Expansion', 'First Law of Thermodynamics', 'Carnot Engine', 'Kinetic Theory of Gases']),
                    ('Electromagnetism', ['Electrostatics', 'Current Electricity', 'Magnetic Effects of Current', 'Electromagnetic Induction']),
                ]),
                ('Chemistry', 33.3, [
                    ('Physical Chemistry', ['Atomic Structure', 'Chemical Equilibrium', 'Electrochemistry', 'Chemical Kinetics']),
                    ('Organic Chemistry', ['Hydrocarbons', 'Reaction Mechanisms', 'Alcohols and Ethers', 'Biomolecules']),
                    ('Inorganic Chemistry', ['Periodic Table Trends', 'Chemical Bonding', 'Coordination Compounds', 'p-Block Elements']),
                ]),
                ('Mathematics', 33.4, [
                    ('Calculus', ['Limits and Continuity', 'Derivatives and Applications', 'Definite Integrals', 'Differential Equations']),
                    ('Algebra', ['Complex Numbers', 'Quadratic Equations', 'Matrices and Determinants', 'Permutations & Combinations']),
                    ('Coordinate Geometry', ['Straight Lines', 'Circles', 'Parabola, Ellipse, Hyperbola', '3D Geometry and Vectors']),
                ]),
            ]
            for s_name, weight, chapters in jee_subjects:
                subj = Subject.objects.create(exam=jee, name=s_name, weightage=weight)
                for c_name, topics in chapters:
                    chap = Chapter.objects.create(subject=subj, name=c_name)
                    for t_name in topics:
                        top = Topic.objects.create(
                            chapter=chap,
                            name=t_name,
                            difficulty='Medium',
                            estimated_hours=6.0,
                            subtopics=['Basic Definitions', 'Core Formulations', 'Solved Numerical Problems', 'Previous Year Exam Practice']
                        )
                        LearningResource.objects.create(
                            topic=top,
                            title=f"{t_name} Comprehensive Revision Notes",
                            resource_type=LearningResource.ResourceType.PDF,
                            url='https://cdn.govtpath.ai/resources/notes-demo.pdf'
                        )

        # UPSC Civil Services Exam Syllabus
        upsc = exam_objs.get('upsc-civil-services-exam')
        if upsc and not upsc.subjects.exists():
            upsc_subjects = [
                ('Indian Polity & Governance', 25.0, [
                    ('Constitutional Framework', ['Preamble & Salient Features', 'Fundamental Rights & Duties', 'Directive Principles of State Policy', 'Amendment of Constitution']),
                    ('System of Government', ['Parliamentary System', 'Federal System', 'Centre-State Relations', 'Inter-State Relations']),
                    ('Judiciary & Authorities', ['Supreme Court and High Courts', 'Judicial Review and Activism', 'Election Commission of India', 'Comptroller and Auditor General']),
                ]),
                ('Indian & World Geography', 25.0, [
                    ('Physical Geography', ['Geomorphology & Plate Tectonics', 'Climatology & Monsoons', 'Oceanography', 'Biogeography']),
                    ('Indian Geography', ['Physiographic Divisions', 'River Drainage Systems', 'Climate & Vegetation', 'Mineral & Energy Resources']),
                ]),
                ('Indian Economy & Development', 25.0, [
                    ('Macroeconomic Foundations', ['National Income Accounting', 'Inflation & Monetary Policy', 'Fiscal Policy & Union Budget', 'External Sector & Balance of Payments']),
                    ('Inclusive Growth', ['Agriculture & Food Security', 'Industrial Policies & MSMEs', 'Infrastructure & Logistics', 'Poverty Alleviation Schemes']),
                ]),
                ('General Science & Technology', 25.0, [
                    ('Contemporary Scientific Developments', ['Space Technology & ISRO Missions', 'Biotechnology & Genetic Engineering', 'Artificial Intelligence & Robotics', 'Defence Technology & Missiles']),
                    ('Ecology & Environment', ['Biodiversity & Conservation', 'Climate Change Treaties', 'Pollution Control Acts', 'National Parks & Wildlife Sanctuaries']),
                ]),
            ]
            for s_name, weight, chapters in upsc_subjects:
                subj = Subject.objects.create(exam=upsc, name=s_name, weightage=weight)
                for c_name, topics in chapters:
                    chap = Chapter.objects.create(subject=subj, name=c_name)
                    for t_name in topics:
                        top = Topic.objects.create(
                            chapter=chap,
                            name=t_name,
                            difficulty='Medium',
                            estimated_hours=8.0,
                            subtopics=['Constitutional articles & statutory provisions', 'Key Supreme Court judgements', 'Current affairs linkages', 'Mains answer writing model points']
                        )
                        LearningResource.objects.create(
                            topic=top,
                            title=f"{t_name} Standard GS Compendium",
                            resource_type=LearningResource.ResourceType.PDF,
                            url='https://cdn.govtpath.ai/resources/upsc-gs-notes.pdf'
                        )

        # 5. Question Bank
        if jee and jee.questions.count() < 3:
            sample_questions = [
                {
                    'exam': jee,
                    'question_text': 'A particle starts from the origin with velocity v = (3i + 4j) m/s and moves in the xy-plane with constant acceleration a = (2i + 2j) m/s². What is the particle\'s speed after 2 seconds?',
                    'question_type': Question.QuestionType.SINGLE_MCQ,
                    'options': [
                        {'id': 'A', 'text': '√113 m/s'},
                        {'id': 'B', 'text': '10 m/s'},
                        {'id': 'C', 'text': '√85 m/s'},
                        {'id': 'D', 'text': '12 m/s'},
                    ],
                    'correct_answer': 'A',
                    'explanation': 'vx = ux + ax*t = 3 + 2(2) = 7 m/s; vy = uy + ay*t = 4 + 2(2) = 8 m/s. Speed = √(7² + 8²) = √(49 + 64) = √113 m/s.',
                    'difficulty': Question.Difficulty.MEDIUM,
                    'marks': 4.0,
                    'negative_marks': 1.0,
                    'source_reference': 'JEE Main 2024 Shift 1',
                },
                {
                    'exam': jee,
                    'question_text': 'Which of the following compounds exhibits optical isomerism and has a chiral carbon center?',
                    'question_type': Question.QuestionType.SINGLE_MCQ,
                    'options': [
                        {'id': 'A', 'text': '2-Chlorobutane'},
                        {'id': 'B', 'text': '1-Chlorobutane'},
                        {'id': 'C', 'text': '2-Methylpropane'},
                        {'id': 'D', 'text': '1-Propanol'},
                    ],
                    'correct_answer': 'A',
                    'explanation': 'In 2-Chlorobutane, carbon-2 is attached to four distinct groups: -H, -Cl, -CH3, and -CH2CH3, making it an asymmetric chiral center.',
                    'difficulty': Question.Difficulty.EASY,
                    'marks': 4.0,
                    'negative_marks': 1.0,
                    'source_reference': 'JEE Main Organic Chemistry Archive',
                },
                {
                    'exam': jee,
                    'question_text': 'If matrix A has order 3x3 and det(A) = 4, then what is the value of det(2*adj(A))?',
                    'question_type': Question.QuestionType.SINGLE_MCQ,
                    'options': [
                        {'id': 'A', 'text': '128'},
                        {'id': 'B', 'text': '64'},
                        {'id': 'C', 'text': '256'},
                        {'id': 'D', 'text': '32'},
                    ],
                    'correct_answer': 'A',
                    'explanation': 'For nxn matrix: det(k * adj(A)) = k^n * det(adj(A)) = k^n * (det(A))^(n-1). Here n=3, k=2, det(A)=4. So 2³ * 4^(3-1) = 8 * 16 = 128.',
                    'difficulty': Question.Difficulty.HARD,
                    'marks': 4.0,
                    'negative_marks': 1.0,
                    'source_reference': 'JEE Main 2023 Mathematics',
                },
            ]
            for q_data in sample_questions:
                Question.objects.create(**q_data)

        # Questions for UPSC CSE
        if upsc and not upsc.questions.exists():
            upsc_questions = [
                {
                    'exam': upsc,
                    'question_text': 'Under Article 21 of the Constitution of India, which of the following has been recognized by the Supreme Court as a fundamental right?',
                    'question_type': Question.QuestionType.SINGLE_MCQ,
                    'options': [
                        {'id': 'A', 'text': 'Right to Privacy and Right to Clean Environment'},
                        {'id': 'B', 'text': 'Right to Strike'},
                        {'id': 'C', 'text': 'Right to Property'},
                        {'id': 'D', 'text': 'Right to bear arms'},
                    ],
                    'correct_answer': 'A',
                    'explanation': 'In Justice K.S. Puttaswamy (Retd.) v. Union of India (2017), the Supreme Court unanimously recognized the Right to Privacy as an intrinsic part of the Right to Life and Personal Liberty under Article 21.',
                    'difficulty': Question.Difficulty.MEDIUM,
                    'marks': 2.0,
                    'negative_marks': 0.66,
                    'source_reference': 'UPSC CSE Prelims 2021 GS Paper 1',
                },
                {
                    'exam': upsc,
                    'question_text': 'With reference to the Monetary Policy Committee (MPC) of the Reserve Bank of India, consider the following: 1. It is a 6-member committee. 2. The Governor of RBI acts as its ex-officio Chairperson. Which of the statements given above is/are correct?',
                    'question_type': Question.QuestionType.SINGLE_MCQ,
                    'options': [
                        {'id': 'A', 'text': 'Both 1 and 2'},
                        {'id': 'B', 'text': '1 only'},
                        {'id': 'C', 'text': '2 only'},
                        {'id': 'D', 'text': 'Neither 1 nor 2'},
                    ],
                    'correct_answer': 'A',
                    'explanation': 'Section 45ZB of the amended RBI Act, 1934 provides for an empowered six-member Monetary Policy Committee (MPC) entrusted with the task of fixing the benchmark policy rate to achieve the inflation target. The Governor of the RBI is the ex-officio Chairperson.',
                    'difficulty': Question.Difficulty.MEDIUM,
                    'marks': 2.0,
                    'negative_marks': 0.66,
                    'source_reference': 'UPSC CSE Prelims 2022 GS Paper 1',
                },
            ]
            for q in upsc_questions:
                Question.objects.create(**q)

        # 6. Mock Tests
        if upsc and not upsc.mock_tests.exists():
            test_upsc = MockTest.objects.create(
                title='UPSC CSE Prelims General Studies Paper-I All-India Mock 01',
                exam=upsc,
                category=MockTest.TestCategory.FULL_LENGTH,
                duration_minutes=120,
                total_marks=200.0,
                passing_marks=90.0,
                negative_marking=0.66,
                instructions='Standard UPSC Prelims format: 100 MCQs, +2 for correct, -0.66 for incorrect.'
            )
            for q in upsc.questions.all():
                test_upsc.questions.add(q)

        # 7. Recruitment Notices
        jobs_data = [
            {
                'job_id': 'job-upsc-cse-2027',
                'title': 'Civil Services Examination 2027 (IAS, IPS, IFS)',
                'department': 'Department of Personnel and Training (DoPT)',
                'organization': 'Union Public Service Commission (UPSC)',
                'qualification': 'Graduate in any stream from recognized university',
                'age_limit': '21 to 32 years (Relaxations as per rules)',
                'vacancies': '1,056 (Estimated)',
                'location': 'All India',
                'state': 'All India',
                'application_window': '14 Feb 2027 – 05 Mar 2027',
                'official_portal': 'https://upsc.gov.in',
                'apply_portal': 'https://upsconline.nic.in',
                'gazette_reference': 'UPSC Gazette Notification CEN-01/2027',
                'status': JobPosting.Status.VERIFIED,
                'is_important': True,
            },
            {
                'job_id': 'job-rrb-alp-2026',
                'title': 'Assistant Loco Pilot (ALP) Recruitment 2026',
                'department': 'Ministry of Railways',
                'organization': 'Railway Recruitment Boards (RRB)',
                'qualification': 'Matriculation / SSLC plus ITI or Diploma in Engineering',
                'age_limit': '18 to 30 years',
                'vacancies': '18,799',
                'location': 'All India (Zonal Rail Divisions)',
                'state': 'All India',
                'application_window': '01 Nov 2026 – 15 Dec 2026',
                'official_portal': 'https://www.rrbcdg.gov.in',
                'apply_portal': 'https://www.rrbapply.gov.in',
                'gazette_reference': 'Ministry of Railways CEN 01/2026',
                'status': JobPosting.Status.VERIFIED,
                'is_important': True,
            },
            {
                'job_id': 'job-appsc-group2-2026',
                'title': 'APPSC Group II Services (Executive & Non-Executive)',
                'department': 'General Administration Department',
                'organization': 'Andhra Pradesh Public Service Commission',
                'qualification': 'Bachelor Degree in any discipline from recognized university',
                'age_limit': '18 to 42 years',
                'vacancies': '897',
                'location': 'Andhra Pradesh',
                'state': 'Andhra Pradesh',
                'application_window': '20 Oct 2026 – 30 Nov 2026',
                'official_portal': 'https://psc.ap.gov.in',
                'apply_portal': 'https://psc.ap.gov.in',
                'gazette_reference': 'AP Gazette Notification No. 11/2026',
                'status': JobPosting.Status.VERIFIED,
                'is_important': True,
            },
            {
                'job_id': 'job-sbi-po-2026',
                'title': 'State Bank of India Probationary Officers (PO) Recruitment',
                'department': 'Human Resources Department',
                'organization': 'State Bank of India',
                'qualification': 'Graduation in any discipline',
                'age_limit': '21 to 30 years',
                'vacancies': '2,000',
                'location': 'All India',
                'state': 'All India',
                'application_window': '05 Nov 2026 – 27 Nov 2026',
                'official_portal': 'https://sbi.co.in/careers',
                'apply_portal': 'https://ibpsonline.ibps.in',
                'gazette_reference': 'SBI Central Recruitment CRPD/PO/2026-27/01',
                'status': JobPosting.Status.VERIFIED,
                'is_important': True,
            },
        ]
        for j in jobs_data:
            JobPosting.objects.get_or_create(job_id=j['job_id'], defaults=j)

        # 8. Custom Exam Requests
        if not CustomExamRequest.objects.exists():
            CustomExamRequest.objects.create(
                student=student,
                exam_name='MHT CET Law (5-Year LLB)',
                category='State Government',
                conducting_body='State Common Entrance Test Cell, Maharashtra',
                description='Maharashtra state common entrance test for integrated five-year law degree.',
                syllabus_info='Legal Aptitude, General Knowledge & Current Affairs, Logical Reasoning, English, Basic Math.',
                official_website='https://cetcell.mahacet.org',
                status=CustomExamRequest.Status.PENDING,
            )
            CustomExamRequest.objects.create(
                student=student,
                exam_name='AP Forest Section Officer (FSO)',
                category='State Government',
                conducting_body='Andhra Pradesh Public Service Commission (APPSC)',
                description='Recruitment for Forest Section Officers in Andhra Pradesh Forest Sub Service.',
                syllabus_info='General Studies & Mental Ability, Mathematics (SSC standard), General Science.',
                official_website='https://psc.ap.gov.in',
                status=CustomExamRequest.Status.UNDER_REVIEW,
            )

        # 9. Audit Log
        AuditLog.objects.create(
            action='SYSTEM_INIT',
            module='Core',
            record_id='init-1',
            description='PostgreSQL Database and GovtPath AI seed models successfully migrated.',
            admin_name='Jagadeesh Chittiboyina',
            admin_email=admin_email,
        )

        Announcement.objects.create(
            title='GovtPath AI Production Backend Active',
            message='Connected to PostgreSQL database with live JWT authentication and dynamic role-based permissions.',
            category='System',
            priority='High'
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded all GovtPath AI database models in PostgreSQL!'))
