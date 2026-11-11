// Seed Government Recruitment Notices
export const demoJobs = [
  {
    id: 'job-upsc-cse-2027',
    title: 'Civil Services Examination 2027 (IAS, IPS, IFS)',
    department: 'Department of Personnel and Training (DoPT)',
    organization: 'Union Public Service Commission (UPSC)',
    qualification: 'Graduate in any stream from recognized university',
    ageLimit: '21 to 32 years',
    vacancies: '1056 (Estimated)',
    location: 'All India',
    state: 'All India',
    applicationStartDate: '2027-02-14',
    applicationClosingDate: '2027-03-05',
    applicationWindow: '14 Feb 2027 – 05 Mar 2027',
    url: 'https://upsc.gov.in',
    applyUrl: 'https://upsconline.nic.in',
    status: 'Verified',
    isImportant: true,
  },
  {
    id: 'job-rrb-alp-2026',
    title: 'Assistant Loco Pilot (ALP) Recruitment 2026',
    department: 'Ministry of Railways',
    organization: 'Railway Recruitment Boards (RRB)',
    qualification: 'Matriculation / SSLC plus ITI or Diploma',
    ageLimit: '18 to 30 years',
    vacancies: '18,799',
    location: 'All India',
    state: 'All India',
    applicationStartDate: '2026-11-01',
    applicationClosingDate: '2026-12-15',
    applicationWindow: '01 Nov 2026 – 15 Dec 2026',
    url: 'https://www.rrbcdg.gov.in',
    applyUrl: 'https://www.rrbapply.gov.in',
    status: 'Verified',
    isImportant: true,
  },
  {
    id: 'job-appsc-group2-2026',
    title: 'APPSC Group II Services (Executive & Non-Executive)',
    department: 'General Administration Department',
    organization: 'Andhra Pradesh Public Service Commission',
    qualification: 'Bachelor Degree in any discipline',
    ageLimit: '18 to 42 years',
    vacancies: '897',
    location: 'Andhra Pradesh',
    state: 'Andhra Pradesh',
    applicationStartDate: '2026-10-20',
    applicationClosingDate: '2026-11-30',
    applicationWindow: '20 Oct 2026 – 30 Nov 2026',
    url: 'https://psc.ap.gov.in',
    applyUrl: 'https://psc.ap.gov.in',
    status: 'Verified',
    isImportant: true,
  },
  {
    id: 'job-sbi-po-2026',
    title: 'State Bank of India Probationary Officers (PO) 2026',
    department: 'Human Resources Department',
    organization: 'State Bank of India',
    qualification: 'Graduation in any discipline',
    ageLimit: '21 to 30 years',
    vacancies: '2,000',
    location: 'All India',
    state: 'All India',
    applicationStartDate: '2026-11-05',
    applicationClosingDate: '2026-11-27',
    applicationWindow: '05 Nov 2026 – 27 Nov 2026',
    url: 'https://sbi.co.in/careers',
    applyUrl: 'https://ibpsonline.ibps.in',
    status: 'Verified',
    isImportant: false,
  },
];

export const getJobs = () => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('govtpath_admin_jobs_v1') : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // fallback
  }
  return demoJobs;
};
