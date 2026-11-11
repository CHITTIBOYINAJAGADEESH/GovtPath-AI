import {useMemo,useState} from 'react';
import {addDays,endOfMonth,format,startOfMonth,startOfWeek} from 'date-fns';
import {CalendarPlus,Check,Trash2} from 'lucide-react';
import toast from 'react-hot-toast';
import {useStore} from '../store/useStore';
import {usePrimary} from '../hooks';

export default function Planner(){
 const {plannerTasks,addTask,updateTask,deleteTask,prefs}=useStore();
 const {exam,roadmap}=usePrimary();
 const [view,setView]=useState('week');
 const [task,setTask]=useState({title:'',date:format(new Date(),'yyyy-MM-dd'),type:'Study'});
 const today=format(new Date(),'yyyy-MM-dd');
 const visible=useMemo(()=>{
  const start=view==='month'?format(startOfMonth(new Date()),'yyyy-MM-dd'):view==='week'?format(startOfWeek(new Date(),{weekStartsOn:1}),'yyyy-MM-dd'):today;
  const end=view==='month'?format(addDays(endOfMonth(new Date()),1),'yyyy-MM-dd'):view==='week'?format(addDays(startOfWeek(new Date(),{weekStartsOn:1}),7),'yyyy-MM-dd'):today;
  return plannerTasks.filter(item=>item.date>=start&&item.date<end).sort((a,b)=>a.date.localeCompare(b.date));
 },[plannerTasks,view,today]);
 const submit=event=>{event.preventDefault();if(!task.title.trim())return toast.error('Enter a task name');addTask(task);setTask(previous=>({...previous,title:''}));toast.success('Task added to your planner')};
 const generate=()=>{
  if(!roadmap?.topics.length)return toast.error('Choose an exam to generate study tasks');
  const existing=new Set(plannerTasks.map(item=>item.title));
  const open=roadmap.topics.filter(topic=>!useStore.getState().progress[topic.id]&&!existing.has(`${topic.subject}: ${topic.name}`)).slice(0,5);
  if(!open.length)return toast.success('All available topics are already scheduled');
  const studyDays=prefs.studyDays?.length?prefs.studyDays:['Mon','Tue','Wed','Thu','Fri','Sat'];
  const scheduleDate=index=>{let date=new Date(),scheduled=0;while(true){if(studyDays.includes(format(date,'EEE'))){if(scheduled===index)return date;scheduled++}date=addDays(date,1)}};
  open.forEach((topic,index)=>addTask({title:`${topic.subject}: ${topic.name}`,date:format(scheduleDate(index),'yyyy-MM-dd'),type:'Study'}));
  toast.success(`${open.length} study tasks added`);
 };
 return <section><div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold">Study planner</h1><p className="text-sm text-slate-500">{exam?`Plan for ${exam.name}`:'Plan study sessions and reminders.'} · Tasks sync to your dashboard.</p></div><button className="btn-ghost" onClick={generate}><CalendarPlus size={16}/>Generate from roadmap</button></div>
  <form className="card mt-5 grid gap-3 sm:grid-cols-[1fr_180px_170px_auto]" onSubmit={submit}><input className="input" placeholder="Task or revision reminder" value={task.title} onChange={event=>setTask({...task,title:event.target.value})}/><input className="input" type="date" value={task.date} onChange={event=>setTask({...task,date:event.target.value})}/><select className="input" value={task.type} onChange={event=>setTask({...task,type:event.target.value})}>{['Study','Revision','Mock test','Reminder'].map(type=><option key={type}>{type}</option>)}</select><button className="btn">Add task</button></form>
  <div className="mt-5 flex gap-2">{['day','week','month'].map(option=><button className={view===option?'btn':'btn-ghost'} key={option} onClick={()=>setView(option)}>{option[0].toUpperCase()+option.slice(1)}</button>)}</div>
  <div className="mt-4 space-y-3">{visible.length?visible.map(item=><article className="card flex flex-wrap items-center gap-3" key={item.id}><input aria-label={`Complete ${item.title}`} type="checkbox" checked={item.completed} onChange={()=>updateTask(item.id,{completed:!item.completed,completedAt:item.completed?null:Date.now()})}/><div className="min-w-0 flex-1"><p className={`font-medium ${item.completed?'text-slate-400 line-through':''}`}>{item.title}</p><p className="text-xs text-slate-500">{item.type} · {item.date}</p></div><label className="text-xs text-slate-500">Reschedule<input className="input mt-1 w-auto" type="date" value={item.date} onChange={event=>updateTask(item.id,{date:event.target.value})}/></label>{item.completed&&<Check size={17} className="text-emerald-600"/>}<button aria-label={`Delete ${item.title}`} className="text-slate-400 hover:text-red-600" onClick={()=>{deleteTask(item.id);toast.success('Task removed')}}><Trash2 size={17}/></button></article>):<div className="card text-center text-sm text-slate-500">No tasks in this {view}. Add a task or generate one from your roadmap.</div>}</div>
 </section>;
}
