'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export function ClientLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch('/api/client-auth/logout', {
        method: 'POST',
      });
    } finally {
      router.push('/cliente/login');
      router.refresh();
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
    >
      {loading ? 'Saindo...' : 'Sair'}
    </button>
  );
}
