'use client';

import { Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function Services() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const services = [
    {
      title: 'Toxina Botulínica (Botox)',
      items: [
        'Tercio Superior / Medio / Inferior',
        'Full Face',
        'Bruxismo',
        'Collar de Venus',
        'Lifting Nefertiti',
      ],
    },
    {
      title: 'Ácido Hialurónico',
      items: [
        'Ojeras',
        'Nariz',
        'Labios',
        'Lifting Facial (Temporal y Malar)',
        'Mentón',
        'Definición de Ángulo Mandibular',
      ],
    },
    {
      title: 'Bioestimuladores & Faciales',
      items: [
        'Bioestimuladores',
        'Cicatrices del Acné',
        'Limpieza Facial',
        'Peeling',
        'Plasma Glow (PRP Facial)',
      ],
    },
    {
      title: 'Tratamientos Capilares',
      items: [
        'Tricogen Intensive (Mesoterapia Nutritiva)',
        'PRP Hair Boost (Plasma Rico en Plaquetas con Factores de Crecimiento)',
      ],
    },
  ];

  return (
    <section
      id="servicios"
      className="relative overflow-hidden px-6 py-20 lg:px-12 lg:py-32"
      style={{ backgroundColor: '#e8e0d5' }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
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
              Nuestros Servicios
            </span>
          </div>
          <h2
            className="font-heading text-5xl font-bold lg:text-6xl"
            style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}
          >
            Tratamientos de Medicina Estética
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <div
              key={i}
              className="rounded-xl p-6 transition-all duration-300"
              style={{
                backgroundColor: '#2a2a2a',
                transform: hoveredService === i ? 'translateY(-8px)' : 'none',
                border: hoveredService === i ? '2px solid #c9a96e' : '2px solid transparent',
                boxShadow: hoveredService === i ? '0 0 30px rgba(201, 169, 110, 0.3)' : 'none',
              }}
              onMouseEnter={() => setHoveredService(i)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <h3 className="mb-5 text-xl font-bold" style={{ color: '#ffffff' }}>
                {service.title}
              </h3>
              <ul className="mb-6 space-y-3">
                {service.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 h-4 w-4 flex-shrink-0"
                      style={{ color: '#c9a96e' }}
                      strokeWidth={2.5}
                    />
                    <span className="text-sm" style={{ color: '#d0d0d0' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                style={{ color: '#c9a96e' }}
              >
                Reservar
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
