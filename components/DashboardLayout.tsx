'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion } from 'motion/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-8 overflow-y-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
