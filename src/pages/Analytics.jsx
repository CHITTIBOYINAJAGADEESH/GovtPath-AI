import {useState} from 'react';
import {Bar,BarChart,CartesianGrid,Line,LineChart,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts';
import {eachDayOfInterval,format,isSameDay,subDays} from 'date-fns';
import {useStore} from '../store/useStore';

export default function Analytics(){
 const {activity,attempts,plannerTasks}=useStore();
 const [range,setRange]=useState(7);
 const [customStart,setCustomStart]=useState(format(subDays(new Date(),6),'yyyy-MM-dd'));
 const [customEnd,setCustomEnd]=useState(format(new Date(),'yyyy-MM-dd'));
 const days=range==='custom'
  ?customStart&&customEnd&&customStart<=customEnd?eachDayOfInterval({start:new Date(`${customStart}T00:00:00`),end:new Date(`${customEnd}T00:00:00`)}):[]
  :Array.from({length:range},(_,index)=>subDays(new Date(),range-1-index));
 const isInRange=date=>days.some(day=>isSameDay(new Date(date),day));
 const rangedActivity=activity.filter(item=>isInRange(item.t));
 const rangedAttempts=attempts.filter(item=>isInRange(item.date));
 const rangedCompletedTasks=plannerTasks.filter(task=>task.completed&&task.completedAt&&isInRange(task.completedAt));
 const chart=days.map(day=>{
  const entries=activity.filter(item=>isSameDay(new Date(item.t),day));
  const tests=attempts.filter(item=>isSameDay(new Date(item.date),day));
  const completedTasks=plannerTasks.filter(task=>task.completed&&task.completedAt&&isSameDay(new Date(task.completedAt),day)).length;
  return{day:format(day,range===7?'EEE':'MMM d'),questions:entries.length,accuracy:entries.length?Math.round(entries.filter(item=>item.correct).length/entries.length*100):0,studyHours:(entries.reduce((sum,item)=>sum+(item.seconds||0),0)+tests.reduce((sum,item)=>sum+(item.durationSeconds||0),0))/3600,completedTasks,score:tests.length?Math.round(tests.reduce((sum,item)=>sum+item.accuracy,0)/tests.length):null};
 });
 const total=rangedActivity.length;
 const subjectGroups=rangedActivity.reduce((groups,item)=>{const group=groups[item.subject]??={subject:item.subject,attempted:0,correct:0};group.attempted++;if(item.correct)group.correct++;return groups},{});
 const subjectData=Object.values(subjectGroups).map(item=>({...item,accuracy:Math.round(item.correct/item.attempted*100)}));
 const hasData=total>0||rangedAttempts.length>0||rangedCompletedTasks.length>0;
 const studyHours=(rangedActivity.reduce((sum,item)=>sum+(item.seconds||0),0)+rangedAttempts.reduce((sum,item)=>sum+(item.durationSeconds||0),0))/3600;
 return <section><div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold">Analytics</h1><p className="text-sm text-slate-500">Charts are calculated from your recorded practice and test activity.</p></div><label className="text-sm">Range<select className="input mt-1 w-auto" value={range} onChange={event=>setRange(event.target.value==='custom'?'custom':+event.target.value)}><option value={1}>Today</option><option value={7}>7 days</option><option value={30}>30 days</option><option value="custom">Custom range</option></select></label></div>
  {range==='custom'&&<div className="mt-3 flex flex-wrap gap-3"><label className="text-sm">From<input className="input mt-1" type="date" value={customStart} max={customEnd} onChange={event=>setCustomStart(event.target.value)}/></label><label className="text-sm">To<input className="input mt-1" type="date" value={customEnd} min={customStart} onChange={event=>setCustomEnd(event.target.value)}/></label></div>}
  {!hasData?<div className="card mt-5 text-center"><p>Complete practice questions or a mock test to start building your analytics.</p></div>:<>
   <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{[['Questions answered',total],['Answer accuracy',`${total?Math.round(rangedActivity.filter(item=>item.correct).length/total*100):0}%`],['Tests completed',rangedAttempts.length],['Study time',`${studyHours.toFixed(1)}h`],['Planner tasks completed',rangedCompletedTasks.length]].map(([title,value])=><div className="card" key={title}><div className="text-2xl font-bold">{value}</div><div className="text-xs text-slate-500">{title}</div></div>)}</div>
   <div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="card"><h2 className="font-semibold">Daily questions and accuracy</h2><div className="mt-3 h-64"><ResponsiveContainer><LineChart data={chart}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="day" fontSize={11}/><YAxis yAxisId="left" allowDecimals={false}/><YAxis yAxisId="right" orientation="right" domain={[0,100]}/><Tooltip/><Line yAxisId="left" dataKey="questions" stroke="#6955E8" name="Questions" strokeWidth={2}/><Line yAxisId="right" dataKey="accuracy" stroke="#17B897" name="Accuracy %" strokeWidth={2}/></LineChart></ResponsiveContainer></div><h3 className="mt-4 text-sm font-medium">Recorded study time by day</h3><div className="mt-2 h-40"><ResponsiveContainer><BarChart data={chart}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="day" fontSize={11}/><YAxis/><Tooltip/><Bar dataKey="studyHours" name="Study hours" fill="#17B897" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></div>
   <div className="card"><h2 className="font-semibold">Mock test accuracy</h2>{rangedAttempts.length?<div className="mt-3 h-64"><ResponsiveContainer><BarChart data={rangedAttempts.slice(0,10).map(attempt=>({name:attempt.title.replace(' demo test',''),accuracy:Math.round(attempt.accuracy)})).reverse()}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" fontSize={10}/><YAxis domain={[0,100]}/><Tooltip/><Bar dataKey="accuracy" fill="#477BEE" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div>:<p className="mt-4 text-sm text-slate-500">Complete a mock test to view score trends.</p>}</div>
   <div className="card mt-4"><h2 className="font-semibold">Subject accuracy</h2>{subjectData.length?<div className="mt-3 h-64"><ResponsiveContainer><BarChart data={subjectData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="subject" fontSize={11}/><YAxis domain={[0,100]}/><Tooltip/><Bar dataKey="accuracy" fill="#17B897" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div>:<p className="mt-3 text-sm text-slate-500">No practice questions recorded.</p>}</div>
   <div className="card mt-4"><h2 className="font-semibold">Planner task completion</h2><div className="mt-3 h-48"><ResponsiveContainer><BarChart data={chart}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="day" fontSize={11}/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="completedTasks" name="Completed tasks" fill="#6955E8" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></div></div>
  </>}
 </section>;
}
