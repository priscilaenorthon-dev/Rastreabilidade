'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Factory, User, Lock, Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = React.useState('admin');
  const [password, setPassword] = React.useState('admin1234');
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Informe usuário e senha para continuar.');
      return;
    }

    setErrorMessage('');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10 w-full max-w-md px-4 py-8 sm:px-6 sm:py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_70px_-24px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center mb-10">
              <div className="bg-blue-600 p-3 rounded-xl mb-4 shadow-lg shadow-blue-600/30">
                <Factory className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase sm:text-2xl">HoseTrack Pro</h1>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1 text-center">Gestão de Mangueiras e Conexões Industriais</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1" htmlFor="username">Usuário</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none text-sm font-medium" 
                    id="username" 
                    placeholder="Digite seu usuário" 
                    type="text" 
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 ml-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider" htmlFor="password">Senha</label>
                  <a className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-wider text-right" href="#">Esqueceu a senha?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-11 pr-12 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none text-sm font-medium" 
                    id="password" 
                    placeholder="Digite sua senha" 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-1">
                <input className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" id="remember" type="checkbox"/>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="remember">Lembrar acesso</label>
              </div>

              {errorMessage && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                  {errorMessage}
                </p>
              )}

              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-px hover:bg-blue-700 hover:shadow-blue-600/35 active:scale-[0.98]" type="submit">
                <span>Entrar no Sistema</span>
                <LogIn size={18} />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4">
              <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 hover:text-blue-600 transition-colors">
                <ShieldCheck size={16} />
                Suporte Técnico
              </button>
            </div>
          </div>
        </motion.div>

        <footer className="mt-8 text-center text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© 2024 HoseTrack Pro. Todos os direitos reservados.</p>
          <p className="mt-1">Sistema de Rastreabilidade e Manutenção Preditiva.</p>
        </footer>
      </main>

      <div className="fixed right-4 top-4 hidden items-center gap-4 sm:right-6 sm:top-6 sm:flex">
        <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Servidor Online</span>
        </div>
      </div>
    </div>
  );
}
