import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {authApi} from '../api/client';

export const useStore=create(persist(set=>({
 user:null,
 selected:[],
 primary:null,
 prefs:{hours:3,months:6,level:'Beginner',targetDate:'',studyDays:['Mon','Tue','Wed','Thu','Fri','Sat']},
 progress:{},
 custom:[],
 bookmarks:[],
 activity:[],
 attempts:[],
 plannerTasks:[],
 chatHistory:[],
 savedJobs:[],
 savedItems:[],
 notes:{},
 settings:{language:'English',emailNotifications:true,pushNotifications:false,weeklyGoal:20},
 login:(name,email)=>set({user:{name,email}}),
 loginAsync: async (email, password) => {
   try {
     const res = await authApi.login(email, password);
     set({ user: res.user });
     return { success: true, user: res.user };
   } catch (err) {
     return { success: false, error: err.response?.data?.detail || 'Authentication failed' };
   }
 },
 registerAsync: async (name, email, password) => {
   try {
     const res = await authApi.register({ name, email, password });
     return { success: true, user: res };
   } catch (err) {
     return { success: false, error: err.response?.data || 'Registration failed' };
   }
 },
 logout:()=>{
   authApi.logout();
   set({user:null});
 },
 addExam:id=>set(s=>s.selected.includes(id)?s:{selected:[...s.selected,id],primary:s.primary||id}),
 removeExam:id=>set(s=>{const selected=s.selected.filter(x=>x!==id);return{selected,primary:s.primary===id?selected[0]||null:s.primary}}),
 setPrimary:id=>set({primary:id}),
 setPrefs:p=>set(s=>({prefs:{...s.prefs,...p}})),
 toggleTopic:id=>set(s=>({progress:{...s.progress,[id]:!s.progress[id]}})),
 addCustom:exam=>set(s=>({custom:[exam,...s.custom],selected:s.selected.includes(exam.id)?s.selected:[...s.selected,exam.id],primary:s.primary||exam.id})),
 toggleBookmark:id=>set(s=>({bookmarks:s.bookmarks.includes(id)?s.bookmarks.filter(x=>x!==id):[...s.bookmarks,id]})),
 log:entry=>set(s=>({activity:[...s.activity,{...entry,t:Date.now()}]})),
 saveAttempt:attempt=>set(s=>({attempts:[{...attempt,id:`attempt-${Date.now()}`,date:Date.now()},...s.attempts]})),
 addChatMessage:message=>set(s=>({chatHistory:[...s.chatHistory,{...message,id:`message-${Date.now()}-${s.chatHistory.length}`}]})),
 clearChatHistory:()=>set({chatHistory:[]}),
 addTask:task=>set(s=>({plannerTasks:[{...task,id:`task-${Date.now()}`,completed:false},...s.plannerTasks]})),
 updateTask:(id,patch)=>set(s=>({plannerTasks:s.plannerTasks.map(task=>task.id===id?{...task,...patch}:task)})),
 deleteTask:id=>set(s=>({plannerTasks:s.plannerTasks.filter(task=>task.id!==id)})),
 toggleSavedJob:id=>set(s=>({savedJobs:s.savedJobs.includes(id)?s.savedJobs.filter(jobId=>jobId!==id):[...s.savedJobs,id]})),
 toggleSavedItem:item=>set(s=>({savedItems:s.savedItems.some(saved=>saved.id===item.id&&saved.type===item.type)?s.savedItems.filter(saved=>saved.id!==item.id||saved.type!==item.type):[item,...s.savedItems]})),
 saveNote:(id,note)=>set(s=>({notes:{...s.notes,[id]:note}})),
 updateProfile:profile=>set(s=>({user:{...s.user,...profile}})),
 updateSettings:settings=>set(s=>({settings:{...s.settings,...settings}})),
}),{
 name:'govtpath-ai-demo',
 merge:(persisted,current)=>({
  ...current,
  ...persisted,
  prefs:{...current.prefs,...persisted.prefs},
 }),
}));
