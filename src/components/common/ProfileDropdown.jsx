import {useState} from 'react';
import {ChevronDown,LogOut,UserRound} from 'lucide-react';
import {Link,useNavigate} from 'react-router-dom';
import {useStore} from '../../store/useStore';

export default function ProfileDropdown(){
 const [open,setOpen]=useState(false);
 const {user,logout}=useStore();
 const navigate=useNavigate();
 const initials=(user?.name||'Student').split(/\s+/).map(part=>part[0]).join('').slice(0,2).toUpperCase();
 return <div className="relative">
  <button className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100" aria-label="Open profile menu" aria-expanded={open} onClick={()=>setOpen(!open)}><span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">{initials}</span><span className="hidden max-w-28 truncate text-sm font-medium sm:block">{user?.name||'Student'}</span><ChevronDown size={14}/></button>
  {open&&<div className="absolute right-0 top-12 z-30 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"><Link to="/app/settings" onClick={()=>setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50"><UserRound size={16}/>Profile & settings</Link><button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50" onClick={()=>{logout();navigate('/');setOpen(false)}}><LogOut size={16}/>Log out</button></div>}
 </div>;
}
