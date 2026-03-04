'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Bell, HelpCircle, User } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h2>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar mangueiras, certificados..." 
            className="pl-10 pr-4 py-2 w-64 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-slate-100 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/oportunidades" className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-colors" aria-label="Abrir oportunidades">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </Link>
          <Link href="/relatorios" className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" aria-label="Abrir relatorios">
            <HelpCircle size={20} />
          </Link>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2"></div>
          <Link href="/login" className="flex items-center gap-2 p-1 pr-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600">
              <User size={16} />
            </div>
            <span className="text-sm font-medium hidden sm:block">Perfil</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
