'use client';

import { Sparkles, ShoppingBag, Scissors, Droplet } from 'lucide-react';
import { useState } from 'react';

export function Products() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const productLines = [
    {
      icon: Scissors,
      title: 'Essenza Hair Therapy',
      description: 'Línea profesional para el cuidado capilar',
      products: [
        'Shampoos',
        'Serums',
        'Essenza Hair Fibers',
      ],
      color: '#c9a96e',
    },
    {
      icon: Droplet,
      title: 'Essenza Skin Therapy',
      description: 'Tratamiento dermatológico de alta gama',
      products: [
        'Cremas',
        'Serums',
        'Bloqueador Solar',
      ],
      color: '#c9a96e',
    },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-20 lg:px-12 lg:py-32" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2" style={{ backgroundColor: 'rgba(201, 169, 110, 0.15)', border: '1px solid rgba(201, 169, 110, 0.3)' }}>
            <ShoppingBag className="h-4 w-4" style={{ color: '#c9a96e' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#c9a96e' }}>
              Productos Exclusivos
            </span>
          </div>
          <h2 className="font-heading text-5xl font-bold lg:text-6xl" style={{ color: '#ffffff', letterSpacing: '-0.02em' }}>
            Líneas de productos profesionales
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: '#b0b0b0' }}>
            Llevá la experiencia Essenza a casa con nuestras líneas exclusivas de cuidado capilar y facial
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          {productLines.map((line, i) => {
            const Icon = line.icon;
            return (
              <div
                key={i}
                className="rounded-2xl p-8 transition-all duration-300"
                style={{
                  background: hoveredProduct === i 
                    ? 'linear-gradient(135deg, rgba(201, 169, 110, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  transform: hoveredProduct === i ? 'translateY(-4px)' : 'none',
                  border: hoveredProduct === i ? '2px solid #c9a96e' : '2px solid transparent',
                }}
                onMouseEnter={() => setHoveredProduct(i)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(201, 169, 110, 0.2)' }}>
                    <Icon className="h-8 w-8" style={{ color: line.color }} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                      {line.title}
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: '#b0b0b0' }}>
                      {line.description}
                    </p>
                  </div>
                </div>
              
              <div className="space-y-3">
                {line.products.map((product, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 flex-shrink-0" style={{ color: line.color }} />
                    <span className="text-sm" style={{ color: '#d0d0d0' }}>{product}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <a
                  href="https://wa.me/59172226431?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20los%20productos%20Essenza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:underline"
                  style={{ color: '#c9a96e' }}
                >
                  Consultar disponibilidad
                  <ShoppingBag className="h-4 w-4" />
                </a>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
