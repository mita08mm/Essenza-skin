'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import PersonIcon from '../icons/PersonIcon';
import AppointmentIcon from '../icons/AppointmentIcon';
import MoneyIcon from '../icons/MoneyIcon';
import PrescriptionIcon from '../icons/PrescriptionIcon';
import InventoryIcon from '../icons/InventoryIcon';
import LogoutIcon from '../icons/LogoutIcon';

const menuItems = [
  { href: '/pacientes', label: 'Pacientes', icon: <PersonIcon className="w-5 h-5" /> },
  { href: '/citas', label: 'Citas', icon: <AppointmentIcon className="w-5 h-5" /> },
  { href: '/cobros', label: 'Cobros', icon: <MoneyIcon className="w-5 h-5" /> },
  { href: '/recetas', label: 'Recetas', icon: <PrescriptionIcon className="w-5 h-5" /> },
  { href: '/inventario', label: 'Inventario', icon: <InventoryIcon className="w-5 h-5" /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { usuario, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const renderNavLinks = () => (
    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={close}
          className={`sidebar-nav-item ${pathname.startsWith(item.href) ? 'active' : ''}`}
        >
          <span>{item.icon}</span>
          <span className="font-heading">{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:w-64 md:flex md:flex-col sidebar">
        <div className="p-6 border-b border-stone-200">
          <h1 className="text-xl font-heading font-bold text-concreto">Sistema Clinico</h1>
          <p className="text-sm text-marengo mt-1">{usuario?.nombre}</p>
        </div>

        {renderNavLinks()}

        <div className="p-4 border-t border-stone-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-2 py-2 text-cocoa-dark hover:opacity-70 transition-all"
          >
            <LogoutIcon className="w-5 h-5" />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 sidebar border-b border-stone-200">
        <h1 className="text-base font-heading font-bold text-concreto">Sistema Clinico</h1>
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="p-2 rounded-md text-marengo hover:opacity-70 transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <div
        onClick={close}
        className={`
          md:hidden fixed inset-0 z-40 bg-black/50
          transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      <aside
        className={`
          md:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col sidebar
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <button
          onClick={close}
          aria-label="Cerrar menú"
          className="absolute top-4 right-4 p-1 rounded-md text-marengo hover:opacity-70 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-stone-200 pr-12">
          <h1 className="text-xl font-heading font-bold text-concreto">Sistema Clinico</h1>
          <p className="text-sm text-marengo mt-1">{usuario?.nombre}</p>
        </div>

        {renderNavLinks()}

        <div className="p-4 border-t border-stone-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-2 py-2 text-cocoa-dark hover:opacity-70 transition-all"
          >
            <LogoutIcon className="w-5 h-5" />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <div className="md:ml-64">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}