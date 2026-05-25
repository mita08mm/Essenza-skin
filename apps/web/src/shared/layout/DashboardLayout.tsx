'use client';

import { useAuth } from '@/features/auth';
import { Menu, X, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import PersonIcon from '../icons/PersonIcon';
import AppointmentIcon from '../icons/AppointmentIcon';
import MoneyIcon from '../icons/MoneyIcon';
import PrescriptionIcon from '../icons/PrescriptionIcon';
import InventoryIcon from '../icons/InventoryIcon';
import LogoutIcon from '../icons/LogoutIcon';
import { BodyStrong, Overline } from '@/shared/ui';

const ICON_CLS = 'w-[18px] h-[18px]';
const menuItems = [
  { href: '/pacientes', label: 'Pacientes', icon: <PersonIcon className={ICON_CLS} /> },
  { href: '/citas', label: 'Citas', icon: <AppointmentIcon className={ICON_CLS} /> },
  { href: '/cobros', label: 'Cobros', icon: <MoneyIcon className={ICON_CLS} /> },
  { href: '/recetas', label: 'Prescripciones', icon: <PrescriptionIcon className={ICON_CLS} /> },
  { href: '/inventario', label: 'Inventario', icon: <InventoryIcon className={ICON_CLS} /> },
  { href: '/reportes', label: 'Reportes', icon: <BarChart3 className={ICON_CLS} /> },
  { href: '/configuracion', label: 'Configuración', icon: <Settings className={ICON_CLS} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { usuario, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const initials =
    `${usuario?.nombre?.[0] ?? ''}${usuario?.nombre?.split(' ')[1]?.[0] ?? ''}`.toUpperCase() ||
    'U';

  const renderBrand = () => (
    <div className="px-5 pt-6 pb-5">
      <div className="flex items-center gap-2.5">
        <div className="bg-brand-morena font-heading flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-white">
          C
        </div>
        <div className="min-w-0">
          <BodyStrong as="p" className="font-heading leading-tight">
            Clínica
          </BodyStrong>
          <Overline className="mt-0.5">Sistema médico</Overline>
        </div>
      </div>
    </div>
  );

  const renderNav = () => (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
      <Overline className="mt-1 mb-2 px-3">Menú</Overline>
      {menuItems.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={close}
            className={`sidebar-nav-item ${active ? 'active' : ''}`}
          >
            <span className={active ? 'text-brand-morena' : 'text-neutral-500'}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const renderUser = () => (
    <div className="border-t border-neutral-200 px-4 py-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="text-brand-morena flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(204,175,125,0.22)] text-xs font-semibold">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-neutral-800">{usuario?.nombre}</p>
          <Overline>{usuario?.rol ?? 'Usuario'}</Overline>
        </div>
      </div>
      <button
        onClick={logout}
        className="hover:text-danger inline-flex h-8 w-full items-center justify-center gap-2 rounded-md px-3 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
      >
        <LogoutIcon className="h-4 w-4" />
        Cerrar sesión
      </button>
    </div>
  );

  return (
    <div className="bg-neutral-25 min-h-screen">
      {/* Sidebar desktop */}
      <aside className="hidden border-r border-neutral-200 bg-white md:fixed md:inset-y-0 md:left-0 md:flex md:w-60 md:flex-col">
        {renderBrand()}
        {renderNav()}
        {renderUser()}
      </aside>

      {/* Header mobile */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="bg-brand-morena font-heading flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium text-white">
            C
          </div>
          <BodyStrong as="h1" className="font-heading">
            Clínica
          </BodyStrong>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="rounded-md p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Overlay mobile */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-[rgba(31,31,31,0.4)] transition-opacity duration-200 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Sidebar mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-200 bg-white transition-transform duration-200 ease-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={close}
          aria-label="Cerrar menú"
          className="absolute top-4 right-4 rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100"
        >
          <X className="h-4 w-4" />
        </button>
        {renderBrand()}
        {renderNav()}
        {renderUser()}
      </aside>

      <div className="md:ml-60">
        <main className="max-w-[1400px] p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
