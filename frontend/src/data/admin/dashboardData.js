// Centralized Dashboard metrics, charts data, and activity feeds
export const dashboardKPIs = {
  totalStudents: 14250,
  activeStudents: 9840,
  totalExaminations: 124,
  totalSubjects: 48,
  totalSyllabusTopics: 1860,
  totalQuestions: 24500,
  publishedMockTests: 340,
  completedMockTests: 68900,
  pendingApprovals: 5,
  aiRoadmapsGenerated: 18450,
};

export const registrationTrends = [
  { date: 'Nov 05', registrations: 142, activeUsers: 820 },
  { date: 'Nov 06', registrations: 185, activeUsers: 940 },
  { date: 'Nov 07', registrations: 210, activeUsers: 1100 },
  { date: 'Nov 08', registrations: 175, activeUsers: 1040 },
  { date: 'Nov 09', registrations: 240, activeUsers: 1250 },
  { date: 'Nov 10', registrations: 310, activeUsers: 1420 },
  { date: 'Nov 11', registrations: 285, activeUsers: 1380 },
];

export const platformActivityHourly = [
  { hour: '06:00', practiceQuestions: 420, mockAttempts: 85, roadmapsCreated: 35 },
  { hour: '09:00', practiceQuestions: 1180, mockAttempts: 240, roadmapsCreated: 90 },
  { hour: '12:00', practiceQuestions: 1890, mockAttempts: 410, roadmapsCreated: 140 },
  { hour: '15:00', practiceQuestions: 1650, mockAttempts: 370, roadmapsCreated: 115 },
  { hour: '18:00', practiceQuestions: 2450, mockAttempts: 590, roadmapsCreated: 210 },
  { hour: '21:00', practiceQuestions: 3100, mockAttempts: 780, roadmapsCreated: 260 },
  { hour: '00:00', practiceQuestions: 980, mockAttempts: 190, roadmapsCreated: 60 },
];

export const categoryDistribution = [
  { name: 'Engineering', count: 16, percentage: 22, color: '#6955E8' },
  { name: 'Management', count: 16, percentage: 20, color: '#477BEE' },
  { name: 'State PSCs', count: 14, percentage: 17, color: '#17B897' },
  { name: 'Banking', count: 14, percentage: 16, color: '#F4A640' },
  { name: 'Police & Defence', count: 13, percentage: 13, color: '#E45B69' },
  { name: 'UPSC & Civil', count: 8, percentage: 12, color: '#8b5cf6' },
];

export const popularExams = [
  { id: 'jee-main', name: 'JEE Main', category: 'Engineering Entrance', enrollees: 4210, growth: '+18%', activeRoadmaps: 3890 },
  { id: 'neet-ug', name: 'NEET UG', category: 'Medical Entrance', enrollees: 3840, growth: '+15%', activeRoadmaps: 3420 },
  { id: 'upsc-civil-services-exam', name: 'UPSC Civil Services Exam', category: 'Civil Services', enrollees: 3120, growth: '+22%', activeRoadmaps: 2890 },
  { id: 'ssc-cgl', name: 'SSC CGL', category: 'Staff Selection Commission', enrollees: 2890, growth: '+12%', activeRoadmaps: 2540 },
  { id: 'ibps-po', name: 'IBPS PO', category: 'Banking & Insurance', enrollees: 2410, growth: '+9%', activeRoadmaps: 2110 },
  { id: 'gate', name: 'GATE (Engineering)', category: 'Higher Education & PSUs', enrollees: 1980, growth: '+14%', activeRoadmaps: 1750 },
];

export const mockTestActivityTrends = [
  { day: 'Mon', attempts: 1850, avgScore: 72 },
  { day: 'Tue', attempts: 2100, avgScore: 74 },
  { day: 'Wed', attempts: 2400, avgScore: 71 },
  { day: 'Thu', attempts: 2250, avgScore: 75 },
  { day: 'Fri', attempts: 2600, avgScore: 76 },
  { day: 'Sat', attempts: 3400, avgScore: 78 },
  { day: 'Sun', attempts: 4100, avgScore: 79 },
];

export const studentEngagementStats = [
  { subject: 'Quantitative Aptitude', accuracy: 74, totalAttempts: 18450 },
  { subject: 'Reasoning Ability', accuracy: 81, totalAttempts: 16200 },
  { subject: 'General Awareness', accuracy: 62, totalAttempts: 14100 },
  { subject: 'English Language', accuracy: 78, totalAttempts: 12800 },
  { subject: 'Physics & Technical', accuracy: 67, totalAttempts: 9400 },
];

export const contentRequiringVerification = [
  { id: 'ver-1', title: 'APPSC Group 2 Syllabus Revision 2026', type: 'Syllabus', priority: 'High', submittedBy: 'Priya Sundaram', time: '2 hours ago' },
  { id: 'ver-2', title: 'RRB NTPC CBT-1 Demo Question Batch #4', type: 'Question Bank', priority: 'Medium', submittedBy: 'Dr. Ramesh Kumar', time: '5 hours ago' },
  { id: 'ver-3', title: 'UPSC Geo-Scientist Official Exam Notification PDF', type: 'Recruitment', priority: 'Urgent', submittedBy: 'Sneha Patel', time: '8 hours ago' },
  { id: 'ver-4', title: 'MHT CET Law (5-Year) Custom Examination Submission', type: 'Custom Exam', priority: 'High', submittedBy: 'Ananya Deshmukh', time: '1 day ago' },
];
