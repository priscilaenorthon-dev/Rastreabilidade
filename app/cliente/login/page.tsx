'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Factory, User, Lock, Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ClienteLoginPage() {
  const router = useRouter();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Informe usuário e senha para continuar.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/client-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({ message: '' }))) as { message?: string };
        setErrorMessage(payload.message ?? 'Usuário ou senha inválido.');
        return;
      }

      router.push('/cliente');
      router.refresh();
    } catch {
      setErrorMessage('Não foi possível validar o login agora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 font-sans dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <main className="relative z-10 w-full max-w-md px-4 py-8 sm:px-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_70px_-24px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="p-6 sm:p-8">
            <div className="mb-10 flex flex-col items-center">
              <div className="mb-4 rounded-xl bg-blue-600 p-3 shadow-lg shadow-blue-600/30">
                <Factory className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">HoseTrack Pro</h1>
              <p className="mt-1 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Gestão de Mangueiras e Conexões Industriais
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-500" htmlFor="username">
                  Usuário
                </label>
                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-blue-600">
                    <User size={18} />
                  </div>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    id="username"
                    placeholder="Digite seu usuário"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-500" htmlFor="password">
                  Senha
                </label>
                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-blue-600">
                    <Lock size={18} />
                  </div>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    id="password"
                    placeholder="Digite sua senha"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">{errorMessage}</p>
              )}

              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-px hover:bg-blue-700 hover:shadow-blue-600/35 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? 'Validando...' : 'Entrar no Sistema'}</span>
                <LogIn size={18} />
              </button>
            </form>

            <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Admin? Acesse em <a href="/login" className="text-blue-600 hover:underline">/login</a>
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-colors hover:text-blue-600">
                <ShieldCheck size={16} />
                Suporte Técnico
              </button>
            </div>
          </div>
        </motion.div>

        <footer className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
          <p>© 2024 HoseTrack Pro. Todos os direitos reservados.</p>
          <p className="mt-1">Sistema de Rastreabilidade e Manutenção Preditiva.</p>
        </footer>
      </main>
    </div>
  );
}
