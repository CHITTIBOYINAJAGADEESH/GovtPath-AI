import {motion} from 'framer-motion';
import {Link} from 'react-router-dom';
import {format} from 'date-fns';
import {useStore} from '../store/useStore';
import {usePrimary} from '../hooks';
import {percent} from '../services/roadmapService';

const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const levels=['Beginner','Intermediate','Advanced'];

export default function Roadmap(){
 const {prefs,setPrefs,progress,toggleTopic}=useStore();
 const {exam,roadmap}=usePrimary();
 if(!exam)return <div className="card text-center"><p>Pick a primary exam to generate your roadmap.</p><Link to="/app/explore-exams" className="btn mt-3">Explore exams</Link></div>;
 const completed=percent(roadmap.topics,progress);
 const selectedDays=prefs.studyDays||[];
 const toggleDay=day=>setPrefs({studyDays:selectedDays.includes(day)?selectedDays.filter(item=>item!==day):[...selectedDays,day]});
 return <section><h1 className="text-2xl font-bold">{exam.name} roadmap</h1><p className="text-sm text-slate-500">A local rule-based plan that uses your target date, availability, progress, and recorded subject performance. No real AI model is connected.</p>
  <div className="card mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
   <label className="text-sm">Study hours/day: <b>{prefs.hours}</b><input type="range" min="1" max="10" value={prefs.hours} onChange={event=>setPrefs({hours:+event.target.value})} className="mt-2 w-full"/></label>
   <label className="text-sm">Months to exam<select className="input mt-1" value={prefs.months} onChange={event=>setPrefs({months:+event.target.value,targetDate:''})}>{[2,3,6,9,12,18].map(month=><option key={month} value={month}>{month}</option>)}</select></label>
   <label className="text-sm">Preparation level<select className="input mt-1" value={prefs.level} onChange={event=>setPrefs({level:event.target.value})}>{levels.map(level=><option key={level}>{level}</option>)}</select></label>
   <label className="text-sm">Target examination date<input className="input mt-1" type="date" min={format(new Date(),'yyyy-MM-dd')} value={prefs.targetDate||''} onChange={event=>setPrefs({targetDate:event.target.value})}/><span className="text-xs text-slate-500">Optional; overrides the month estimate.</span></label>
  </div>
  <div className="card mt-4"><h2 className="font-semibold">Preferred study days</h2><div className="mt-3 flex flex-wrap gap-3">{days.map(day=><label className="flex items-center gap-2 text-sm" key={day}><input type="checkbox" checked={selectedDays.includes(day)} onChange={()=>toggleDay(day)}/>{day}</label>)}</div><p className="mt-2 text-xs text-slate-500">Previous practice accuracy is used to prioritize weaker subjects when available.</p></div>
  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{roadmap.phases.map(phase=><div className="card" key={phase.name}><b className="text-sm">{phase.name}</b><div className="text-xs text-slate-500">Weeks {phase.weeks}</div></div>)}</div>
  <div className="card mt-4"><div className="flex justify-between text-sm font-semibold"><span>Overall progress</span><span>{completed}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><motion.div className="h-2 rounded-full bg-brand-500" animate={{width:`${completed}%`}}/></div><p className="mt-2 text-xs text-slate-500">Plan length: {roadmap.totalWeeks} weeks</p></div>
  {roadmap.subjects.map(subject=><section className="card mt-4" key={subject.name}><h2 className="font-semibold">{subject.name} <span className="text-xs font-normal text-slate-500">{percent(subject.topics,progress)}%</span></h2><ul className="mt-2 divide-y divide-slate-100">{subject.topics.map(topic=>{const full=roadmap.topics.find(item=>item.id===topic.id);return <li key={topic.id}><label className="flex cursor-pointer items-center gap-3 py-2 text-sm"><input type="checkbox" checked={!!progress[topic.id]} onChange={()=>toggleTopic(topic.id)}/><span className={progress[topic.id]?'text-slate-400 line-through':''}>{topic.name}</span><span className="ml-auto text-xs text-slate-500">Week {full.week} · {full.day} · ~{full.hours}h</span></label></li>})}</ul></section>)}
 </section>;
}
