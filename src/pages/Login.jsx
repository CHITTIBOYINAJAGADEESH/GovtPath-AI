import {useState} from 'react';import {useNavigate,Link} from 'react-router-dom';import {useStore} from '../store/useStore';import toast from 'react-hot-toast';
// Simulated auth: any valid-looking input signs in. No backend.
export default function Login({register}){const [f,setF]=useState({name:'',email:'',password:''});const [err,setErr]=useState({});const login=useStore(s=>s.login);const go=useNavigate();
 const submit=e=>{e.preventDefault();const er={};if(register&&!f.name.trim())er.name='Enter your full name';if(!/^\S+@\S+\.\S+$/.test(f.email))er.email='Enter a valid email';if(f.password.length<6)er.password='Use at least 6 characters';setErr(er);if(Object.keys(er).length)return;
  login(f.name||f.email.split('@')[0],f.email);toast.success('Signed in (demo)');go('/onboarding');};
 const fields=register?[['name','Full name','text'],['email','Email','email'],['password','Password','password']]:[['email','Email','email'],['password','Password','password']];
 return <form onSubmit={submit} className="card mx-auto mt-16 max-w-sm space-y-4"><h1 className="text-xl font-bold">{register?'Create your account':'Welcome back'}</h1>
 {fields.map(([key,label,type])=><label key={key} className="block text-sm font-medium">{label}<input className="input mt-1" type={type} value={f[key]} onChange={e=>setF({...f,[key]:e.target.value})} aria-invalid={!!err[key]}/>{err[key]&&<span className="text-xs text-red-600">{err[key]}</span>}</label>)}
 <button className="btn w-full">{register?'Create account':'Log in'}</button><p className="text-xs text-slate-500">Demo authentication only – nothing is sent to a server.</p>
 <Link className="text-sm text-brand-600" to={register?'/login':'/register'}>{register?'Have an account? Log in':'New here? Register'}</Link></form>;}
