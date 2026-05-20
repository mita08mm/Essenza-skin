# Documentacion Tecnica

## Objetivo del Proyecto

Plataforma web para clinica medica con:
1. Sitio publico informativo
2. Panel privado de gestion clinica

## Stack Tecnologico

- Monorepo: pnpm workspaces
- Frontend: Next.js + TypeScript + Tailwind CSS + shadcn/ui
- Backend: Express + TypeScript
- Base de datos: PostgreSQL + Prisma
- Validacion: Zod
- Auth: JWT
- Contenedores: Docker Compose
- Linter: ESLint + Prettier

## Arquitectura

Clean Architecture + Hexagonal + SOLID

Capas:
- **domain**: Entidades y reglas de negocio (no depende de frameworks)
- **application**: Casos de uso (LoginUseCase, CreatePatientUseCase...)
- **infrastructure**: Prisma, bcrypt, JWT, almacenamiento
- **presentation**: Express routes y controllers

Flujo: Route -> Controller -> UseCase -> Repository -> Database

Principios:
- Bajo acoplamiento
- Alta cohesion
- Logica de negocio independiente de Next.js, Express y PostgreSQL
- Capas desacopladas

## Base de Datos

14 tablas principales:
- usuarios, pacientes, medicos, recepcionistas
- citas, historias_clinicas, consultas
- inventario, movimientos_inventario
- auditorias, notificaciones

Ver schema completo en `packages/database/prisma/schema.prisma`

## Funcionalidades

### Area Publica
- Inicio
- Sobre la doctora
- Servicios
- Horarios y ubicacion
- Contacto
- Boton agendar cita

### Area Privada
- Login
- Dashboard
- Listado de pacientes
- Ficha clinica del paciente
- Historial clinico
- Evolucion medica
- Fotos del paciente
- Turnera/calendario
- Servicios, insumos y medicamentos
- Cobros y saldo pendiente
- Reportes basicos
- Configuracion

## Modulos Especificos

### Ficha del Paciente
- Foto principal
- Datos basicos
- Informacion general
- Notas clinicas
- Diagnostico
- Tratamiento
- Linea de tiempo
- Galeria antes/despues
- Adjuntos
- Botones: nueva evolucion, edicion

### Modulo de Cobros
- Registrar servicio
- Registrar medicamento/insumo
- Calculo automatico del total
- Pagos parciales
- Saldo pendiente
- Historial de pagos
- Estados: pagado, parcial, pendiente

### Modulo de Receta
- Agregar medicamentos/insumos
- Estado por item:
  - entregado (descuenta inventario)
  - solo prescrito (no descuenta stock)
- Historial clinico
- Receta imprimible

## Autenticacion

Sistema JWT con roles:
- ADMIN: acceso total
- DOCTOR: ver/editar pacientes y citas
- RECEPCIONISTA: gestionar citas

Endpoints:
- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/me

## Frontend

### Atomic Design

Estructura de componentes:
```
src/components/
  ui/           # Atoms - shadcn/ui (Button, Input, Card...)
  molecules/    # Moleculas (PacienteCard, FormField...)
  organisms/    # Organismos (Navbar, Sidebar, PacienteForm...)
  templates/    # Templates (DashboardLayout, AuthLayout...)
  pages/        # Pages (Next.js App Router)
```

### Reglas de Diseno
- Moderno, minimalista, elegante
- Interfaz calida, profesional, femenina, premium
- Claridad visual
- Jerarquia tipografica
- Espacios amplios
- Responsive (celular y escritorio)
- Evitar estilos antiguos o recargados

### Rutas Next.js App Router
- `/` - Inicio publico
- `/sobre-nosotros` - Sobre la doctora
- `/servicios` - Servicios ofrecidos
- `/contacto` - Contacto y ubicacion
- `/dashboard` - Panel principal
- `/patients` - Gestion de pacientes
- `/appointments` - Citas

Colores y tipografia en `apps/web/tailwind.config.ts`

## Despliegue

Produccion:
```bash
docker compose up -d
pnpm build
pnpm start
```

Variables de entorno necesarias:
- DATABASE_URL
- JWT_SECRET
- PORT

## Requisitos de Calidad

- Mantenibilidad
- Escalabilidad
- Testabilidad
- Seguridad
- Usabilidad
- Portabilidad
- Confiabilidad
- Bajo acoplamiento
- Alta cohesion
- Reutilizacion
- Trazabilidad de cambios

Base profesional lista para crecer a nube sin rehacer el proyecto.

## Estandares de Desarrollo

### Diseno Visual

Paleta: Ver `apps/web/tailwind.config.ts`
Tipografia: Playfair Display (titulos), Poppins (texto)
Proporcion: 60% blanco/gris, 30% text-concreto, 10% morena+piel

### Tipografia

```tsx
font-heading  // Playfair Display - Titulos (h1, h2, h3)
font-body     // Poppins - Texto general
```

### Patron de Botones

```tsx
// Primario
<button className="px-6 py-3 bg-morena text-white rounded-lg 
                   hover:bg-morena/90 transition-all">
  Guardar
</button>

// Secundario
<button className="px-6 py-3 border-2 border-piel text-morena 
                   rounded-lg hover:bg-piel/10">
  Cancelar
</button>
```

### Patron de Forms

```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-concreto">
    Nombre
  </label>
  <input 
    className="w-full px-4 py-2 rounded-lg border border-marengo/30 
               focus:border-morena focus:ring-2 focus:ring-piel/20"
  />
</div>
```

### API Response Pattern

```tsx
// Backend
return NextResponse.json<ApiResponse<Paciente[]>>({
  success: true,
  data: pacientes
});

// Frontend
const response = await fetch('/api/pacientes');
const data: ApiResponse<Paciente[]> = await response.json();
if (!data.success) throw new Error(data.error);
```

### Organizacion de Imports

```tsx
// 1. React/Next
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Componentes externos
import { Button } from '@/components/ui/button';

// 3. Componentes internos
import PacienteCard from '@/components/pacientes/PacienteCard';

// 4. Hooks
import { usePacientes } from '@/hooks/usePacientes';

// 5. Utils y constantes
import { cn } from '@/lib/utils';
import { ESTADOS_CITA } from '@/lib/constants';

// 6. Tipos
import type { Paciente } from '@/types';
```

### Convenciones de Nombrado

- Componentes: PascalCase - `PacienteCard.tsx`
- Hooks: camelCase - `usePacientes.ts`
- Utils: camelCase - `formatoFecha.ts`
- Types: PascalCase - `Paciente.ts`

### Estructura de Componentes

```
src/components/
  ui/           # shadcn/ui - No editar
  layout/       # Navbar, Sidebar, Footer
  dashboard/    # Componentes dashboard
  pacientes/    # Todo de pacientes
  citas/        # Agenda/citas
  auth/         # Login, registro
```

### Git Commits

Formato: `tipo: descripcion breve`

Tipos: feat, fix, docs, style, refactor, test, chore

Ejemplos:
```
feat: agregar modulo de cobros
fix: corregir calculo de saldo
refactor: simplificar componente PacienteCard
```
