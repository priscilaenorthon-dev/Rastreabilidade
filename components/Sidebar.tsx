'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Wrench, 
  ClipboardCheck, 
  Lightbulb, 
  BarChart3, 
  Factory,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Empresas', href: '/empresas', icon: Building2 },
  { name: 'Equipamentos', href: '/equipamentos', icon: Factory },
  { name: 'Inspeções', href: '/inspecoes', icon: ClipboardCheck },
  { name: 'Manutenções', href: '/manutencoes', icon: Wrench },
  { name: 'Oportunidades', href: '/oportunidades', icon: Lightbulb },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface SidebarContentProps {
  pathname: string;
  onNavigate?: () => void;
}

function SidebarContent({ pathname, onNavigate }: SidebarContentProps) {
  return (
    <div className="h-full p-5 sm:p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Factory size={24} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white text-base font-bold leading-none">HoseTrack Pro</h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider mt-1 font-semibold">Gestão Industrial</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:translate-x-0.5',
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
            <span className="font-bold text-sm">AD</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-bold truncate">Administrador</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">admin@hosetrack.pro</p>
          </div>
        </div>
        <Link
          href="/login"
          onClick={onNavigate}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Sair</span>
        </Link>
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-white/95 dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <SidebarContent pathname={pathname} />
      </aside>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px] transition-opacity lg:hidden',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onMobileClose}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-200 ease-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-hidden={!mobileOpen}
      >
        <SidebarContent pathname={pathname} onNavigate={onMobileClose} />
      </aside>
    </>
  );
}
