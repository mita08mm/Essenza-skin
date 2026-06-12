'use client';

import { ArrowRight } from 'lucide-react';
import { LogoSymbol, VectorSymbol } from '@/shared/icons';
import type { ConfigClinica } from './types';

interface HeroProps {
  config: ConfigClinica | null;
}

export function Hero({ config }: HeroProps) {
  return (
    <section className="relative" style={{ minHeight: '100vh' }}>
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'url(https://res.cloudinary.com/do4zmsrtv/image/upload/v1779851547/woman-relaxing-spa_329181-13154_lurrzl.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '100%',
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />

      {/* Watermark Symbol - Right Side */}
      <div
        className="pointer-events-none absolute top-1/4 right-32 w-64 -translate-y-1/2 md:w-72 lg:right-12 lg:w-80 xl:w-96 2xl:w-[32rem]"
        style={{
          right: '100px',
          color: '#ffffff',
        }}
      >
        <LogoSymbol />
      </div>

      {/* Floating Navigation */}
      <nav className="absolute top-0 right-0 left-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4 lg:px-16">
          {/* Logo Symbol */}
          <div
            className="flex-shrink-0"
            style={{ width: '80px', height: '80px', color: '#c9a96e' }}
          >
            <LogoSymbol />
          </div>

          {/* Brand Text */}
          <div>
            <div
              className="font-heading text-xl font-bold lg:text-2xl"
              style={{ color: '#ffffff' }}
            >
              {config?.nombre || 'Essenza Skin & Hair Clinic Spa'}
            </div>
            <div className="text-xs font-medium" style={{ color: '#c9a96e' }}>
              DRA. CECILE ARCE DERPIC
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div
        className="relative z-10 flex flex-col justify-center px-6 lg:px-16"
        style={{ minHeight: '100vh', paddingTop: '6rem' }}
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-2xl">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                backgroundColor: 'rgba(201, 169, 110, 0.25)',
                border: '1px solid rgba(201, 169, 110, 0.5)',
              }}
            >
              <div
                className="h-2 w-2 animate-pulse rounded-full"
                style={{ backgroundColor: '#c9a96e' }}
              />
              <span
                className="text-xs font-semibold tracking-wider uppercase"
                style={{ color: '#ffffff' }}
              >
                Medicina Estética
              </span>
            </div>

            <h1
              className="font-heading mb-6 text-5xl leading-tight font-bold lg:text-6xl xl:text-7xl"
              style={{ color: '#ffffff', letterSpacing: '-0.02em' }}
            >
              Realza tu belleza natural
            </h1>

            <p className="mb-8 text-lg leading-relaxed lg:text-xl" style={{ color: '#e0e0e0' }}>
              La clínica Essenza fusiona medicina estética y arte. Un lugar donde cada detalle
              está diseñado para realzar tu belleza con elegancia, equilibrio y naturalidad.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/59172226431"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: '#c9a96e', color: '#ffffff' }}
              >
                Reservar Consulta
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#servicios"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#c9a96e';
                  e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Ver Servicios
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
