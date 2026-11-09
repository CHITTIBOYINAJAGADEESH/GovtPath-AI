import {useMemo} from 'react';
import {useStore} from './store/useStore';
import {getExam} from './services/examService';
import {generateRoadmap} from './services/roadmapService';

export function usePrimary(){
 const {primary,custom,prefs,activity}=useStore();
 const exam=primary?getExam(primary,custom):null;
 const subjectPerformance=useMemo(()=>{
  const counts=activity.filter(item=>item.exam===primary).reduce((result,item)=>{
   const current=result[item.subject]||{correct:0,total:0};
   current.total++;
   if(item.correct)current.correct++;
   result[item.subject]=current;
   return result;
  },{});
  return Object.fromEntries(Object.entries(counts).map(([subject,value])=>[subject,value.correct/value.total]));
 },[activity,primary]);
 const roadmapPrefs=useMemo(()=>({...prefs,subjectPerformance}),[prefs,subjectPerformance]);
 const roadmap=useMemo(()=>exam?generateRoadmap(exam,roadmapPrefs):null,[exam,roadmapPrefs]);
 return {exam,roadmap};
}
