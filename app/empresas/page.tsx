'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  Building2, 
  PlusCircle, 
  Search, 
  Eye, 
  Edit2, 
  MoreVertical,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const companies = [
  { 
    name: 'Hidráulica Norte Ltda', 
    segment: 'Mineração', 
    cnpj: '12.345.678/0001-90', 
    location: 'Joinville / SC', 
    responsible: 'Carlos Silva', 
    email: 'carlos.silva@hidenorte.com.br',
    status: 'Ativo' 
  },
  { 
    name: 'Indústria Metalúrgica Sul', 
    segment: 'Siderurgia', 
    cnpj: '98.765.432/0001-11', 
    location: 'Curitiba / PR', 
    responsible: 'Ana Souza', 
    email: 'ana.souza@metalsul.ind.br',
    status: 'Ativo' 
  },
  { 
    name: 'Logística Rápida & Conexões', 
    segment: 'Logística', 
    cnpj: '45.678.901/0001-22', 
    location: 'São Paulo / SP', 
    responsible: 'Marcos Lima', 
    email: 'm.lima@lograpid.com',
    status: 'Inativo' 
  },
];

export default function EmpresasPage() {
  return (
    <DashboardLayout title="Gestão de Empresas Clientes">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-slate-500 text-sm">Visualize e gerencie as empresas parceiras e sua rastreabilidade.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
          <PlusCircle size={18} />
          Novo Cadastro
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <Building2 size={20} />
            </span>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+2 este mês</span>
          </div>
          <p className="text-2xl font-bold">124</p>
          <p className="text-sm text-slate-500">Total de Empresas</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <CheckCircle size={20} />
            </span>
          </div>
          <p className="text-2xl font-bold">118</p>
          <p className="text-sm text-slate-500">Cadastros Ativos</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
              <Clock size={20} />
            </span>
          </div>
          <p className="text-2xl font-bold">6</p>
          <p className="text-sm text-slate-500">Manutenções Pendentes</p>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Nome da Empresa</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">CNPJ</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Cidade/Estado</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Responsável</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {companies.map((company) => (
                <tr key={company.cnpj} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{company.name}</div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-tight mt-0.5">Segmento: {company.segment}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-600 dark:text-slate-400">{company.cnpj}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{company.location}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{company.responsible}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{company.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      company.status === 'Ativo' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Visualizar">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Editar">
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 font-medium">Mostrando {companies.length} de 124 empresas</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-sm hover:bg-slate-50 transition-colors">Anterior</button>
            <button className="px-3 py-1 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-sm hover:bg-slate-50 transition-colors">Próximo</button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-12">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <PlusCircle size={20} />
            </span>
            <h3 className="text-lg font-bold">Novo Cadastro de Empresa</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">* Campos obrigatórios</span>
        </div>
        <form className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nome da Empresa *</label>
              <input className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="Ex: Hidráulica Industrial S.A." type="text"/>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">CNPJ *</label>
              <input className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="00.000.000/0000-00" type="text"/>
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Endereço Completo</label>
              <input className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="Rua, Número, Bairro" type="text"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Cidade</label>
                <input className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="Cidade" type="text"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Estado</label>
                <select className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all">
                  <option value="">Selecione</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="PR">Paraná</option>
                  <option value="SP">São Paulo</option>
                  <option value="MG">Minas Gerais</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Responsável Técnico</label>
              <input className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="Nome Completo" type="text"/>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Telefone</label>
              <input className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="(00) 0000-0000" type="text"/>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Corporativo</label>
              <input className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="contato@empresa.com.br" type="email"/>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Segmento Industrial</label>
              <select className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all">
                <option value="">Selecione o Segmento</option>
                <option value="mineracao">Mineração</option>
                <option value="siderurgia">Siderurgia</option>
                <option value="quimica">Química/Petroquímica</option>
                <option value="agronegocio">Agronegócio</option>
                <option value="manutencao">Manutenção Industrial</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-6">
            <button className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" type="button">Cancelar</button>
            <button className="px-6 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20" type="submit">Salvar Cadastro</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
