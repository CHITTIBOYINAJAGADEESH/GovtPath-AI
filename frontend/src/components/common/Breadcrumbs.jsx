import {Link,useLocation} from 'react-router-dom';

const labels={dashboard:'Dashboard','explore-exams':'Explore exams','my-exams':'My examinations',roadmap:'AI Roadmap',learning:'Syllabus & learning',practice:'Daily practice','mock-tests':'Mock tests',results:'Results',analytics:'Analytics','ai-tutor':'AI tutor',planner:'Study planner','government-jobs':'Government jobs',saved:'Saved items',settings:'Settings'};

export default function Breadcrumbs(){
 const {pathname}=useLocation();
 const segments=pathname.split('/').filter(Boolean);
 const title=segments[1]==='mock-tests'&&segments.at(-1)==='attempt'?'Mock test attempt':segments[1]==='results'&&segments.length>2?'Result details':labels[segments[1]]||'Student workspace';
 return <nav aria-label="Breadcrumb"><ol className="flex items-center gap-2 text-sm text-slate-500"><li><Link className="hover:text-brand-600" to="/app/dashboard">Home</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="font-medium text-slate-700">{title}</li></ol></nav>;
}
