import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import {AnimatePresence,motion} from 'framer-motion';
import {X} from 'lucide-react';
import StudentHeader from './StudentHeader';
import StudentSidebar from './StudentSidebar';
import PageContainer from '../common/PageContainer';

export default function AppLayout(){
 const [open,setOpen]=useState(false);
 return <div className="min-h-screen lg:flex">
  <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-slate-200 bg-white lg:block"><StudentSidebar/></aside>
  <div className="min-w-0 flex-1">
   <StudentHeader onMenuOpen={()=>setOpen(true)}/>
   <AnimatePresence>{open&&<motion.div className="fixed inset-0 z-40 flex lg:hidden" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.aside initial={{x:-240}} animate={{x:0}} exit={{x:-240}} className="h-full w-60 bg-white shadow-xl"><button aria-label="Close menu" className="absolute right-3 top-3 z-10 rounded-lg p-1 text-slate-500 hover:bg-slate-100" onClick={()=>setOpen(false)}><X size={18}/></button><StudentSidebar onNavigate={()=>setOpen(false)}/></motion.aside><button className="flex-1 bg-black/30" aria-label="Close navigation" onClick={()=>setOpen(false)}/></motion.div>}</AnimatePresence>
   <PageContainer><Outlet/></PageContainer>
  </div>
 </div>;
}
