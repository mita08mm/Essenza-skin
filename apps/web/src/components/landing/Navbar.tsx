'use client';

import type { ConfigClinica } from './types';

interface NavbarProps {
  config: ConfigClinica | null;
}

export function Navbar({ config }: NavbarProps) {
  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(245, 240, 232, 0.95)',
        borderBottom: '1px solid rgba(201, 169, 110, 0.2)',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        <div>
          <div className="font-heading text-xl font-bold" style={{ color: '#1a1a1a' }}>
            {config?.nombre || 'Essenza Skin & Hair Clinic Spa'}
          </div>
          <div className="text-xs font-medium" style={{ color: '#c9a96e' }}>
            DRA. CECILE ARCE DERPIC
          </div>
        </div>
        {config && (
          <div className="flex items-center gap-3">
            <a
              href="#servicios"
              className="hidden rounded-md px-4 py-2 text-sm font-medium transition-all md:block"
              style={{ color: '#1a1a1a', border: '1px solid transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#c9a96e';
                e.currentTarget.style.color = '#c9a96e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = '#1a1a1a';
              }}
            >
              Servicios
            </a>
            <a
              href={`tel:${config.telefono}`}
              className="rounded-md px-5 py-2 text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#c9a96e', color: '#ffffff' }}
            >
              Agendar cita
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
