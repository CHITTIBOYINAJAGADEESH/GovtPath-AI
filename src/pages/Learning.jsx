import {useState} from 'react';
import {Link} from 'react-router-dom';
import {Bookmark,Check,ChevronDown,ChevronRight,Save} from 'lucide-react';
import toast from 'react-hot-toast';
import {useStore} from '../store/useStore';
import {usePrimary} from '../hooks';
import {percent} from '../services/roadmapService';

export default function Learning(){
 const {exam,roadmap}=usePrimary();
 const {progress,toggleTopic,bookmarks,toggleBookmark,notes,saveNote}=useStore();
 const [expanded,setExpanded]=useState({});
 if(!exam)return <div className="card text-center"><p>Select a primary exam to view its syllabus.</p><Link to="/app/explore-exams" className="btn mt-3">Explore exams</Link></div>;
 return <section><h1 className="text-2xl font-bold">Syllabus & learning</h1><p className="text-sm text-slate-500">{exam.name} · Track topics, save revision notes, and continue learning.</p>
  <div className="mt-5 grid gap-3 sm:grid-cols-3">{[['Subjects',roadmap.subjects.length],['Topics',roadmap.topics.length],['Completed',`${percent(roadmap.topics,progress)}%`]].map(([label,value])=><div className="card" key={label}><div className="text-2xl font-bold">{value}</div><div className="text-xs text-slate-500">{label}</div></div>)}</div>
  <div className="mt-4 space-y-3">{roadmap.subjects.map(subject=><article className="card" key={subject.name}>
   <button className="flex w-full items-center gap-3 text-left" onClick={()=>setExpanded(s=>({...s,[subject.name]:!s[subject.name]}))}>{expanded[subject.name]?<ChevronDown size={18}/>:<ChevronRight size={18}/>}<span className="flex-1 font-semibold">{subject.name}</span><span className="text-sm text-slate-500">{percent(subject.topics,progress)}% complete</span></button>
   {expanded[subject.name]&&<div className="mt-3 divide-y divide-slate-100">{subject.topics.map(topic=><div key={topic.id} className="py-3">
    <div className="flex flex-wrap items-center gap-3"><label className="flex min-w-0 flex-1 items-center gap-2 text-sm"><input type="checkbox" checked={!!progress[topic.id]} onChange={()=>toggleTopic(topic.id)}/><span className={progress[topic.id]?'text-slate-400 line-through':''}>{topic.name}</span><span className="text-xs text-slate-400">Week {topic.week}</span></label>
     <button className="text-slate-400 hover:text-brand-600" aria-label={`Bookmark ${topic.name}`} onClick={()=>toggleBookmark(topic.id)}><Bookmark size={16} className={bookmarks.includes(topic.id)?'fill-brand-500 text-brand-500':''}/></button><Link className="text-sm text-brand-600" to="/app/practice">Practice</Link></div>
    <div className="mt-2 flex gap-2"><input className="input" aria-label={`Notes for ${topic.name}`} placeholder="Add a revision note…" defaultValue={notes[topic.id]||''} key={`${topic.id}-${notes[topic.id]||''}`} onBlur={e=>saveNote(topic.id,e.target.value)}/><button className="btn-ghost shrink-0" aria-label={`Save note for ${topic.name}`} onClick={e=>{const input=e.currentTarget.previousElementSibling;saveNote(topic.id,input.value);toast.success('Note saved')}}><Save size={16}/></button></div>
    {progress[topic.id]&&<p className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-700"><Check size={14}/>Completed</p>}
   </div>)}</div>}
  </article>)}</div>
  <p className="mt-4 text-xs text-slate-500">Syllabus entries are representative demo content. Follow the exam authority’s latest notification.</p>
 </section>;
}
