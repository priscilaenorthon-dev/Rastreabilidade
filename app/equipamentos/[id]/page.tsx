'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  QrCode, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  User, 
  Settings, 
  History, 
  ClipboardCheck, 
  Wrench, 
  Package, 
  Download, 
  FileText,
  ChevronRight,
  Verified,
  Home
} from 'lucide-react';

const timelineItems = [
  { 
    title: 'Inspeção Periódica de Rotina', 
    date: '25 OUT 2023', 
    description: 'Verificação de integridade da malha de aço e conectores. Nenhum vazamento detectado sob 3000 PSI.', 
    user: 'Ricardo Silva', 
    role: 'Inspetor',
    status: 'Aprovado',
    icon: ClipboardCheck,
    color: 'blue'
  },
  { 
    title: 'Manutenção Preventiva - Substituição de Vedação', 
    date: '12 AGO 2023', 
    description: 'Troca preventiva dos O-rings frontais devido ao tempo de uso. Reaperto de flanges conforme manual técnico.', 
    user: 'Marcos Oliveira', 
    role: 'Técnico',
    status: 'Custo: R$ 450,00',
    icon: Wrench,
    color: 'amber'
  },
  { 
    title: 'Instalação e Comissionamento', 
    date: '05 JAN 2023', 
    description: 'Equipamento novo instalado na Unidade de Destilação. Teste hidrostático inicial realizado com sucesso.', 
    user: 'Almoxarifado Central', 
    role: 'Origem',
    status: '',
    icon: Package,
    color: 'slate'
  },
];

export default function EquipamentoDetalhesPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <DashboardLayout title={`Equipamento: ${id}`}>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 font-bold uppercase tracking-wider">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={12} />
          <Link href="/equipamentos" className="hover:text-blue-600">Equipamentos</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 dark:text-white">{id}</span>
        </div>

        {/* Equipment Header Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="flex flex-col md:flex-row gap-8 w-full">
              <div className="flex flex-col items-center">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 w-36 h-36 flex items-center justify-center relative group cursor-pointer">
                  <QrCode className="text-slate-400 group-hover:text-blue-600 transition-colors" size={80} strokeWidth={1} />
                  <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Digital ID Scanner</span>
              </div>

              <div className="flex flex-col flex-grow">
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Mangueira de Alta Pressão {id}</h1>
                  <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 size={14} />
                    Status: OK
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-6">Escaneado pela última vez em: 25 de Outubro, 2023 - 14:32</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Fabricante</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">TechHose Industrial</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Localização</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Refinaria Norte - Bloco C</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Setor</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Manutenção de Fluídos</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Próxima Revisão</p>
                    <p className="text-sm font-bold text-blue-600">15/01/2024</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                <ClipboardCheck size={18} />
                Registrar Nova Inspeção
              </button>
              <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-widest py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                <QrCode size={18} />
                Imprimir Etiqueta QR
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline Section */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <History className="text-blue-600" size={20} />
                Histórico e Rastreabilidade
              </h2>
              <div className="flex gap-2">
                <button className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 bg-blue-600 text-white rounded-lg shadow-md shadow-blue-500/10">Todos</button>
                <button className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 text-slate-500 hover:text-blue-600 transition-colors">Inspeções</button>
                <button className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 text-slate-500 hover:text-blue-600 transition-colors">Trocas</button>
              </div>
            </div>
            <div className="p-8">
              <div className="relative space-y-12 before:absolute before:inset-0 before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                {timelineItems.map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-8">
                    <div className={`absolute left-0 flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border-2 shadow-sm z-10 ${
                      item.color === 'blue' ? 'border-blue-600 text-blue-600' :
                      item.color === 'amber' ? 'border-amber-500 text-amber-500' :
                      'border-slate-400 text-slate-400'
                    }`}>
                      <item.icon size={24} />
                    </div>
                    <div className="ml-16 w-full">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">{item.title}</h3>
                        <time className="text-[10px] font-black text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg uppercase tracking-wider">{item.date}</time>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{item.description}</p>
                      <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-2 text-slate-400">
                          <User size={14} /> 
                          {item.role}: <span className="text-slate-600 dark:text-slate-300">{item.user}</span>
                        </span>
                        {item.status && (
                          <span className={`flex items-center gap-2 ${
                            item.status === 'Aprovado' ? 'text-emerald-600' : 'text-slate-500'
                          }`}>
                            {item.status === 'Aprovado' ? <Verified size={14} /> : <Clock size={14} />}
                            {item.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Details */}
          <div className="space-y-6">
            {/* Technical Specs */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Settings className="text-blue-600" size={16} />
                Especificações Técnicas
              </h3>
              <div className="space-y-1">
                {[
                  { label: 'Diâmetro Nominal', value: '1/2" (12.7 mm)' },
                  { label: 'Pressão de Trabalho', value: '5000 PSI / 345 bar' },
                  { label: 'Material Interno', value: 'PTFE Corrugado' },
                  { label: 'Cobertura', value: 'Inox 304 (Malha Dupla)' },
                  { label: 'Comprimento', value: '2500 mm' },
                ].map((spec, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
                    <span className="text-slate-500 font-medium">{spec.label}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FileText className="text-blue-600" size={16} />
                Documentação
              </h3>
              <div className="space-y-3">
                <a className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group" href="#">
                  <div className="flex items-center gap-3">
                    <FileText className="text-red-500" size={20} />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Certificado de Teste</span>
                  </div>
                  <Download className="text-slate-300 group-hover:text-blue-600 transition-colors" size={18} />
                </a>
                <a className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group" href="#">
                  <div className="flex items-center gap-3">
                    <FileText className="text-blue-500" size={20} />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Manual do Fabricante</span>
                  </div>
                  <Download className="text-slate-300 group-hover:text-blue-600 transition-colors" size={18} />
                </a>
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="text-blue-600" size={14} />
                  Localização Geográfica
                </h3>
              </div>
              <div className="h-48 bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <div className="bg-blue-600/20 p-4 rounded-full animate-pulse">
                  <MapPin className="text-blue-600" size={32} />
                </div>
                <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-200 dark:border-slate-700">
                  22.3708° S, 41.7744° W
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
