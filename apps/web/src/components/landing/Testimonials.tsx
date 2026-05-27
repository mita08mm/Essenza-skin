'use client';

import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: 'María González',
      treatment: 'Rejuvenecimiento Facial',
      text: 'Los resultados superaron mis expectativas. El equipo es profesional y me sentí cuidada en todo momento.',
      rating: 5,
    },
    {
      name: 'Ana Martínez',
      treatment: 'Tratamiento Corporal',
      text: 'Excelente atención y tecnología de primera. Veo cambios reales después de solo 3 sesiones.',
      rating: 5,
    },
    {
      name: 'Laura Rodríguez',
      treatment: 'Cuidado de Piel',
      text: 'Mi piel nunca se había visto mejor. Un ambiente de lujo y resultados increíbles.',
      rating: 5,
    },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-20 lg:px-12 lg:py-32" style={{ backgroundColor: '#f5f0e8' }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2" style={{ backgroundColor: 'rgba(201, 169, 110, 0.15)', border: '1px solid rgba(201, 169, 110, 0.3)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#c9a96e' }}>
              Testimonios
            </span>
          </div>
          <h2 className="font-heading text-5xl font-bold lg:text-6xl" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
            Lo que dicen nuestros pacientes
          </h2>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="rounded-xl p-8"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(201, 169, 110, 0.2)',
              }}
            >
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="h-5 w-5" fill="#c9a96e" style={{ color: '#c9a96e' }} />
                ))}
              </div>
              
              <Quote className="mb-4 h-8 w-8" style={{ color: '#c9a96e', opacity: 0.4 }} />
              
              <p className="mb-6 leading-relaxed" style={{ color: '#4a4a4a' }}>
                &ldquo;{testimonial.text}&rdquo;
              </p>
              
              <div className="flex items-center gap-3">
                <div
                  className="h-12 w-12 flex-shrink-0 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #8b7355 100%)' }}
                />
                <div>
                  <div className="font-semibold" style={{ color: '#1a1a1a' }}>
                    {testimonial.name}
                  </div>
                  <div className="text-sm" style={{ color: '#888' }}>
                    {testimonial.treatment}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
