'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  QrCode, 
  Info, 
  Settings as SettingsIcon, 
  Calendar, 
  FileText, 
  X, 
  Upload,
  Printer,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function EquipamentosPage() {
  return (
    <DashboardLayout title="Cadastro de Equipamentos">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Registre e monitore mangueiras e conectores de alta pressão com rastreabilidade completa.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 transition-colors">Cancelar</button>
            <button className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Salvar Equipamento</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Info Card */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Info className="text-blue-600" size={20} />
                Informações Gerais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">ID do Equipamento</label>
                  <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="Ex: MH-2024-001" type="text"/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tipo de Equipamento</label>
                  <div className="flex h-11 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
                    <button className="flex-1 h-full rounded-md bg-white dark:bg-slate-700 shadow-sm text-blue-600 text-xs font-bold transition-all">Mangueira</button>
                    <button className="flex-1 h-full rounded-md text-slate-500 text-xs font-bold transition-all">Conector</button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Fabricante</label>
                  <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="Nome do Fabricante" type="text"/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Modelo</label>
                  <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="Série / Modelo" type="text"/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Material</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all">
                    <option>Aço Inoxidável</option>
                    <option>Termoplástico</option>
                    <option>Borracha Sintética</option>
                    <option>Compósito</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Comprimento (mm)</label>
                  <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="Ex: 5000" type="number"/>
                </div>
              </div>
            </section>

            {/* Technical Specs Card */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <SettingsIcon className="text-blue-600" size={20} />
                Especificações Técnicas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Pressão de Trabalho (Bar)</label>
                  <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="Ex: 250" type="number"/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Pressão Máxima (Bar)</label>
                  <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="Ex: 600" type="number"/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Empresa Proprietária</label>
                  <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="Nome da Unidade / Empresa" type="text"/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Setor / Localização</label>
                  <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="Setor Operacional" type="text"/>
                </div>
              </div>
            </section>

            {/* Dates and Status Card */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Calendar className="text-blue-600" size={20} />
                Cronograma e Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Fabricação</label>
                  <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" type="date"/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Instalação</label>
                  <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" type="date"/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Validade</label>
                  <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" type="date"/>
                </div>
              </div>
              <div className="mt-6">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-3 block">Status Inicial</label>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 cursor-pointer bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 rounded-lg text-emerald-700 dark:text-emerald-400 transition-all hover:bg-emerald-100">
                    <input type="radio" name="status" className="text-emerald-600 focus:ring-emerald-500" defaultChecked />
                    <span className="text-xs font-bold">Ativo / Operacional</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-2.5 rounded-lg text-amber-700 dark:text-amber-400 transition-all hover:bg-amber-100">
                    <input type="radio" name="status" className="text-amber-600 focus:ring-amber-500" />
                    <span className="text-xs font-bold">Aguardando Inspeção</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100">
                    <input type="radio" name="status" className="text-slate-600 focus:ring-slate-500" />
                    <span className="text-xs font-bold">Em Estoque</span>
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: QR Code and Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Identificação QR Code</h3>
              <div className="w-48 h-48 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6 relative group cursor-pointer overflow-hidden transition-all hover:border-blue-500/50">
                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <QrCode className="text-blue-600" size={48} />
                </div>
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <QrCode size={64} strokeWidth={1} />
                  <p className="text-[10px] px-6 font-medium leading-relaxed">O QR Code será gerado automaticamente após salvar.</p>
                </div>
              </div>
              <button className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                <Printer size={16} />
                Imprimir Etiqueta
              </button>
            </div>

            <div className="bg-blue-600/5 dark:bg-blue-600/10 p-6 rounded-xl border border-blue-600/20">
              <h3 className="text-sm font-bold text-blue-600 mb-3 flex items-center gap-2">
                <AlertCircle size={18} />
                Dica de Rastreabilidade
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Certifique-se de que a <strong>Data de Validade</strong> esteja em conformidade com as normas da NR-13 para sistemas de alta pressão. O sistema enviará um alerta 30 dias antes do vencimento.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Documentos</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 group">
                  <FileText className="text-red-500" size={20} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">Manual_Tecnico.pdf</p>
                    <p className="text-[10px] text-slate-500">2.4 MB</p>
                  </div>
                  <button className="text-slate-400 hover:text-red-500 transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <button className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex flex-col items-center gap-2">
                  <Upload size={20} />
                  Upload de Certificados
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
