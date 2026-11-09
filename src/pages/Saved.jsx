import {useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {Bookmark,Trash2} from 'lucide-react';
import {allExams} from '../services/examService';
import {useStore} from '../store/useStore';
import {demoJobs} from '../data/jobs';

export default function Saved(){
 const {custom,bookmarks,toggleBookmark,notes,savedJobs,toggleSavedJob,savedItems,toggleSavedItem}=useStore();
 const [search,setSearch]=useState('');
 const catalogue=useMemo(()=>allExams(custom),[custom]);
 const examIds=catalogue.map(exam=>exam.id);
 const exams=catalogue.filter(exam=>bookmarks.includes(exam.id)&&exam.name.toLowerCase().includes(search.toLowerCase()));
 const topics=bookmarks.filter(id=>!examIds.includes(id)&&id.toLowerCase().includes(search.toLowerCase()));
 const savedNotes=Object.entries(notes).filter(([,note])=>note.trim()&&`${note}`.toLowerCase().includes(search.toLowerCase()));
 const jobs=demoJobs.filter(job=>savedJobs.includes(job.id)&&`${job.title} ${job.organization}`.toLowerCase().includes(search.toLowerCase()));
 const otherItems=savedItems.filter(item=>`${item.title} ${item.type}`.toLowerCase().includes(search.toLowerCase()));
 return <section><h1 className="text-2xl font-bold">Saved items</h1><p className="text-sm text-slate-500">Bookmarks, topic notes, and saved job links are stored on this device.</p><input className="input mt-5 max-w-lg" placeholder="Search saved items" aria-label="Search saved items" value={search} onChange={event=>setSearch(event.target.value)}/>
  {exams.length>0&&<div className="mt-5"><h2 className="font-semibold">Saved examinations</h2><div className="mt-2 grid gap-3 sm:grid-cols-2">{exams.map(exam=><article className="card flex items-center justify-between gap-3" key={exam.id}><div><p className="font-medium">{exam.name}</p><p className="text-xs text-slate-500">{exam.categoryLabel}</p></div><div className="flex gap-2"><Link className="text-sm text-brand-600" to={`/exams/${exam.id}`}>Details</Link><button aria-label={`Unsave ${exam.name}`} onClick={()=>toggleBookmark(exam.id)}><Trash2 size={16}/></button></div></article>)}</div></div>}
  {topics.length>0&&<div className="mt-5"><h2 className="font-semibold">Bookmarked topics</h2>{topics.map(id=><div className="card mt-2 flex items-center justify-between gap-3 text-sm" key={id}><span>{id.split(':').slice(1).join(' · ')||id}</span><div className="flex gap-3"><Link className="text-brand-600" to="/app/learning">Open learning</Link><button aria-label="Remove topic bookmark" onClick={()=>toggleBookmark(id)}><Trash2 size={16}/></button></div></div>)}</div>}
  {savedNotes.length>0&&<div className="mt-5"><h2 className="font-semibold">Topic notes</h2>{savedNotes.map(([id,note])=><div className="card mt-2 flex items-start justify-between gap-3" key={id}><div><p className="text-xs text-slate-500">{id.split(':').slice(1).join(' · ')}</p><p className="mt-1 text-sm">{note}</p></div><Link className="text-sm text-brand-600" to="/app/learning">Edit</Link></div>)}</div>}
  {jobs.length>0&&<div className="mt-5"><h2 className="font-semibold">Saved job portals</h2>{jobs.map(job=><div className="card mt-2 flex items-center justify-between gap-3" key={job.id}><span className="text-sm">{job.organization}</span><div className="flex gap-3"><a className="text-sm text-brand-600" href={job.url} target="_blank" rel="noreferrer">Official site</a><button onClick={()=>toggleSavedJob(job.id)} aria-label="Remove saved job"><Trash2 size={16}/></button></div></div>)}</div>}
  {otherItems.length>0&&<div className="mt-5"><h2 className="font-semibold">Other saved content</h2>{otherItems.map(item=><div className="card mt-2 flex items-center justify-between" key={`${item.type}-${item.id}`}><span className="text-sm">{item.title} <span className="text-xs text-slate-500">· {item.type}</span></span><button aria-label={`Remove ${item.title}`} onClick={()=>toggleSavedItem(item)}><Trash2 size={16}/></button></div>)}</div>}
  {!exams.length&&!topics.length&&!savedNotes.length&&!jobs.length&&!otherItems.length&&<div className="card mt-5 text-center"><Bookmark className="mx-auto text-slate-400"/><p className="mt-2 text-sm text-slate-500">Nothing saved yet. Bookmark exams and syllabus topics to find them here.</p><Link className="btn mt-3" to="/app/explore-exams">Explore exams</Link></div>}
 </section>;
}
