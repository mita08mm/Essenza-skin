'use client';

import { useEffect, useState } from 'react';
import {
  Hero,
  Brand,
  Features,
  Services,
  Products,
  Process,
  ContactCTA,
  Footer,
  WhatsAppButton,
  type ConfigClinica,
} from '@/components/landing';

export default function LandingPage() {
  const [config, setConfig] = useState<ConfigClinica | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicConfig = async () => {
      try {
        // Agregar timestamp para evitar cache del navegador
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/configuracion/public?_t=${Date.now()}`,
          { cache: 'no-store' }
        );
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
        }
      } catch (error) {
        console.error('Error cargando configuración pública:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicConfig();
  }, []);

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: '#f5f0e8' }}
      >
        <div className="text-lg font-medium" style={{ color: '#1a1a1a' }}>
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <Hero config={config} />
      <Brand config={config} />
      <Features />
      <Services />
      <Products />
      <Process />
      <ContactCTA config={config} />
      <Footer config={config} />

      <WhatsAppButton telefono="+59172226431" />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
