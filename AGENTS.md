# AGENTS.md

Sistema de gestión para **Essenza Skin & Hair Clinic** (clínica de medicina estética). Monorepo pnpm con landing pública + panel privado.

> Idioma del producto y de los commits: **español**. Comentarios y nombres de dominio en español; nombres técnicos (classes, hooks) en inglés/PascalCase.

## Documentos clave (consultar antes de escribir código)

- [README.md](README.md) — comandos de arranque, accesos.
- [DOCS.md](DOCS.md) — visión técnica, módulos de negocio, patrones API/forms/imports, convenciones de commit.
- [apps/web/UI_UX_RULES.md](apps/web/UI_UX_RULES.md) — reglas obligatorias de UI/UX antes de crear nuevos estilos.
- [packages/database/prisma/schema.prisma](packages/database/prisma/schema.prisma) — fuente de verdad del modelo de datos.

⚠️ `DOCS.md` describe la *intención* original (Atomic Design, Poppins, `src/components/pacientes/...`). La **estructura real vigente** está descrita abajo y prevalece sobre `DOCS.md` cuando difieran.

## Stack real

- **Monorepo**: pnpm workspaces (`apps/*`, `packages/*`). Node ≥20.
- **Web**: Next.js 16 + React 19 + Turbopack + Tailwind v4 + shadcn/ui + React Query + react-hook-form + Zod. Deploy a Cloudflare vía `@opennextjs/cloudflare`.
- **API**: Express 4 + TypeScript + JWT + Helmet + rate-limit + Multer + Cloudinary + node-cache.
- **DB**: PostgreSQL 16 + Prisma 6.
- **Fuentes reales**: Playfair Display (heading) + DM Sans (body) — definidas en [apps/web/src/app/layout.tsx](apps/web/src/app/layout.tsx).

## Comandos

```bash
pnpm dev              # web + api en paralelo
pnpm dev:web          # solo Next.js (puerto 3000)
pnpm dev:api          # solo Express (puerto 4000)
pnpm build            # build de todo el workspace
pnpm lint             # eslint en todos los paquetes
pnpm --filter @clinica/web typecheck   # tsc --noEmit en web
pnpm --filter @clinica/api lint        # eslint api

# Base de datos (preferir scripts desde la raíz)
docker compose up postgres -d
pnpm db:migrate                 # crea + aplica migración (dev)
pnpm db:migrate:status
pnpm db:seed
pnpm db:studio

# O desde packages/database/ con npx:
npx prisma migrate dev
npx prisma migrate status
npx prisma studio
```

No existe suite de tests configurada — no inventar `pnpm test`.

## Arquitectura backend (`apps/api/src/`)

Clean Architecture estricta. Flujo: **Route → Controller → UseCase → Repository → Prisma**.

```
application/use-cases/<dominio>/<Accion><Dominio>UseCase.ts   # un caso de uso = una clase
infrastructure/repositories/<Dominio>Repository.ts             # única capa que toca Prisma
infrastructure/services/                                       # auth, cache, cloudinary
presentation/controllers/<Dominio>Controller.ts                # convierte req↔dto, llama use-cases
presentation/routes/<dominio>.routes.ts                        # cablea repo+use-cases+controller
presentation/middlewares/auth.middleware.ts                    # JWT, roles
```

Reglas:
- Los **use-cases no importan Express ni Prisma directamente**; reciben repos por constructor.
- Los repos exponen métodos del dominio (no `prisma.xxx` genérico) y son la única capa que importa `@clinica/database`.
- Toda ruta privada se monta detrás de `router.use(authMiddleware)` — ver [apps/api/src/presentation/routes/paciente.routes.ts](apps/api/src/presentation/routes/paciente.routes.ts) como plantilla.
- Validación de input con Zod desde `@clinica/validators`.
- Respuestas siempre con la forma `{ success, data, error? }` (tipo `ApiResponse<T>`).

## Arquitectura frontend (`apps/web/src/`)

Organización **por feature de negocio**, no atomic design:

```
app/                          # Next App Router
  page.tsx                    # Landing pública
  sys-e7k9m2px/               # Login (ruta ofuscada a propósito — NO renombrar)
  (dashboard)/                # Grupo privado: pacientes, citas, cobros, prescripciones, productos, configuracion
features/<dominio>/
  index.ts                    # API pública del feature (re-exports)
  components/                 # Vistas y forms del dominio
  hooks/                      # use<Dominio>.ts con React Query
  lib/                        # utilidades de dominio
shared/
  api/client.ts               # cliente HTTP centralizado (api.get/post/...) con JWT y ApiError
  api/QueryProvider.tsx       # QueryClientProvider raíz
  ui/                         # shadcn/ui — NO editar manualmente
  forms/, hooks/, layout/, icons/, constants/, types/, utils/
  config.ts                   # lee NEXT_PUBLIC_API_URL / NEXT_PUBLIC_APP_URL
components/landing/           # Solo componentes de la landing pública
proxy.ts                      # middleware Next: redirige a /sys-e7k9m2px si no hay cookie de auth
```

Reglas:
- Todo fetch al backend pasa por `api` de [apps/web/src/shared/api/client.ts](apps/web/src/shared/api/client.ts). No usar `fetch` crudo ni axios.
- Estado de servidor → React Query (`useQuery`/`useMutation`); estado local → `useState`. No introducir Redux/Zustand sin pedirlo.
- Forms → `react-hook-form` + `@hookform/resolvers` + Zod (esquemas en `@clinica/validators`).
- Imports cross-feature: usar el `index.ts` del feature (`@/features/pacientes`), nunca rutas profundas.
- Antes de crear un botón/input nuevo, revisar `shared/ui/` (shadcn). Antes de crear estilos, leer [apps/web/UI_UX_RULES.md](apps/web/UI_UX_RULES.md).
- Auth en cliente: cookie + helpers de `@/features/auth` (`AUTH_COOKIE_NAME`, `getClientToken`).

## Paquetes compartidos

- `@clinica/database` — exporta `PrismaClient` y tipos generados. `postinstall` corre `prisma generate`.
- `@clinica/shared` — tipos TS compartidos (`ApiResponse`, dominios).
- `@clinica/validators` — esquemas Zod reutilizados por web y api.

Cambios en estos paquetes requieren `pnpm build` en el paquete o que la app los consuma vía workspace TS paths (ver `tsconfig.base.json`).

## Variables de entorno

Referencias: [apps/api/.env.example](apps/api/.env.example), [apps/web/.env.example](apps/web/.env.example)

**Backend** (`apps/api/.env`):
- `DATABASE_URL` — conexión Postgres (la genera Docker Compose)
- `JWT_SECRET` — firma de tokens (cambiar en producción)
- `JWT_EXPIRES_IN` — duración del token (ej: `7d`)
- `CORS_ORIGIN` — `http://localhost:3000` en dev, URL del frontend en producción
- `PORT` — puerto del API (4000 en dev)
- `UPLOADS_DIR` — carpeta de archivos locales (si no usas Cloudinary)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — opcional, para uploads

**Frontend** (configurar en Cloudflare Pages):
- `NEXT_PUBLIC_API_URL` — URL del backend (`http://localhost:4000` en dev, URL de producción en deploy)
- `NEXT_PUBLIC_APP_URL` — URL del frontend (usualmente `http://localhost:3000` en dev)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — opcional, para uploads desde cliente
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` — opcional, preset de Cloudinary

⚠️ Variables con prefijo `NEXT_PUBLIC_` se embeben en el bundle del cliente — nunca poner secretos ahí.

## Módulos de negocio

Dominios implementados (ver [packages/database/prisma/schema.prisma](packages/database/prisma/schema.prisma)):
- **Pacientes** — CRUD, ficha clínica, historial, documentos (fotos antes/después).
- **Historia Clínica** — diagnóstico, alergias, antecedentes (1:1 con paciente).
- **Consultas** — evoluciones médicas por paciente (tipo tratamiento: facial/corporal/capilar).
- **Citas** — agenda de turnos (estados: pendiente, confirmada, cancelada, completada).
- **Prescripciones** — recetas con items (medicamento/insumo) y estado de entrega.
- **Cobros** — facturación de servicios/productos, pagos parciales, saldo pendiente.
- **Productos** — inventario de medicamentos/insumos (stock, movimientos).
- **Documentos** — imágenes subidas a Cloudinary (antes/después, consentimientos).
- **Usuarios** — auth con roles (ADMIN, MEDICO, RECEPCIONISTA).
- **Configuración** — ajustes globales de la clínica.

## Uploads y archivos

- **Backend**: Multer recibe archivos → sube a Cloudinary → guarda `url` + `publicId` en tabla `Documento`.
- **Cloudinary**: opcional; si no está configurado, los archivos locales se sirven desde `/uploads` (directorio definido en `UPLOADS_DIR`).
- **Frontend**: no subir archivos directamente; usar endpoints del API que manejan Multer.

## Deploy y configuraciones críticas

⚠️ **El proyecto tiene deploy automático conectado a GitHub — verificar estas reglas antes de commitear:**

### Frontend (Cloudflare Pages)
- Build: `pnpm build:cloudflare` (usa `@opennextjs/cloudflare`)
- Variables requeridas en Cloudflare: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`
- Variables opcionales: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- **NO hardcodear URLs** en `wrangler.toml` — usar variables de entorno de Cloudflare
- **Verificar**: toda variable `process.env.NEXT_PUBLIC_*` usada en código debe existir en settings de Cloudflare

### Backend (probablemente Render/Railway)
- Build: `pnpm build` → `pnpm start`
- Variables críticas: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `PORT`
- **Antes de cambiar `schema.prisma`**: generar migración (`pnpm db:migrate`) y commitearla junto con el schema
- Las migraciones se aplican automáticamente en deploy con `prisma migrate deploy`

### Reglas anti-roturas
1. **Nunca commitear cambios en `schema.prisma` sin su migración** — rompe el deploy del API
2. **Variables `NEXT_PUBLIC_*`**: si agregas una nueva en el código, documentarla aquí y configurarla en Cloudflare antes de mergear
3. **`next.config.ts`**: mantener `output: "standalone"` — no cambiar sin coordinar (afecta estrategia de deploy)
4. **Imports del servidor en cliente**: nunca usar `process.env` sin `NEXT_PUBLIC_` en componentes/páginas de Next.js
5. **Build local antes de push**: correr `pnpm build` localmente para detectar errores de TypeScript/build

### Checklist pre-commit para cambios mayores
- [ ] `pnpm lint` pasa sin errores
- [ ] `pnpm --filter @clinica/web typecheck` pasa
- [ ] `pnpm build` completa sin errores
- [ ] Si tocaste `schema.prisma`: migración generada y commiteada
- [ ] Si agregaste variables de entorno: documentadas en `.env.example` y en esta sección

## Convenciones del repo

- Commits: `tipo: descripcion breve` (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`). Ver [DOCS.md](DOCS.md#git-commits).
- Roles del sistema: `ADMIN`, `MEDICO`, `RECEPCIONISTA` (enum `Rol` en Prisma — nota: en `DOCS.md` aparece `DOCTOR`, el real es `MEDICO`).
- Variables de entorno viven en `apps/api/.env` (también las usa `compose.yml` para Postgres).
- No commitear: `apps/*/dist`, `packages/*/dist`, `.env*`, `uploads/`.

## Pitfalls comunes

- **No crear** `pnpm test` ni asumir Jest/Vitest — no hay configuración aún.
- **No renombrar** `/sys-e7k9m2px` ni `proxy.ts`; el middleware Next y los enlaces internos dependen del path.
- **Tailwind v4**: no hay `tailwind.config.ts` activo, los tokens viven en `apps/web/src/app/globals.css`. No regresar a v3.
- **Migraciones**: preferir scripts `pnpm db:*` desde la raíz. Si se trabaja en `packages/database/`, usar `npx prisma` (no `prisma` solo ni `--filter` manual).
- **Repos en API**: instanciar `new PrismaClient()` por archivo de rutas es el patrón actual — replicarlo, no introducir un singleton sin acordar.
- **DOCS.md desactualizado** en: estructura de componentes (es `features/`, no `components/<dominio>/`), tipografía (Playfair + DM Sans, no Poppins), enum de rol (`MEDICO`).
