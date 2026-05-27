# Sistema de Gestión de Clínica

Sistema completo para gestión de clínicas médicas.

## Inicio Rápido

```bash
# 1. Instalar
pnpm install

# 2. Base de datos
docker compose up postgres -d
pnpm db:migrate
pnpm db:seed

# 3. Iniciar
pnpm dev
```

**Accesos:**
- Frontend: http://localhost:3000
- API: http://localhost:4000

**Usuarios:**
- Admin: `admin@clinica.com` / `admin123`
- Médico: `medico@clinica.com` / `medico123`
- Recepcionista: `recepcion@clinica.com` / `recep123`

---

## Estructura

```
apps/
├── web/          Next.js (Frontend)
└── api/          Express (Backend)

packages/
├── database/     Prisma + PostgreSQL
├── shared/       Tipos TypeScript
└── validators/   Validaciones
```

---

## Comandos

### Desarrollo
```bash
pnpm dev          # Frontend + Backend
pnpm dev:web      # Solo frontend
pnpm dev:api      # Solo backend
```

### Base de Datos
```bash
pnpm db:migrate          # Crear y aplicar migración
pnpm db:migrate:status   # Ver estado de migraciones
pnpm db:migrate:deploy   # Aplicar en producción
pnpm db:validate         # Validar schema
pnpm db:seed             # Datos de prueba
pnpm db:studio           # GUI de BD
```

**📚 Guía completa:** Ver [`packages/database/MIGRATIONS.md`](packages/database/MIGRATIONS.md)

### Docker
```bash
docker compose up postgres -d    # Iniciar
docker compose down              # Detener
docker compose logs -f           # Ver logs
```

---

## ¿Dónde Trabajar?

| Tarea | Carpeta |
|-------|---------|
| Páginas | `apps/web/src/app/` |
| Componentes | `apps/web/src/components/` |
| API Routes | `apps/api/src/presentation/routes/` |
| Lógica | `apps/api/src/application/` |
| Tablas BD | `packages/database/prisma/schema.prisma` |

---

## Stack

- Next.js 16 + React 19 + Tailwind
- Express + TypeScript
- PostgreSQL 16 + Prisma
- pnpm workspaces

---

## Landing Page

**Ubicación:** `apps/web/src/components/landing/`

**Componentes:**
- Navbar, Hero, Features, Services, Process, Testimonials, ContactCTA, Footer, WhatsAppButton

**Configuración Estática:**
- Facebook: `https://facebook.com/essenzaskinclinic`
- Instagram: `https://instagram.com/essenzaskinclinic`
- WhatsApp: `+591 72226431`

**Información de la Clínica:**
- Nombre: Essenza Skin & Hair Clinic Spa
- Ubicación: Cochabamba
- Especialidad: Medicina estética facial, corporal y capilar
- Filosofía: "La fusión perfecta entre medicina estética y arte"

**Características:**
- ✅ Modularizada (107 líneas en page.tsx)
- ✅ Imágenes como fondos CSS (no components)
- ✅ Información real verificada de redes sociales
- ✅ Redes sociales y contacto estáticos en código
