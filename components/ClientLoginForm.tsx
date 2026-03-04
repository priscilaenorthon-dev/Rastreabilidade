'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

export function ClientLoginForm() {
  const router = useRouter();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
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
        <label htmlFor="client-username" className="text-xs font-semibold text-slate-600">
          Usuario
        </label>
        <input
          id="client-username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Digite seu usuario"
          className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="client-password" className="text-xs font-semibold text-slate-600">
          Senha
        </label>
        <input
          id="client-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Digite sua senha"
          className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      {errorMessage && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:-translate-y-px hover:bg-blue-700 hover:shadow-md disabled:opacity-60"
      >
        <span>{loading ? 'Entrando...' : 'Entrar como cliente'}</span>
        <LogIn size={16} />
      </button>
    </form>
  );
}
