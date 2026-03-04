'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Package,
  MoreVertical,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const kpiData = [
  { label: 'Total Mangueiras', value: '1.240', change: '+5%', trend: 'up', icon: Package },
  { label: 'Total Conectores', value: '3.850', change: '-2%', trend: 'down', icon: Activity },
  { label: 'Prox. Vencimento', value: '42', change: '+12%', trend: 'up', icon: Clock },
  { label: 'Vencidos', value: '15', change: 'Crítico', trend: 'danger', icon: AlertTriangle },
  { label: 'Em Manutenção', value: '08', change: 'Estável', trend: 'neutral', icon: Activity },
  { label: 'Oportunidades', value: '24', change: '+8%', trend: 'up', icon: CheckCircle2 },
];

const barData = [
  { name: 'Empresa A', value: 1250 },
  { name: 'Empresa B', value: 980 },
  { name: 'Empresa C', value: 520 },
  { name: 'Empresa D', value: 1100 },
  { name: 'Empresa E', value: 780 },
];

const statusData = [
  { name: 'Ativo', value: 4780, color: '#2563eb' },
  { name: 'Manut.', value: 310, color: '#eab308' },
  { name: 'Vencido', value: 150, color: '#ef4444' },
];

const alerts = [
  { id: '#MANG-7742', company: 'Petrobras - Refinaria A', type: 'Alta Pressão 2"', date: '12/05/2024', status: 'VENCIDO' },
  { id: '#CONN-1029', company: 'Vale - Mina Norte', type: 'Conector Hidráulico', date: '05/06/2024', status: 'PROX. VENCIMENTO' },
  { id: '#MANG-8821', company: 'ArcelorMittal - Usina', type: 'Mangueira Sucção', date: '14/05/2024', status: 'VENCIDO' },
  { id: '#MANG-2210', company: 'Braskem - Polo', type: 'Composto Químico', date: '12/07/2024', status: 'EM MANUTENÇÃO' },
];

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard Principal">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {kpiData.map((kpi) => (
          <div 
            key={kpi.label}
            className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-500">
                <kpi.icon size={18} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                kpi.trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
                kpi.trend === 'down' ? 'bg-red-50 text-red-600' :
                kpi.trend === 'danger' ? 'bg-red-600 text-white' :
                'bg-slate-100 text-slate-600'
              }`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              {kpi.label}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white">Equipamentos por Empresa</h3>
            <select className="text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-none">
              <option>Últimos 30 dias</option>
              <option>Este Ano</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white">Status dos Equipamentos</h3>
            <div className="flex gap-3">
              {statusData.map((s) => (
                <span key={s.name} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></div>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center h-64 gap-6 relative">
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-3xl font-black text-slate-800 dark:text-white">94%</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Disponível</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} />
            Alertas Recentes
          </h3>
          <button className="text-blue-600 text-sm font-semibold hover:underline">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Equipamento ID</th>
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Vencimento</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{alert.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{alert.company}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{alert.type}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${
                    alert.status === 'VENCIDO' ? 'text-red-500' : 'text-amber-500'
                  }`}>{alert.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                      alert.status === 'VENCIDO' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      alert.status === 'PROX. VENCIMENTO' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
