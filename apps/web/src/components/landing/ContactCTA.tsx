'use client';

import { ArrowRight } from 'lucide-react';
import type { ConfigClinica } from './types';

interface ContactCTAProps {
  config: ConfigClinica | null;
}

export function ContactCTA({ config }: ContactCTAProps) {
  if (!config) return null;

  return (
    <section
      id="contacto"
      className="relative overflow-hidden px-6 py-20 lg:px-12 lg:py-32"
      style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}
    >
      {/* Gold radial overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, rgba(201, 169, 110, 0.15) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
          style={{
            backgroundColor: 'rgba(201, 169, 110, 0.15)',
            border: '1px solid rgba(201, 169, 110, 0.3)',
          }}
        >
          <span
            className="text-xs font-semibold tracking-wider uppercase"
            style={{ color: '#c9a96e' }}
          >
            Contáctanos
          </span>
        </div>

        <h2
          className="font-heading mb-6 text-5xl font-bold lg:text-6xl xl:text-7xl"
          style={{ color: '#ffffff', letterSpacing: '-0.02em' }}
        >
          ¿List@ para tu tratamiento estético?
        </h2>

        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed" style={{ color: '#b0b0b0' }}>
          Agenda tu evaluación y descubre cómo podemos ayudarte a realzar tu belleza natural con
          tratamientos personalizados.
        </p>

        {/* Contact info grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <a
            href="https://maps.app.goo.gl/2HqrPerLqgoHks9P9"
            target="_blank"
            rel="noopener noreferrer"
            className="block cursor-pointer rounded-xl p-8 transition-all hover:scale-105"
            style={{ backgroundColor: 'rgba(201, 169, 110, 0.15)', border: '2px solid #c9a96e' }}
          >
            <svg
              className="mx-auto mb-4 h-10 w-10"
              style={{ color: '#c9a96e' }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <div
              className="mb-3 text-sm font-bold tracking-wider uppercase"
              style={{ color: '#c9a96e' }}
            >
              Nuestra Ubicación
            </div>
            <div className="text-base leading-tight font-bold" style={{ color: '#ffffff' }}>
              Calle Tumusla N. 561
            </div>
            <div className="text-sm mt-1" style={{ color: '#b0b0b0' }}>
              (entre calles México y José de la Reza)
            </div>
            <div
              className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold"
              style={{ color: '#c9a96e' }}
            >
              {config.ciudad || 'Cochabamba'}, {config.pais || 'Bolivia'}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
          </a>

          <div
            className="rounded-xl p-8 transition-all hover:scale-105"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <svg
              className="mx-auto mb-4 h-10 w-10"
              style={{ color: '#c9a96e' }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <div
              className="mb-3 text-xs font-semibold tracking-wider uppercase"
              style={{ color: '#888' }}
            >
              Teléfonos
            </div>
            <div className="space-y-2">
              <a
                href="tel:+59172226431"
                className="block text-sm font-bold transition-colors hover:opacity-80"
                style={{ color: '#c9a96e' }}
              >
                +591 7222 6431
              </a>
              <a
                href="tel:+591 44555328"
                className="block text-sm font-bold transition-colors hover:opacity-80"
                style={{ color: '#c9a96e' }}
              >
                +591 4 455 5328
              </a>
            </div>
          </div>

          <div
            className="rounded-xl p-8 transition-all hover:scale-105"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <svg
              className="mx-auto mb-4 h-10 w-10"
              style={{ color: '#c9a96e' }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div
              className="mb-3 text-xs font-semibold tracking-wider uppercase"
              style={{ color: '#888' }}
            >
              Email
            </div>
            <a
              href={`mailto:${config.email}`}
              className="text-sm font-bold transition-colors hover:opacity-80"
              style={{ color: '#c9a96e' }}
            >
              {config.email}
            </a>
          </div>
        </div>

        {/* Large CTA button */}
        <a
          href={`tel:${config.telefono}`}
          className="inline-flex items-center gap-3 rounded-lg px-10 py-5 text-lg font-bold transition-all hover:opacity-90"
          style={{ backgroundColor: '#c9a96e', color: '#ffffff' }}
        >
          Reservar Consulta
          <ArrowRight className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}
