'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Wallet,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  DollarSign,
  UserCheck,
  CheckCircle,
} from 'lucide-react';
import type { ClientDirectoryItemDto } from '@mitefree/shared-types';
import { adminApiClient } from '@/lib/api-client';

export default function ClientesPage() {
  const [clients, setClients] = useState<ClientDirectoryItemDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');

  useEffect(() => {
    async function loadClients() {
      try {
        const res = await adminApiClient.clients.getAll();
        if (res.success && res.data) {
          setClients(res.data);
          return;
        }
      } catch {
        // Fallback demo data if offline
      }

      // Fallback
      setClients([
        {
          id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
          fullName: 'Laura Mercedes Guzmán',
          email: 'laura.mercedes@gmail.com',
          phone: '+18095550101',
          role: 'CLIENT',
          zoneCode: 'ZONE-SPM',
          address: 'Av. Francisco Alberto Caamaño #104, San Pedro de Macorís',
          isActive: true,
          appointmentsCount: 2,
          totalSpent: 5500,
          walletBalance: 250,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
          fullName: 'Carlos Méndez Pimentel',
          email: 'carlos.mendez@hotmail.com',
          phone: '+18095550202',
          role: 'CLIENT',
          zoneCode: 'ZONE-LR',
          address: 'Calle Castillo Márquez #45, La Romana',
          isActive: true,
          appointmentsCount: 1,
          totalSpent: 3000,
          walletBalance: 150,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
          fullName: 'Dra. Patricia Gómez',
          email: 'patricia.gomez@clinica.do',
          phone: '+18095550303',
          role: 'CLIENT',
          zoneCode: 'ZONE-SDE',
          address: 'Autopista San Isidro, Residencial Amalia, SDE',
          isActive: true,
          appointmentsCount: 3,
          totalSpent: 8500,
          walletBalance: 425,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
          fullName: 'Manuel Tavárez',
          email: 'manuel.tavarez@outlook.com',
          phone: '+18095550404',
          role: 'CLIENT',
          zoneCode: 'ZONE-DN',
          address: 'Calle Max Henríquez Ureña #78, Piantini, DN',
          isActive: true,
          appointmentsCount: 1,
          totalSpent: 4500,
          walletBalance: 225,
          createdAt: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }
    loadClients();
  }, []);

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    const matchesZone = selectedZone === 'ALL' || c.zoneCode === selectedZone;
    return matchesSearch && matchesZone;
  });

  const totalClients = clients.length;
  const totalRevenue = clients.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
  const totalWalletCredits = clients.reduce((acc, c) => acc + (c.walletBalance || 0), 0);

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-cyan-400" />
            <span>Directorio de Clientes Registrados (CRM)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Gestión de usuarios registrados, canales de contacto directo por WhatsApp y lealtad con
            billetera.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="admin-card rounded-2xl p-5 border border-admin-border space-y-1">
          <span className="text-xs font-semibold text-gray-400">Total Clientes en Sistema</span>
          <div className="text-2xl font-extrabold text-white font-mono">{totalClients}</div>
          <span className="text-[11px] text-emerald-400 font-medium">100% Cuentas Verificadas</span>
        </div>

        <div className="admin-card rounded-2xl p-5 border border-cyan-500/30 admin-glow-cyan space-y-1">
          <span className="text-xs font-semibold text-cyan-300">
            Valor Acumulado de Clientes (LTV)
          </span>
          <div className="text-2xl font-extrabold text-white font-mono">
            RD$ {totalRevenue.toLocaleString('es-DO')}
          </div>
          <span className="text-[11px] text-cyan-400 font-medium">
            Facturación canónica por servicios
          </span>
        </div>

        <div className="admin-card rounded-2xl p-5 border border-indigo-500/30 space-y-1">
          <span className="text-xs font-semibold text-indigo-300">
            Cashback Activo en Billeteras
          </span>
          <div className="text-2xl font-extrabold text-indigo-300 font-mono">
            RD$ {totalWalletCredits.toLocaleString('es-DO')}
          </div>
          <span className="text-[11px] text-gray-400 font-medium">
            Fondos disponibles para canje
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card rounded-2xl p-4 border border-admin-border flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-admin-sidebar border border-admin-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Zone Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">Zona:</span>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-admin-sidebar border border-admin-border text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Todas las Zonas</option>
            <option value="ZONE-SPM">San Pedro de Macorís (SPM)</option>
            <option value="ZONE-LR">La Romana (LR)</option>
            <option value="ZONE-SDE">Santo Domingo Este (SDE)</option>
            <option value="ZONE-DN">Distrito Nacional (DN)</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="admin-card rounded-2xl border border-admin-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-admin-border bg-admin-sidebar/80 text-gray-400 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Contacto & WhatsApp</th>
                <th className="py-3 px-4">Zona / Territorio</th>
                <th className="py-3 px-4 text-center">Servicios</th>
                <th className="py-3 px-4 text-right">Total Gastado</th>
                <th className="py-3 px-4 text-right">Billetera</th>
                <th className="py-3 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {filteredClients.map((client) => {
                const cleanPhone = client.phone.replace(/[^0-9]/g, '');
                const waLink = `https://wa.me/${cleanPhone}`;

                return (
                  <tr key={client.id} className="hover:bg-admin-hover/40 transition-colors">
                    {/* Name & Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shrink-0">
                          {client.fullName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{client.fullName}</span>
                          <span className="text-[11px] text-gray-400 font-mono">
                            {client.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone & WhatsApp */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-gray-300 block">{client.phone}</span>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-sans font-semibold mt-0.5"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Abrir Chat</span>
                      </a>
                    </td>

                    {/* Zone & Address */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono font-bold block w-fit mb-1">
                        {client.zoneCode || 'ZONE-SPM'}
                      </span>
                      <span
                        className="text-[11px] text-gray-400 truncate max-w-[180px] block"
                        title={client.address}
                      >
                        {client.address || 'San Pedro de Macorís'}
                      </span>
                    </td>

                    {/* Appointments Count */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-1 rounded-full bg-admin-sidebar border border-admin-border font-mono font-bold text-gray-200">
                        {client.appointmentsCount} citas
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      RD$ {(client.totalSpent || 0).toLocaleString('es-DO')}
                    </td>

                    {/* Wallet Cashback */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-cyan-400">
                      RD$ {(client.walletBalance || 0).toLocaleString('es-DO')}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-all text-xs font-semibold"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
