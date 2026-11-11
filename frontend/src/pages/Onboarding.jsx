import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import {categories} from '../data/exams';
import {allExams} from '../services/examService';
import {useStore} from '../store/useStore';

export default function Onboarding(){
 const navigate=useNavigate();
 const {custom,selected,addExam,setPrimary,prefs,setPrefs}=useStore();
 const [search,setSearch]=useState('');
 const [picked,setPicked]=useState('');
 const options=allExams(custom).filter(exam=>exam.name.toLowerCase().includes(search.toLowerCase())).slice(0,30);
 const finish=()=>{if(picked){addExam(picked);setPrimary(picked)}if(!selected.length&&!picked){toast.error('Choose an examination to continue');return}navigate('/app/dashboard')};
 return <main className="mx-auto max-w-3xl px-4 py-10"><div className="card"><p className="text-sm font-semibold text-brand-600">PERSONALIZE YOUR PLAN</p><h1 className="mt-2 text-2xl font-bold">Let’s set up your preparation</h1><p className="mt-1 text-sm text-slate-500">Your choices are saved in this browser and can be changed later.</p>
  <label className="mt-5 block text-sm font-medium">Find your target examination<input className="input mt-1" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search exams"/></label>
  <label className="mt-3 block text-sm font-medium">Examination<select className="input mt-1" value={picked} onChange={e=>setPicked(e.target.value)}><option value="">Select an exam</option>{options.map(exam=><option key={exam.id} value={exam.id}>{exam.name} · {categories.find(c=>c.id===exam.category)?.label}</option>)}</select></label>
  <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Study hours per day<input className="mt-2 w-full" type="range" min="1" max="10" value={prefs.hours} onChange={e=>setPrefs({hours:+e.target.value})}/><span>{prefs.hours} hours</span></label><label className="text-sm font-medium">Preparation level<select className="input mt-1" value={prefs.level} onChange={e=>setPrefs({level:e.target.value})}>{['Beginner','Intermediate','Advanced'].map(level=><option key={level}>{level}</option>)}</select></label></div>
  <button className="btn mt-5" onClick={finish}>Continue to dashboard</button>
 </div></main>;
}
