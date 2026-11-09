import {questions} from './questions';

const templates=[
 {id:'full-length',title:'Full-length demo test',type:'Full-length',durationMinutes:20,questionLimit:10},
 {id:'sectional',title:'Sectional practice test',type:'Sectional',durationMinutes:10,questionLimit:5},
 {id:'daily-quiz',title:'Daily quick quiz',type:'Daily quiz',durationMinutes:5,questionLimit:3},
];

export function getMockTests(examId){
 const bank=questions[examId]||questions.default;
 return templates.map((test,index)=>{
  const section=bank.filter(question=>question.subject===bank[0].subject);
  const source=index===1&&section.length?section:bank;
  const count=Math.min(test.questionLimit,source.length);
  return {...test,questions:source.slice(0,count),examId};
 });
}

export function getMockTest(examId,testId){
 return getMockTests(examId).find(test=>test.id===testId);
}
