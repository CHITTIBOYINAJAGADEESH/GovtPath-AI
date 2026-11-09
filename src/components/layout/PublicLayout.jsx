import {Link,Outlet,NavLink} from 'react-router-dom';import {GraduationCap} from 'lucide-react';import {useStore} from '../../store/useStore';
export default function PublicLayout(){const user=useStore(s=>s.user);return(<div className="min-h-screen">
 <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur"><nav className="mx-auto flex w-full items-center justify-between px-4 py-3 lg:px-24">
  <Link to="/" className="flex items-center gap-2 font-extrabold text-brand-700"><GraduationCap/>GovtPath AI</Link>
  <div className="flex items-center gap-4 text-sm font-medium"><NavLink to="/exams" className="hover:text-brand-600">Explore exams</NavLink>
   {user?<Link className="btn" to="/app/dashboard">Dashboard</Link>:<><Link to="/login" className="hover:text-brand-600">Log in</Link><Link className="btn" to="/register">Start preparing</Link></>}</div></nav></header>
 <Outlet/><footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">© GovtPath AI – frontend demo. Exam data is illustrative and unverified; always check official notifications.</footer></div>);}
