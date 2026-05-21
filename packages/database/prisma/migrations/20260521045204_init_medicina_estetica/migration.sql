-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'TERAPEUTA', 'RECEPCIONISTA');

-- CreateEnum
CREATE TYPE "TipoDocumentoIdentidad" AS ENUM ('DNI', 'PASAPORTE', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoPaciente" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoTratamiento" AS ENUM ('FACIAL', 'CORPORAL', 'CAPILAR', 'COMBINADO');

-- CreateEnum
CREATE TYPE "EstadoCita" AS ENUM ('PROGRAMADA', 'CONFIRMADA', 'EN_CURSO', 'COMPLETADA', 'CANCELADA', 'NO_ASISTIO');

-- CreateEnum
CREATE TYPE "CategoriaServicio" AS ENUM ('FACIAL', 'CORPORAL', 'CAPILAR', 'PAQUETE', 'CONSULTA');

-- CreateEnum
CREATE TYPE "TipoProducto" AS ENUM ('COSMECEUTICO', 'DERMOCOSMETICO', 'EQUIPO', 'INSUMO');

-- CreateEnum
CREATE TYPE "TipoItemCobro" AS ENUM ('SERVICIO', 'PRODUCTO', 'PAQUETE');

-- CreateEnum
CREATE TYPE "EstadoCobro" AS ENUM ('PENDIENTE', 'PARCIAL', 'PAGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoItemProtocolo" AS ENUM ('PRODUCTO', 'RECOMENDACION');

-- CreateEnum
CREATE TYPE "EstadoItemProtocolo" AS ENUM ('INDICADO', 'ADQUIRIDO', 'EN_USO', 'COMPLETADO');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('FOTO_FACIAL', 'FOTO_CORPORAL', 'FOTO_CAPILAR', 'ESTUDIO_DERMATOLOGICO', 'CONSENTIMIENTO_INFORMADO', 'FORMULARIO_EVALUACION', 'OTRO');

-- CreateEnum
CREATE TYPE "CategoriaFoto" AS ENUM ('FRONTAL', 'PERFIL_DERECHO', 'PERFIL_IZQUIERDO', 'LATERAL_DERECHO', 'LATERAL_IZQUIERDO', 'SUPERIOR', 'INFERIOR', 'DETALLE');

-- CreateEnum
CREATE TYPE "MomentoFoto" AS ENUM ('ANTES', 'DURANTE', 'DESPUES', 'CONTROL_1_SEMANA', 'CONTROL_1_MES', 'CONTROL_3_MESES', 'CONTROL_6_MESES');

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
    "grupoSanguineo" TEXT,
    "peso" DECIMAL(5,2),
    "altura" DECIMAL(5,2),
    "objetivoEstetico" TEXT,
    "alergias" TEXT,
    "condicionesMedicas" TEXT,
    "medicacionActual" TEXT,
    "embarazoLactancia" BOOLEAN DEFAULT false,
    "contactoEmergenciaNombre" TEXT,
    "contactoEmergenciaTelefono" TEXT,
    "fotoUrl" TEXT,
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
    "condicionesMedicas" TEXT,
    "medicacionHabitual" TEXT,
    "cirugiasEsteticas" TEXT,
    "cirugiasGenerales" TEXT,
    "tratamientosPrevios" TEXT,
    "productosCosmeticos" TEXT,
    "exposicionSolar" TEXT,
    "habitosVida" TEXT,
    "tipoPiel" TEXT,
    "fototipoFitzpatrick" TEXT,
    "preocupacionPrincipal" TEXT,
    "notasGenerales" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "historias_clinicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tratamientos" (
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
    "productosUsados" TEXT,
    "parametros" JSONB,
    "reaccionesInmediatas" TEXT,
    "recomendacionesPostTratamiento" TEXT,
    "observaciones" TEXT,
    "proximaSesion" TIMESTAMP(3),
    "sesionNumero" INTEGER,
    "totalSesiones" INTEGER,
    "medidas" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tratamientos_pkey" PRIMARY KEY ("id")
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
    "recordatorioEnviado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "citas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" "CategoriaServicio",
    "descripcion" TEXT,
    "duracion" INTEGER,
    "precio" DECIMAL(10,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoProducto" NOT NULL,
    "categoria" TEXT,
    "descripcion" TEXT,
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
    "tratamientoId" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "estado" "EstadoCobro" NOT NULL DEFAULT 'PENDIENTE',
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cobros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_cobro" (
    "id" TEXT NOT NULL,
    "cobroId" TEXT NOT NULL,
    "tipo" "TipoItemCobro" NOT NULL,
    "itemId" TEXT NOT NULL,
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
CREATE TABLE "protocolos" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "tratamientoId" TEXT,
    "usuarioId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre" TEXT NOT NULL,
    "indicaciones" TEXT,
    "duracion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "protocolos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_protocolo" (
    "id" TEXT NOT NULL,
    "protocoloId" TEXT NOT NULL,
    "tipo" "TipoItemProtocolo" NOT NULL,
    "itemId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "aplicacion" TEXT,
    "frecuencia" TEXT,
    "duracion" TEXT,
    "estado" "EstadoItemProtocolo" NOT NULL DEFAULT 'INDICADO',
    "precio" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productoId" TEXT,

    CONSTRAINT "items_protocolo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "tratamientoId" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" "TipoDocumento" NOT NULL,
    "categoria" "CategoriaFoto",
    "momento" "MomentoFoto",
    "url" TEXT NOT NULL,
    "tamaño" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "tratamientos_pacienteId_idx" ON "tratamientos"("pacienteId");

-- CreateIndex
CREATE INDEX "tratamientos_historiaClinicaId_idx" ON "tratamientos"("historiaClinicaId");

-- CreateIndex
CREATE INDEX "tratamientos_fecha_idx" ON "tratamientos"("fecha");

-- CreateIndex
CREATE INDEX "tratamientos_citaId_idx" ON "tratamientos"("citaId");

-- CreateIndex
CREATE INDEX "tratamientos_tipoTratamiento_idx" ON "tratamientos"("tipoTratamiento");

-- CreateIndex
CREATE INDEX "citas_pacienteId_idx" ON "citas"("pacienteId");

-- CreateIndex
CREATE INDEX "citas_fecha_idx" ON "citas"("fecha");

-- CreateIndex
CREATE INDEX "citas_estado_idx" ON "citas"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "servicios_codigo_key" ON "servicios"("codigo");

-- CreateIndex
CREATE INDEX "servicios_codigo_idx" ON "servicios"("codigo");

-- CreateIndex
CREATE INDEX "servicios_activo_idx" ON "servicios"("activo");

-- CreateIndex
CREATE INDEX "servicios_categoria_idx" ON "servicios"("categoria");

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
CREATE INDEX "pagos_cobroId_idx" ON "pagos"("cobroId");

-- CreateIndex
CREATE INDEX "pagos_fecha_idx" ON "pagos"("fecha");

-- CreateIndex
CREATE INDEX "protocolos_pacienteId_idx" ON "protocolos"("pacienteId");

-- CreateIndex
CREATE INDEX "protocolos_fecha_idx" ON "protocolos"("fecha");

-- CreateIndex
CREATE INDEX "items_protocolo_protocoloId_idx" ON "items_protocolo"("protocoloId");

-- CreateIndex
CREATE INDEX "items_protocolo_estado_idx" ON "items_protocolo"("estado");

-- CreateIndex
CREATE INDEX "documentos_pacienteId_idx" ON "documentos"("pacienteId");

-- CreateIndex
CREATE INDEX "documentos_tratamientoId_idx" ON "documentos"("tratamientoId");

-- CreateIndex
CREATE INDEX "documentos_tipo_idx" ON "documentos"("tipo");

-- CreateIndex
CREATE INDEX "documentos_momento_idx" ON "documentos"("momento");

-- AddForeignKey
ALTER TABLE "historias_clinicas" ADD CONSTRAINT "historias_clinicas_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tratamientos" ADD CONSTRAINT "tratamientos_historiaClinicaId_fkey" FOREIGN KEY ("historiaClinicaId") REFERENCES "historias_clinicas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tratamientos" ADD CONSTRAINT "tratamientos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tratamientos" ADD CONSTRAINT "tratamientos_citaId_fkey" FOREIGN KEY ("citaId") REFERENCES "citas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citas" ADD CONSTRAINT "citas_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobros" ADD CONSTRAINT "cobros_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobros" ADD CONSTRAINT "cobros_tratamientoId_fkey" FOREIGN KEY ("tratamientoId") REFERENCES "tratamientos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_cobro" ADD CONSTRAINT "items_cobro_cobroId_fkey" FOREIGN KEY ("cobroId") REFERENCES "cobros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_cobro" ADD CONSTRAINT "ItemCobro_servicio_fkey" FOREIGN KEY ("itemId") REFERENCES "servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_cobro" ADD CONSTRAINT "ItemCobro_producto_fkey" FOREIGN KEY ("itemId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_cobroId_fkey" FOREIGN KEY ("cobroId") REFERENCES "cobros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocolos" ADD CONSTRAINT "protocolos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocolos" ADD CONSTRAINT "protocolos_tratamientoId_fkey" FOREIGN KEY ("tratamientoId") REFERENCES "tratamientos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocolos" ADD CONSTRAINT "protocolos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_protocolo" ADD CONSTRAINT "items_protocolo_protocoloId_fkey" FOREIGN KEY ("protocoloId") REFERENCES "protocolos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_protocolo" ADD CONSTRAINT "items_protocolo_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_tratamientoId_fkey" FOREIGN KEY ("tratamientoId") REFERENCES "tratamientos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
