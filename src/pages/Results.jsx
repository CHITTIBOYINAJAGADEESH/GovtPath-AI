import {Link,useParams} from 'react-router-dom';
import {useStore} from '../store/useStore';

function AttemptDetail({attempt}){
 const subjectRows=Object.groupBy?Object.groupBy(attempt.questions,question=>question.subject):attempt.questions.reduce((groups,question)=>{(groups[question.subject]??=[]).push(question);return groups},{});
 return <section><Link className="text-sm text-brand-600" to="/app/results">← All results</Link><h1 className="mt-3 text-2xl font-bold">{attempt.title}</h1><p className="text-sm text-slate-500">{attempt.examName} · {new Date(attempt.date).toLocaleString()}</p>
  <div className="mt-5 grid gap-3 sm:grid-cols-4">{[['Score',`${attempt.score}/${attempt.maxScore}`],['Correct',attempt.correct],['Incorrect',attempt.incorrect],['Unanswered',attempt.unanswered]].map(([label,value])=><div className="card" key={label}><div className="text-xl font-bold">{value}</div><div className="text-xs text-slate-500">{label}</div></div>)}</div>
  <div className="card mt-4"><h2 className="font-semibold">Subject review</h2>{Object.entries(subjectRows).map(([subject,items])=>{const right=items.filter(question=>attempt.answers[attempt.questions.indexOf(question)]===question.a).length;return <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-sm" key={subject}><span>{subject}</span><span>{right}/{items.length} correct</span></div>})}</div>
  <div className="card mt-4"><h2 className="font-semibold">Answer review</h2>{attempt.questions.map((question,index)=>{const selected=attempt.answers[index];return <article className="mt-3 border-t border-slate-100 pt-3" key={question.id}><p className="text-sm font-medium">{index+1}. {question.q}</p><p className="mt-1 text-sm text-slate-600">Your answer: {selected===undefined?'Not answered':question.o[selected]}</p><p className="text-sm text-emerald-700">Correct answer: {question.o[question.a]}</p><p className="text-xs text-slate-500">{question.e}</p></article>})}</div>
 </section>;
}

export default function Results(){
 const {attemptId}=useParams();
 const attempts=useStore(s=>s.attempts);
 if(attemptId){const attempt=attempts.find(item=>item.id===attemptId);return attempt?<AttemptDetail attempt={attempt}/>:<div className="card text-center"><p>That result could not be found on this device.</p><Link className="btn mt-3" to="/app/results">View all results</Link></div>}
 return <section><h1 className="text-2xl font-bold">Test results</h1><p className="text-sm text-slate-500">Scores and answer reviews from your completed demo tests.</p>
  {attempts.length?<div className="mt-5 space-y-3">{attempts.map(attempt=><Link className="card flex flex-wrap items-center justify-between gap-3" key={attempt.id} to={`/app/results/${attempt.id}`}><div><h2 className="font-semibold">{attempt.title}</h2><p className="text-xs text-slate-500">{attempt.examName} · {new Date(attempt.date).toLocaleString()}</p></div><div className="text-right"><div className="font-semibold">{attempt.score}/{attempt.maxScore}</div><div className="text-xs text-slate-500">{Math.round(attempt.accuracy)}% accuracy</div></div></Link>)}</div>:<div className="card mt-5 text-center"><p>No results recorded yet.</p><Link className="btn mt-3" to="/app/mock-tests">Take a mock test</Link></div>}
 </section>;
}
