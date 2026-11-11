import {useEffect,useRef,useState} from 'react';
import {Link,useNavigate,useParams} from 'react-router-dom';
import {Check,Flag,Trash2} from 'lucide-react';
import toast from 'react-hot-toast';
import {usePrimary} from '../hooks';
import {getMockTest} from '../data/mockTests';
import {useStore} from '../store/useStore';

export default function TestAttempt(){
 const {testId}=useParams();
 const navigate=useNavigate();
 const {exam}=usePrimary();
 const {saveAttempt,log}=useStore();
 const test=exam&&getMockTest(exam.id,testId);
 const storageKey=exam&&test?`govtpath-attempt:${exam.id}:${test.id}`:null;
 const [answers,setAnswers]=useState(()=>storageKey?JSON.parse(localStorage.getItem(storageKey)||'{}'):{});
 const [review,setReview]=useState([]);
 const [current,setCurrent]=useState(0);
 const [seconds,setSeconds]=useState(test?test.durationMinutes*60:0);
 const completion=useRef(false);
 const startedAt=useRef(Date.now());
 const questions=test?.questions||[];
 const question=questions[current];

 const finish=()=>{
  if(completion.current||!test||!exam)return;
  completion.current=true;
  const correct=questions.filter((item,index)=>answers[index]===item.a).length;
  const answered=Object.keys(answers).length;
  const maxScore=questions.length*4;
  const score=correct*4;
  questions.forEach((item,index)=>log({exam:exam.id,subject:item.subject,topic:item.topic,correct:answers[index]===item.a,testId:test.id}));
  const attempt={exam:exam.id,examName:exam.name,title:test.title,score,maxScore,correct,incorrect:answered-correct,unanswered:questions.length-answered,accuracy:answered?correct/answered*100:0,durationSeconds:Math.round((Date.now()-startedAt.current)/1000),questions,answers};
  saveAttempt(attempt);
  if(storageKey)localStorage.removeItem(storageKey);
  toast.success('Test submitted. Your result is ready.');
  navigate('/app/results');
 };
 const finishRef=useRef(finish);
 finishRef.current=finish;

 useEffect(()=>{
  if(!test)return undefined;
  setSeconds(test.durationMinutes*60);
  const timer=window.setInterval(()=>setSeconds(value=>{
   if(value<=1){window.clearInterval(timer);finishRef.current();return 0}
   return value-1;
  }),1000);
  return()=>window.clearInterval(timer);
 },[test?.id]);
 useEffect(()=>{
  if(storageKey)localStorage.setItem(storageKey,JSON.stringify(answers));
 },[answers,storageKey]);

 if(!exam||!test)return <div className="card text-center"><p>This test is unavailable. Select an examination and choose a test.</p><Link className="btn mt-3" to="/app/mock-tests">Back to mock tests</Link></div>;
 const selectAnswer=value=>setAnswers(previous=>({...previous,[current]:value}));
 const toggleReview=()=>setReview(previous=>previous.includes(current)?previous.filter(index=>index!==current):[...previous,current]);
 const time=`${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`;
 return <section><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">{test.title}</h1><p className="text-sm text-slate-500">{exam.name} · Answers autosave on this device</p></div><div className={`rounded-xl px-4 py-2 font-mono font-semibold ${seconds<60?'bg-red-50 text-red-700':'bg-slate-100'}`} aria-live="polite">{time}</div></div>
  <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_240px]"><article className="card"><div className="flex items-center justify-between text-sm text-slate-500"><span>Question {current+1} of {questions.length}</span><span>{question.subject} · {question.topic}</span></div><h2 className="mt-4 font-semibold">{question.q}</h2>
   <div className="mt-4 space-y-2">{question.o.map((option,index)=><button key={option} onClick={()=>selectAnswer(index)} aria-pressed={answers[current]===index} className={`w-full rounded-xl border p-3 text-left text-sm ${answers[current]===index?'border-brand-500 bg-brand-50':'border-slate-200 hover:bg-slate-50'}`}>{option}</button>)}</div>
   <div className="mt-5 flex flex-wrap gap-2"><button className="btn-ghost" onClick={()=>setAnswers(previous=>{const next={...previous};delete next[current];return next})}><Trash2 size={15}/>Clear response</button><button className="btn-ghost" onClick={toggleReview}><Flag size={15}/>{review.includes(current)?'Unmark review':'Mark for review'}</button><div className="ml-auto flex gap-2"><button className="btn-ghost" disabled={current===0} onClick={()=>setCurrent(current-1)}>Previous</button><button className="btn" disabled={current===questions.length-1} onClick={()=>setCurrent(current+1)}>Next</button></div></div>
  </article>
  <aside className="card"><h2 className="font-semibold">Question palette</h2><div className="mt-3 grid grid-cols-5 gap-2">{questions.map((_,index)=><button key={index} aria-label={`Go to question ${index+1}`} onClick={()=>setCurrent(index)} className={`relative h-10 rounded-lg border text-sm ${current===index?'border-brand-600 bg-brand-50 font-semibold':answers[index]!==undefined?'border-emerald-300 bg-emerald-50':review.includes(index)?'border-amber-300 bg-amber-50':'border-slate-200'}`}>{index+1}{review.includes(index)&&<Flag className="absolute -right-1 -top-1 text-amber-600" size={11}/>}</button>)}</div>
   <div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><Check size={14} className="text-emerald-600"/>{Object.keys(answers).length} answered</div><button className="btn mt-5 w-full" onClick={()=>{if(window.confirm('Submit this test now?'))finish()}}>Submit test</button>
  </aside></div>
 </section>;
}
