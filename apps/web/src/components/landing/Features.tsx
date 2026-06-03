'use client';

import { Sparkles, Heart } from 'lucide-react';
import { useState } from 'react';

export function Features() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: Sparkles,
      title: 'Arte y Medicina Estética',
      description: 'Fusión perfecta entre medicina estética y arte, diseñado para realzar tu belleza con elegancia y naturalidad.',
    },
    {
      icon: Heart,
      title: 'Nuestra Ubicación',
      description: 'Calle Tumusla 561, entre calles México y Reza, Cochabamba. Un espacio exclusivo diseñado para tu bienestar.',
    },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-20 lg:px-12 lg:py-32">
      <div 
        className="absolute inset-0" 
        style={{ background: 'radial-gradient(ellipse at center, rgba(42, 42, 42, 0.85) 0%, rgba(26, 26, 26, 0.92) 100%)' }}
      />
      
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2" style={{ backgroundColor: 'rgba(201, 169, 110, 0.15)', border: '1px solid rgba(201, 169, 110, 0.3)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#c9a96e' }}>
              ¿Por qué elegirnos?
            </span>
          </div>
          <h2 className="font-heading text-5xl font-bold lg:text-6xl" style={{ color: '#ffffff', letterSpacing: '-0.02em' }}>
            Excelencia en cada detalle
          </h2>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Feature cards */}
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="rounded-2xl p-8 transition-all duration-300"
                style={{
                  background: hoveredCard === i 
                    ? 'linear-gradient(135deg, rgba(201, 169, 110, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  transform: hoveredCard === i ? 'translateY(-4px)' : 'none',
                }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(201, 169, 110, 0.2)' }}>
                  <Icon className="h-7 w-7" style={{ color: '#c9a96e' }} strokeWidth={2} />
                </div>
                <h3 className="mb-3 text-2xl font-bold" style={{ color: '#ffffff' }}>
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: '#b0b0b0' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
