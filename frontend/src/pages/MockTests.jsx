import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock3, FileQuestion } from 'lucide-react';
import { usePrimary } from '../hooks';
import { getMockTests } from '../data/mockTests';
import { mockTestsApi } from '../api/client';
import { useStore } from '../store/useStore';

export default function MockTests() {
  const { exam } = usePrimary();
  const attempts = useStore((s) => s.attempts);
  const [liveTests, setLiveTests] = useState([]);

  useEffect(() => {
    if (exam?.id) {
      const fallback = getMockTests(exam.id);
      mockTestsApi.getAll({ exam: exam.id })
        .then((data) => {
          if (data && data.length > 0) {
            setLiveTests(data.map((t) => ({
              id: t.id,
              type: t.category,
              title: t.title,
              durationMinutes: t.duration_minutes,
              questions: t.questions || [1, 2, 3],
            })));
          } else {
            setLiveTests(fallback);
          }
        })
        .catch(() => {
          setLiveTests(fallback);
        });
    }
  }, [exam?.id]);

  if (!exam)
    return (
      <div className="card text-center">
        <p>Select a primary exam to see mock tests.</p>
        <Link className="btn mt-3" to="/app/explore-exams">
          Explore exams
        </Link>
      </div>
    );

  const tests = liveTests.length > 0 ? liveTests : getMockTests(exam.id);
 return <section><h1 className="text-2xl font-bold">Mock tests</h1><p className="text-sm text-slate-500">{exam.name} · Short local demo tests based on the available question bank.</p>
  <div className="mt-5 grid gap-4 md:grid-cols-3">{tests.map(test=><article className="card flex flex-col" key={test.id}>
   <span className="chip w-fit">{test.type}</span><h2 className="mt-3 text-lg font-semibold">{test.title}</h2><p className="mt-1 flex-1 text-sm text-slate-500">Questions from your local demo bank; results are saved on this device.</p>
   <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><FileQuestion size={14}/>{test.questions.length} questions</span><span className="inline-flex items-center gap-1"><Clock3 size={14}/>{test.durationMinutes} min</span></div>
   <Link className="btn mt-4" to={`/app/mock-tests/${test.id}/attempt`}>Start test</Link>
  </article>)}</div>
  <div className="card mt-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Recent attempts</h2><Link className="text-sm text-brand-600" to="/app/results">All results</Link></div>{attempts.filter(attempt=>attempt.exam===exam.id).slice(0,3).length?attempts.filter(attempt=>attempt.exam===exam.id).slice(0,3).map(attempt=><Link className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-sm" key={attempt.id} to={`/app/results/${attempt.id}`}><span>{attempt.title}</span><span>{attempt.score}/{attempt.maxScore} · {Math.round(attempt.accuracy)}%</span></Link>):<p className="mt-2 text-sm text-slate-500">No completed tests yet.</p>}</div>
  <p className="mt-4 text-xs text-slate-500">These are simulated practice tests, not official or full-length exam simulations.</p>
 </section>;
}
