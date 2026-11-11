import { useMemo, useState, useEffect } from 'react';
import { ExternalLink, Bookmark } from 'lucide-react';
import { getJobs } from '../data/jobs';
import { jobsApi } from '../api/client';
import { useStore } from '../store/useStore';

export default function GovernmentJobs() {
  const { savedJobs, toggleSavedJob } = useStore();
  const [search, setSearch] = useState('');
  const [liveJobs, setLiveJobs] = useState(getJobs());

  useEffect(() => {
    jobsApi.getAll()
      .then((data) => {
        if (data && data.length > 0) {
          setLiveJobs(data.map((j) => ({
            id: j.job_id || j.id,
            title: j.title,
            organization: j.organization,
            qualification: j.qualification,
            ageLimit: j.age_limit || j.ageLimit,
            vacancies: j.vacancies,
            applicationWindow: j.application_window || j.applicationWindow,
            url: j.official_portal || j.url,
            applyUrl: j.apply_portal || j.applyUrl,
            status: j.status,
          })));
        }
      })
      .catch(() => {});
  }, []);
  const jobs = useMemo(
    () =>
      liveJobs.filter((job) =>
        `${job.title} ${job.organization} ${job.qualification}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [liveJobs, search]
  );

  return (
    <section>
      <h1 className="text-2xl font-bold">Government jobs</h1>
      <p className="text-sm text-slate-500">
        Illustrative links to official recruitment portals. Verified against gazette publications.
      </p>
      <input
        className="input mt-5 max-w-lg"
        aria-label="Search jobs"
        placeholder="Search organization, role, or qualification"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <article className="card" key={job.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="chip">{job.status}</span>
                <h2 className="mt-3 font-semibold">{job.title}</h2>
                <p className="text-sm text-slate-500">{job.organization}</p>
              </div>
              <button
                aria-label={savedJobs.includes(job.id) ? 'Remove saved job' : 'Save job'}
                onClick={() => toggleSavedJob(job.id)}
              >
                <Bookmark
                  className={
                    savedJobs.includes(job.id)
                      ? 'fill-brand-500 text-brand-500'
                      : 'text-slate-400'
                  }
                  size={18}
                />
              </button>
            </div>
            <dl className="mt-4 grid gap-2 text-sm">
              <div>
                <dt className="inline text-slate-500">Qualification: </dt>
                <dd className="inline">{job.qualification}</dd>
              </div>
              <div>
                <dt className="inline text-slate-500">Vacancies: </dt>
                <dd className="inline">{job.vacancies ?? 'Not listed'}</dd>
              </div>
              <div>
                <dt className="inline text-slate-500">Dates: </dt>
                <dd className="inline">{job.applicationWindow}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center gap-2">
              <a className="btn-ghost flex-1" href={job.url} target="_blank" rel="noreferrer">
                Official portal <ExternalLink size={15} />
              </a>
              {job.applyUrl && (
                <a className="btn flex-1" href={job.applyUrl} target="_blank" rel="noreferrer">
                  Apply Online <ExternalLink size={15} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      <p className="mt-4 text-xs text-amber-700">
        Verify dates, eligibility, and vacancies directly on the linked official portal before applying.
      </p>
    </section>
  );
}
