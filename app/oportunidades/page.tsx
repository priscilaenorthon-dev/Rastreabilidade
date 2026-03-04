'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Download, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  MoreVertical,
  Calendar,
  ChevronRight,
  FileText,
  Zap,
  Link as LinkIcon,
  Wind,
  Droplets
} from 'lucide-react';

const opportunities = [
  { 
    id: 'HOSE-992', 
    client: 'Mineradora Vale', 
    unit: 'Unidade Brumadinho', 
    type: 'Hidráulica Industrial', 
    service: 'Substituição Preventiva', 
    deadline: '15/10/2023', 
    urgency: 'Alta',
    icon: Zap
  },
  { 
    id: 'CONN-041', 
    client: 'Logística S.A.', 
    unit: 'Terminal Santos', 
    type: 'Alta Pressão (API)', 
    service: 'Inspeção Anual', 
    deadline: '22/10/2023', 
    urgency: 'Média',
    icon: LinkIcon
  },
  { 
    id: 'HOSE-115', 
    client: 'Siderurgia Norte', 
    unit: 'Parque Industrial II', 
    type: 'Vapor Saturado', 
    service: 'Teste de Estanqueidade', 
    deadline: '05/11/2023', 
    urgency: 'Baixa',
    icon: Wind
  },
  { 
    id: 'HOSE-442', 
    client: 'Petrobras', 
    unit: 'Refinaria Duque de Caxias', 
    type: 'Combustível / Offshore', 
    service: 'Recalibração de Sensores', 
    deadline: '12/10/2023', 
    urgency: 'Alta',
    icon: Droplets
  },
];

export default function OportunidadesPage() {
  return (
    <DashboardLayout title="Oportunidades de Serviço">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <p className="text-slate-500 dark:text-slate-400">Rastreabilidade e manutenção preventiva para ativos de alta pressão.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
          <PlusCircle size={18} />
          Nova Inspeção
        </button>
      </div>

      {/* Mini-Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Pendente</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">42</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-red-500 shadow-sm">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Urgência Alta</p>
          <p className="text-2xl font-black text-red-600">12</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Agendados</p>
          <p className="text-2xl font-black text-blue-600">08</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Vencimento Próximo</p>
          <p className="text-2xl font-black text-amber-500">15</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex flex-col min-w-[200px]">
          <span className="text-[10px] font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Empresa Cliente</span>
          <select className="rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
            <option>Todas as Empresas</option>
            <option>Mineradora Vale</option>
            <option>Logística S.A.</option>
            <option>Siderurgia Norte</option>
            <option>Petrobras</option>
          </select>
        </div>
        <div className="flex flex-col min-w-[180px]">
          <span className="text-[10px] font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Tipo de Serviço</span>
          <select className="rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
            <option>Todos os tipos</option>
            <option>Substituição Preventiva</option>
            <option>Inspeção Anual</option>
            <option>Teste de Estanqueidade</option>
          </select>
        </div>
        <div className="flex gap-2 self-end">
          <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300 transition-colors">
            <Filter size={16} />
            Filtros Avançados
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 transition-colors">
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Empresa Cliente</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Equipamento (ID/Tipo)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Serviço Sugerido</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Data Limite</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Urgência</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{opp.client}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{opp.unit}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                        <opp.icon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{opp.id}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{opp.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{opp.service}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`flex items-center gap-2 text-sm font-bold ${
                      opp.urgency === 'Alta' ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      <Calendar size={16} />
                      {opp.deadline}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      opp.urgency === 'Alta' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      opp.urgency === 'Média' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {opp.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded text-[10px] font-black uppercase transition-colors">Gerar Orçamento</button>
                      <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded text-[10px] font-black uppercase transition-colors">Detalhes</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Exibindo 1 a {opportunities.length} de 42 oportunidades</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-bold">1</button>
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50">2</button>
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50">Próximo</button>
          </div>
        </div>
      </div>

      {/* Promotion Area */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/20">
        <div>
          <h3 className="text-xl font-black mb-2 tracking-tight">Relatório de Rastreabilidade Completo</h3>
          <p className="text-blue-100 max-w-md text-sm font-medium">Gere relatórios de conformidade técnica em PDF para todas as oportunidades pendentes com um clique.</p>
        </div>
        <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all transform active:scale-95 shadow-lg">
          GERAR RELATÓRIO PDF
        </button>
      </div>
    </DashboardLayout>
  );
}
