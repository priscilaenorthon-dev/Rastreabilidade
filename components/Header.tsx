'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Search, Bell, HelpCircle, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
}

export function Header({ title, onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 py-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800/80 dark:bg-slate-900/90 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:-translate-y-px hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={18} />
        </button>
        <h2 className="truncate text-base font-bold text-slate-800 dark:text-white sm:text-lg lg:text-xl">{title}</h2>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-6">
        <div className="relative hidden max-w-md xl:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar mangueiras, certificados..." 
            className="pl-10 pr-4 py-2 w-64 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-slate-100 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/oportunidades" className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-colors" aria-label="Abrir oportunidades">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </Link>
          <Link href="/relatorios" className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" aria-label="Abrir relatorios">
            <HelpCircle size={18} />
          </Link>
          <div className="mx-1 hidden h-6 w-px bg-slate-200 dark:bg-slate-800 sm:block"></div>
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
