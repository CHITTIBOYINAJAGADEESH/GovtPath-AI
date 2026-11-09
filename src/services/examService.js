import {exams} from '../data/exams';
export const allExams=(custom=[])=>[...custom,...exams];
export const getExam=(id,custom=[])=>allExams(custom).find(e=>e.id===id);
export function filterExams(list,{q='',category='all',state='all'}){
 const s=q.trim().toLowerCase();
 return list.filter(e=>(category==='all'||e.category===category)&&(state==='all'||e.state===state)&&(!s||`${e.name} ${e.org} ${e.categoryLabel}`.toLowerCase().includes(s)));
}
