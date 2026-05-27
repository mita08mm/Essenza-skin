-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'MEDICO', 'RECEPCIONISTA');

-- CreateEnum
CREATE TYPE "TipoDocumentoIdentidad" AS ENUM ('CI', 'PASAPORTE');

-- CreateEnum
CREATE TYPE "EstadoPaciente" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoTratamiento" AS ENUM ('FACIAL', 'CORPORAL', 'CAPILAR', 'COMBINADO');

-- CreateEnum
CREATE TYPE "EstadoCita" AS ENUM ('PROGRAMADA', 'CONFIRMADA', 'EN_CURSO', 'COMPLETADA', 'CANCELADA', 'NO_ASISTIO');

-- CreateEnum
CREATE TYPE "TipoProducto" AS ENUM ('COSMECEUTICO', 'DERMOCOSMETICO', 'EQUIPO', 'INSUMO');

-- CreateEnum
CREATE TYPE "TipoItemCobro" AS ENUM ('SERVICIO', 'PRODUCTO', 'PAQUETE');

-- CreateEnum
CREATE TYPE "EstadoCobro" AS ENUM ('PENDIENTE', 'PARCIAL', 'PAGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoItemPrescripcion" AS ENUM ('INDICADO', 'ADQUIRIDO', 'EN_USO', 'COMPLETADO');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('FOTO', 'DOCUMENTO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "tipoDocumento" "TipoDocumentoIdentidad" NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "direccion" TEXT,
    "sexo" TEXT,
    "objetivoEstetico" TEXT,
    "alergias" TEXT,
    "condicionesMedicas" TEXT,
    "medicacionActual" TEXT,
    "embarazoLactancia" BOOLEAN DEFAULT false,
    "contactoEmergenciaNombre" TEXT,
    "contactoEmergenciaTelefono" TEXT,
    "estado" "EstadoPaciente" NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historias_clinicas" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "tipoSangre" TEXT,
    "diagnosticoPrincipal" TEXT,
    "alergias" TEXT,
    "medicacionHabitual" TEXT,
    "antecedentesPersonales" TEXT,
    "antecedentesFamiliares" TEXT,
    "antecedentesQuirurgicos" TEXT,
    "notasGenerales" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "historias_clinicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultas" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "historiaClinicaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "citaId" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoTratamiento" "TipoTratamiento" NOT NULL,
    "nombreTratamiento" TEXT NOT NULL,
    "zonaTratada" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "evaluacionInicial" TEXT,
    "protocolo" TEXT,
    "observaciones" TEXT,
    "proximaSesion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citas" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "tipoTratamiento" "TipoTratamiento",
    "motivo" TEXT NOT NULL,
    "estado" "EstadoCita" NOT NULL DEFAULT 'PROGRAMADA',
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "citas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoProducto" NOT NULL,
    "categoria" TEXT,
    "descripcion" TEXT,
    "marca" TEXT,
    "principioActivo" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "stockMinimo" INTEGER NOT NULL DEFAULT 10,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cobros" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "estado" "EstadoCobro" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "consultaId" TEXT,

    CONSTRAINT "cobros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_cobro" (
    "id" TEXT NOT NULL,
    "cobroId" TEXT NOT NULL,
    "tipo" "TipoItemCobro" NOT NULL,
    "productoId" TEXT,
    "nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_cobro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" TEXT NOT NULL,
    "cobroId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodoPago" "MetodoPago" NOT NULL,
    "referencia" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescripciones" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "consultaId" TEXT,

    CONSTRAINT "prescripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_prescripcion" (
    "id" TEXT NOT NULL,
    "prescripcionId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "aplicacion" TEXT,
    "estado" "EstadoItemPrescripcion" NOT NULL DEFAULT 'INDICADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_prescripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoDocumento" NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_clinica" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nit" TEXT,
    "ciudad" TEXT,
    "pais" TEXT DEFAULT 'Bolivia',
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_clinica_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "pacientes_nombre_apellido_idx" ON "pacientes"("nombre", "apellido");

-- CreateIndex
CREATE INDEX "pacientes_documento_idx" ON "pacientes"("documento");

-- CreateIndex
CREATE INDEX "pacientes_estado_idx" ON "pacientes"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_documento_tipoDocumento_key" ON "pacientes"("documento", "tipoDocumento");

-- CreateIndex
CREATE UNIQUE INDEX "historias_clinicas_pacienteId_key" ON "historias_clinicas"("pacienteId");

-- CreateIndex
CREATE INDEX "historias_clinicas_pacienteId_idx" ON "historias_clinicas"("pacienteId");

-- CreateIndex
CREATE INDEX "consultas_pacienteId_idx" ON "consultas"("pacienteId");

-- CreateIndex
CREATE INDEX "consultas_historiaClinicaId_idx" ON "consultas"("historiaClinicaId");

-- CreateIndex
CREATE INDEX "consultas_fecha_idx" ON "consultas"("fecha");

-- CreateIndex
CREATE INDEX "consultas_citaId_idx" ON "consultas"("citaId");

-- CreateIndex
CREATE INDEX "consultas_tipoTratamiento_idx" ON "consultas"("tipoTratamiento");

-- CreateIndex
CREATE INDEX "citas_pacienteId_idx" ON "citas"("pacienteId");

-- CreateIndex
CREATE INDEX "citas_fecha_idx" ON "citas"("fecha");

-- CreateIndex
CREATE INDEX "citas_estado_idx" ON "citas"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "productos_codigo_key" ON "productos"("codigo");

-- CreateIndex
CREATE INDEX "productos_codigo_idx" ON "productos"("codigo");

-- CreateIndex
CREATE INDEX "productos_activo_idx" ON "productos"("activo");

-- CreateIndex
CREATE INDEX "productos_tipo_idx" ON "productos"("tipo");

-- CreateIndex
CREATE INDEX "cobros_pacienteId_idx" ON "cobros"("pacienteId");

-- CreateIndex
CREATE INDEX "cobros_estado_idx" ON "cobros"("estado");

-- CreateIndex
CREATE INDEX "cobros_fecha_idx" ON "cobros"("fecha");

-- CreateIndex
CREATE INDEX "items_cobro_cobroId_idx" ON "items_cobro"("cobroId");

-- CreateIndex
CREATE INDEX "items_cobro_productoId_idx" ON "items_cobro"("productoId");

-- CreateIndex
CREATE INDEX "pagos_cobroId_idx" ON "pagos"("cobroId");

-- CreateIndex
CREATE INDEX "pagos_fecha_idx" ON "pagos"("fecha");

-- CreateIndex
CREATE INDEX "prescripciones_pacienteId_idx" ON "prescripciones"("pacienteId");

-- CreateIndex
CREATE INDEX "prescripciones_fecha_idx" ON "prescripciones"("fecha");

-- CreateIndex
CREATE INDEX "items_prescripcion_prescripcionId_idx" ON "items_prescripcion"("prescripcionId");

-- CreateIndex
CREATE INDEX "items_prescripcion_estado_idx" ON "items_prescripcion"("estado");

-- CreateIndex
CREATE INDEX "documentos_pacienteId_idx" ON "documentos"("pacienteId");

-- CreateIndex
CREATE INDEX "documentos_tipo_idx" ON "documentos"("tipo");

-- AddForeignKey
ALTER TABLE "historias_clinicas" ADD CONSTRAINT "historias_clinicas_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_historiaClinicaId_fkey" FOREIGN KEY ("historiaClinicaId") REFERENCES "historias_clinicas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_citaId_fkey" FOREIGN KEY ("citaId") REFERENCES "citas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citas" ADD CONSTRAINT "citas_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobros" ADD CONSTRAINT "cobros_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobros" ADD CONSTRAINT "cobros_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "consultas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_cobro" ADD CONSTRAINT "items_cobro_cobroId_fkey" FOREIGN KEY ("cobroId") REFERENCES "cobros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_cobro" ADD CONSTRAINT "items_cobro_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_cobroId_fkey" FOREIGN KEY ("cobroId") REFERENCES "cobros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescripciones" ADD CONSTRAINT "prescripciones_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescripciones" ADD CONSTRAINT "prescripciones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescripciones" ADD CONSTRAINT "prescripciones_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "consultas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_prescripcion" ADD CONSTRAINT "items_prescripcion_prescripcionId_fkey" FOREIGN KEY ("prescripcionId") REFERENCES "prescripciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
