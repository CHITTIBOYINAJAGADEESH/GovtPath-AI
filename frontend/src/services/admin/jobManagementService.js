import { demoJobs as initialJobs } from '../../data/jobs';
import { getStoredData, setStoredData, logAdminAction, STORAGE_KEYS } from './adminStorage';
import { jobsApi } from '../../api/client';

// Enrich initial jobs into full government recruitment schema
const enrichInitialJobs = (list) => {
  return [
    {
      id: 'job-upsc-cse-2027',
      title: 'Civil Services Examination 2027 (IAS, IPS, IFS)',
      department: 'Department of Personnel and Training (DoPT)',
      organization: 'Union Public Service Commission (UPSC)',
      qualification: 'Graduate in any stream from recognized university',
      ageLimit: '21 to 32 years (Relaxations as per rules)',
      vacancies: '1056 (Estimated)',
      location: 'All India',
      state: 'All India',
      applicationStartDate: '2027-02-14',
      applicationClosingDate: '2027-03-05',
      applicationWindow: '14 Feb 2027 – 05 Mar 2027',
      url: 'https://upsc.gov.in',
      applyUrl: 'https://upsconline.nic.in',
      pdfReference: 'https://cdn.govtpath.ai/gazette/upsc-cse-2027-notice.pdf',
      status: 'Verified',
      isImportant: true,
      publishedAt: '2026-11-01T08:00:00Z',
    },
    {
      id: 'job-rrb-alp-2026',
      title: 'Assistant Loco Pilot (ALP) Recruitment 2026',
      department: 'Ministry of Railways',
      organization: 'Railway Recruitment Boards (RRB)',
      qualification: 'Matriculation / SSLC plus ITI in specified trades OR Diploma in Engg',
      ageLimit: '18 to 30 years',
      vacancies: '18,799',
      location: 'All India (Zonal Rail Divisions)',
      state: 'All India',
      applicationStartDate: '2026-11-01',
      applicationClosingDate: '2026-12-15',
      applicationWindow: '01 Nov 2026 – 15 Dec 2026',
      url: 'https://www.rrbcdg.gov.in',
      applyUrl: 'https://www.rrbapply.gov.in',
      pdfReference: 'https://cdn.govtpath.ai/gazette/rrb-cen-alp-2026.pdf',
      status: 'Verified',
      isImportant: true,
      publishedAt: '2026-11-02T10:30:00Z',
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
      applyUrl: 'https://psc.ap.gov.in/otpr',
      pdfReference: 'https://cdn.govtpath.ai/gazette/appsc-gr2-notification.pdf',
      status: 'Verified',
      isImportant: true,
      publishedAt: '2026-10-20T12:00:00Z',
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
      applyUrl: 'https://ibpsonline.ibps.in/sbiponov26',
      pdfReference: 'https://cdn.govtpath.ai/gazette/sbi-po-crpd-2026.pdf',
      status: 'Verified',
      isImportant: false,
      publishedAt: '2026-11-05T09:00:00Z',
    },
    {
      id: 'job-ssc-cgl-2026',
      title: 'Combined Graduate Level Examination 2026',
      department: 'DoPT / Various Ministries',
      organization: 'Staff Selection Commission (SSC)',
      qualification: 'Bachelor Degree from recognized University',
      ageLimit: '18 to 32 years (post-wise)',
      vacancies: '17,727',
      location: 'All India',
      state: 'All India',
      applicationStartDate: '2026-09-24',
      applicationClosingDate: '2026-10-24',
      applicationWindow: 'Application Closed / Tier 1 Awaited',
      url: 'https://ssc.gov.in',
      applyUrl: 'https://ssc.gov.in',
      pdfReference: 'https://cdn.govtpath.ai/gazette/ssc-cgl-2026-notice.pdf',
      status: 'Updated',
      isImportant: false,
      publishedAt: '2026-09-24T14:00:00Z',
    },
  ];
};

export const jobManagementService = {
  getAllJobs() {
    const stored = getStoredData(STORAGE_KEYS.JOBS, null);
    if (!stored) {
      const enriched = enrichInitialJobs(initialJobs);
      setStoredData(STORAGE_KEYS.JOBS, enriched);
      return enriched;
    }
    return stored;
  },

  getJobById(id) {
    const list = this.getAllJobs();
    return list.find(j => j.id === id);
  },

  createJob(jobData) {
    const list = this.getAllJobs();
    const id = jobData.id || `job-${Date.now()}`;
    const newJob = {
      ...jobData,
      id,
      publishedAt: new Date().toISOString(),
      status: jobData.status || 'Verified',
    };
    const updated = [newJob, ...list];
    setStoredData(STORAGE_KEYS.JOBS, updated);

    // Sync to PostgreSQL backend
    jobsApi.create({
      job_id: id,
      title: newJob.title,
      department: newJob.department || 'Government Department',
      organization: newJob.organization || 'Public Sector',
      qualification: newJob.qualification || 'Graduate',
      age_limit: newJob.ageLimit || '18-30 years',
      vacancies: String(newJob.vacancies || 'N/A'),
      location: newJob.location || 'All India',
      state: newJob.state || 'All India',
      official_portal: newJob.url || 'https://india.gov.in',
      apply_portal: newJob.applyUrl || 'https://india.gov.in',
      status: newJob.status || 'Verified',
      is_important: !!newJob.isImportant,
    }).catch(() => {});

    logAdminAction({
      action: 'CREATE',
      module: 'Jobs',
      recordId: id,
      description: `Published government recruitment notice: ${newJob.title} (${newJob.organization})`,
    });

    return newJob;
  },

  updateJob(id, patch) {
    const list = this.getAllJobs();
    const idx = list.findIndex(j => j.id === id);
    if (idx === -1) throw new Error('Job not found');

    const updated = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    list[idx] = updated;
    setStoredData(STORAGE_KEYS.JOBS, list);

    logAdminAction({
      action: 'UPDATE',
      module: 'Jobs',
      recordId: id,
      description: `Updated job notification: ${updated.title}`,
    });

    return updated;
  },

  deleteJob(id) {
    const list = this.getAllJobs();
    const target = list.find(j => j.id === id);
    const filtered = list.filter(j => j.id !== id);
    setStoredData(STORAGE_KEYS.JOBS, filtered);

    logAdminAction({
      action: 'DELETE',
      module: 'Jobs',
      recordId: id,
      description: `Deleted job notice: ${target ? target.title : id}`,
    });

    return true;
  },
};
