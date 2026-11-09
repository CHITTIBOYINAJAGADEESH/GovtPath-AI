import {useEffect,useRef,useState} from 'react';
import {Bot,Send,Sparkles} from 'lucide-react';
import {usePrimary} from '../hooks';
import {useStore} from '../store/useStore';
import {questions} from '../data/questions';

const suggestions=['Explain a topic simply','Give me a revision plan','Create a practice question'];
function replyFor(text,exam,subject){
 const normalized=text.toLowerCase();
 if(normalized.includes('question')||normalized.includes('quiz')){
  const question=(questions[exam.id]||questions.default).find(item=>subject==='General'||item.subject.toLowerCase()===subject.toLowerCase())||(questions[exam.id]||questions.default)[0];
  return `Practice question · ${question.subject} / ${question.topic}\n${question.q}\n${question.o.map((option,index)=>`${String.fromCharCode(65+index)}. ${option}`).join('\n')}\n\nTry it first, then open Daily Practice to check an explanation.`;
 }
 if(normalized.includes('plan')||normalized.includes('revision'))return `For ${exam.name}, try a short ${subject} revision block: review one topic, close your notes and recall the key points, then solve a few related questions. Repeat this for the next topic and mark finished syllabus items in Learning.`;
 return `Let's break ${subject} into smaller pieces for ${exam.name}. Start by writing down what you already know, review one concept at a time, and test your understanding with a question. Tell me the topic and I can suggest a focused way to review it.`;
}

export default function AITutor(){
 const {exam,roadmap}=usePrimary();
 const {chatHistory,addChatMessage,clearChatHistory}=useStore();
 const [text,setText]=useState('');
 const [subject,setSubject]=useState('General');
 const endRef=useRef(null);
 useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'})},[chatHistory]);
 const send=message=>{
  const prompt=message.trim();
  if(!prompt)return;
  addChatMessage({role:'user',text:prompt});
  addChatMessage({role:'assistant',text:replyFor(prompt,exam||{name:'your exam'},subject)});
  setText('');
 };
 return <section><div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold">AI tutor</h1><p className="text-sm text-slate-500">Local demo responses · not connected to an AI model.</p></div><label className="text-sm">Subject context<select className="input mt-1 w-auto" value={subject} onChange={event=>setSubject(event.target.value)}><option>General</option>{roadmap?.subjects.map(item=><option key={item.name}>{item.name}</option>)}</select></label></div>
  <div className="card mt-5 flex min-h-[420px] flex-col"><div className="flex items-center justify-between border-b border-slate-100 pb-3"><div className="flex items-center gap-2 font-semibold"><Bot size={18} className="text-brand-600"/>Study assistant <span className="chip">Demo</span></div><button className="text-xs text-slate-500 hover:text-red-600" onClick={clearChatHistory}>Clear chat</button></div>
   <div className="flex-1 space-y-3 overflow-y-auto py-4">{chatHistory.length?chatHistory.map(message=><div key={message.id} className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.role==='user'?'ml-auto bg-brand-600 text-white':'bg-slate-100 text-slate-700'}`}>{message.text}</div>):<div className="py-8 text-center"><Sparkles className="mx-auto text-brand-600"/><p className="mt-2 font-medium">What would you like to study?</p><p className="mt-1 text-sm text-slate-500">{exam?`Current exam: ${exam.name}`:'Choose an exam from My examinations for context.'}</p><div className="mt-4 flex flex-wrap justify-center gap-2">{suggestions.map(prompt=><button className="btn-ghost text-xs" key={prompt} onClick={()=>send(prompt)}>{prompt}</button>)}</div></div>}<div ref={endRef}/></div>
   <form className="flex gap-2 border-t border-slate-100 pt-3" onSubmit={event=>{event.preventDefault();send(text)}}><input className="input" value={text} onChange={event=>setText(event.target.value)} placeholder="Ask a study question…" aria-label="Message the demo tutor"/><button className="btn" aria-label="Send message" disabled={!text.trim()}><Send size={16}/></button></form>
  </div>
 </section>;
}
