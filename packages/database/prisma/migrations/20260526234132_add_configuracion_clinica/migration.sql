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
