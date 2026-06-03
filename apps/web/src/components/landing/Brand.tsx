'use client';

import { LogoIcon } from '@/shared/ui';
import type { ConfigClinica } from './types';

interface BrandProps {
  config: ConfigClinica | null;
}

export function Brand({ config }: BrandProps) {
  return (
    <section style={{ backgroundColor: '#f5f0e8', borderTop: '1px solid #e8e0d5', borderBottom: '1px solid #e8e0d5' }}>
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-16 lg:py-32">
        <div className="flex flex-col items-center text-center">
          {/* Logo Grande - El mix-blend-mode multiply elimina el fondo blanco */}
          <div className="mb-8" style={{ mixBlendMode: 'multiply' }}>
            <LogoIcon 
              className="h-48 w-48 lg:h-100 lg:w-100" 
              style={{ color: '#c9a96e' }}
            />
          </div>
          
          {/* Contenido de texto */}
          <div className="max-w-3xl">
            <h2 className="font-heading mb-4 text-4xl font-bold lg:text-5xl" style={{ color: '#2d2d2d', letterSpacing: '-0.02em' }}>
              {config?.nombre || 'Essenza Skin & Hair Clinic Spa'}
            </h2>
            
            <p className="mb-3 text-lg font-medium" style={{ color: '#c9a96e' }}>
              DRA. CECILE ARCE DERPIC
            </p>
            
            <p className="mb-8 text-lg leading-relaxed" style={{ color: '#666' }}>
              Fusionamos medicina estética de vanguardia con un enfoque artístico personalizado. 
              Cada tratamiento está diseñado para realzar tu belleza natural, respetando la armonía 
              de tus rasgos y potenciando tu confianza.
            </p>
            

          </div>
        </div>
      </div>
    </section>
  );
}
