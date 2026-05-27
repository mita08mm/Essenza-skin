# Landing Page Components

Esta carpeta contiene todos los componentes modulares de la landing page de "Essenza Skin & Hair Clinic Spa".

## Estructura de Componentes

### Componentes Principales

1. **Navbar** - Navegación sticky con logo y botones de CTA
2. **Hero** - Sección hero con título, CTAs, logo e imagen real
3. **Features** - Características principales con imagen del spa
4. **Services** - Grid de 6 servicios con hover effects
5. **Process** - Proceso en 3 pasos con línea conectora
6. **Testimonials** - 3 testimonios de pacientes
7. **ContactCTA** - Sección de contacto con info y CTA principal
8. **Footer** - Pie de página con redes sociales (Facebook, Instagram, WhatsApp)
9. **WhatsAppButton** - Botón flotante de WhatsApp

### Tipos Compartidos

- **types.ts** - Interface `ConfigClinica` con campos para redes sociales

### Exportaciones

- **index.ts** - Barrel export para importaciones simplificadas

## Uso

```tsx
import {
  Navbar,
  Hero,
  Features,
  // ... otros componentes
  type ConfigClinica,
} from '@/components/landing';
```

## Props

La mayoría de componentes reciben `config: ConfigClinica | null` con la configuración pública de la clínica.

## Imágenes

- **Logo**: `/logo.jpg` (ubicado en public/)
- **Hero**: Imagen de tratamiento facial de Skin Fusion
- **Features**: Imagen de mujer en spa relajándose

## Redes Sociales

El Footer y WhatsAppButton usan URLs de la configuración:
- `config.facebook` - URL de página de Facebook
- `config.instagram` - URL de perfil de Instagram  
- `config.whatsapp` - Número de WhatsApp

## Colores de Marca

- **Dark**: `#1a1a1a` - Fondos oscuros
- **Cream**: `#f5f0e8` - Fondos claros
- **Gold**: `#c9a96e` - Acentos y CTAs
- **White**: `#ffffff` - Texto en fondos oscuros

## Animaciones

Los componentes usan CSS animations definidas en `page.tsx`:
- `fade-in-up` - Fade in + slide up (0.8s)

## Cambios Recientes

- ✅ Eliminada información falsa (contadores de pacientes, años, Google reviews)
- ✅ Removido "Consulta Gratis" (ahora solo "Reservar Consulta")
- ✅ Agregadas imágenes reales externas
- ✅ Agregados enlaces a redes sociales desde configuración
- ✅ Logo cargado desde `/public/logo.jpg`
