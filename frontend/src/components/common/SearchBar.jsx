import {useState} from 'react';
import {Search} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

export default function SearchBar(){
 const [query,setQuery]=useState('');
 const navigate=useNavigate();
 const submit=event=>{event.preventDefault();navigate(`/app/explore-exams?q=${encodeURIComponent(query.trim())}`)};
 return <form className="relative w-full max-w-xs" role="search" onSubmit={submit}>
  <Search className="absolute left-3 top-2.5 text-slate-400" size={17} aria-hidden="true"/>
  <input className="input pl-9" aria-label="Search examinations" placeholder="Search exams…" value={query} onChange={event=>setQuery(event.target.value)}/>
 </form>;
}
