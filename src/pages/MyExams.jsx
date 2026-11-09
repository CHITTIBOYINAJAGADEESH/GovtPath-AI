import {Link} from 'react-router-dom';
import {Check,Trash2} from 'lucide-react';
import toast from 'react-hot-toast';
import {useStore} from '../store/useStore';
import {getExam} from '../services/examService';

export default function MyExams(){
 const {selected,primary,custom,addExam,setPrimary}=useStore();
 const exams=selected.map(id=>getExam(id,custom)).filter(Boolean);
 return <section>
  <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold">My examinations</h1><p className="text-sm text-slate-500">Choose the exams that shape your study plan and practice.</p></div><Link className="btn" to="/app/explore-exams">Explore exams</Link></div>
  {exams.length?<div className="mt-5 grid gap-4 md:grid-cols-2">{exams.map(exam=><article className="card" key={exam.id}>
   <div className="flex items-start justify-between gap-3"><div><span className="chip">{exam.categoryLabel}</span><h2 className="mt-3 text-lg font-semibold">{exam.name}</h2><p className="mt-1 text-sm text-slate-500">{exam.org} · {exam.qualification}</p></div>{primary===exam.id&&<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Primary</span>}</div>
   <div className="mt-4 flex flex-wrap gap-2"><Link className="btn" to="/app/mock-tests" onClick={()=>setPrimary(exam.id)}>Take Test</Link></div>

  </article>)}</div>:<div className="card mt-5 text-center"><h2 className="font-semibold">No examinations selected yet</h2><p className="mt-1 text-sm text-slate-500">Add an exam to get a personalized roadmap and practice questions.</p><Link className="btn mt-4" to="/app/explore-exams">Browse examination catalogue</Link></div>}

  <div className="card mt-5"><h2 className="font-semibold">Quick add a popular exam</h2><div className="mt-3 flex flex-wrap gap-2">{[['jee-main','JEE Main'],['neet-ug','NEET UG'],['ssc-cgl','SSC CGL'],['ibps-po','IBPS PO']].map(([id,name])=><button key={id} disabled={selected.includes(id)} className="btn-ghost disabled:opacity-50" onClick={()=>{addExam(id);toast.success(`${name} added`)}}>{selected.includes(id)?<Check size={15}/>:null}{name}</button>)}</div></div>
 </section>;
}
