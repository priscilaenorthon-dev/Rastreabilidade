'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, LogIn, User } from 'lucide-react';

export function ClientLoginForm() {
  const router = useRouter();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Informe usuario e senha para continuar.');
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
        setErrorMessage(payload.message ?? 'Falha no login do cliente.');
        return;
      }

      router.push('/cliente');
      router.refresh();
    } catch {
      setErrorMessage('Falha no login do cliente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label htmlFor="client-username" className="text-xs font-semibold text-slate-300">
          Usuario
        </label>
        <div className="relative">
          <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="client-username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Digite seu usuario"
            className="w-full rounded-xl border border-white/15 bg-white/10 py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="client-password" className="text-xs font-semibold text-slate-300">
          Senha
        </label>
        <div className="relative">
          <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="client-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Digite sua senha"
            className="w-full rounded-xl border border-white/15 bg-white/10 py-2.5 pl-9 pr-10 text-sm text-white outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {errorMessage && <p className="rounded-lg border border-red-300/40 bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-200">{errorMessage}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:-translate-y-px hover:bg-blue-700 disabled:opacity-60"
      >
        <span>{loading ? 'Entrando...' : 'Entrar como cliente'}</span>
        <LogIn size={16} />
      </button>
    </form>
  );
}
