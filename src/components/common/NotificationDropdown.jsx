import {useState} from 'react';
import {Bell} from 'lucide-react';
import {Link} from 'react-router-dom';
import {useStore} from '../../store/useStore';

export default function NotificationDropdown(){
 const [open,setOpen]=useState(false);
 const {plannerTasks,attempts}=useStore();
 const pending=plannerTasks.filter(task=>!task.completed).slice(0,3);
 const latest=attempts[0];
 const count=pending.length+(latest?1:0);
 return <div className="relative">
  <button className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100" aria-label={`Notifications${count?`, ${count} updates`:''}`} aria-expanded={open} onClick={()=>setOpen(!open)}><Bell size={19}/>{count>0&&<span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"/>}</button>
  {open&&<div className="absolute right-0 top-12 z-30 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"><h2 className="px-2 py-1 text-sm font-semibold">Study updates</h2>{pending.length?pending.map(task=><Link key={task.id} onClick={()=>setOpen(false)} to="/app/planner" className="block rounded-lg px-2 py-2 text-sm hover:bg-slate-50"><span className="block font-medium">{task.title}</span><span className="text-xs text-slate-500">Planned for {task.date}</span></Link>):<p className="px-2 py-2 text-sm text-slate-500">No pending planner tasks.</p>}{latest&&<Link onClick={()=>setOpen(false)} to="/app/results" className="mt-1 block rounded-lg px-2 py-2 text-sm hover:bg-slate-50"><span className="block font-medium">Latest test result</span><span className="text-xs text-slate-500">{latest.title} · {latest.score}/{latest.maxScore}</span></Link>}</div>}
 </div>;
}
