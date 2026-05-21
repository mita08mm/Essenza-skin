/*
  Warnings:

  - You are about to drop the column `evolucionId` on the `cobros` table. All the data in the column will be lost.
  - You are about to drop the column `evolucionId` on the `documentos` table. All the data in the column will be lost.
  - You are about to drop the column `evolucionId` on the `recetas` table. All the data in the column will be lost.
  - You are about to drop the `evoluciones` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cobros" DROP CONSTRAINT "cobros_evolucionId_fkey";

-- DropForeignKey
ALTER TABLE "documentos" DROP CONSTRAINT "documentos_evolucionId_fkey";

-- DropForeignKey
ALTER TABLE "evoluciones" DROP CONSTRAINT "evoluciones_citaId_fkey";

-- DropForeignKey
ALTER TABLE "evoluciones" DROP CONSTRAINT "evoluciones_historiaClinicaId_fkey";

-- DropForeignKey
ALTER TABLE "evoluciones" DROP CONSTRAINT "evoluciones_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "recetas" DROP CONSTRAINT "recetas_evolucionId_fkey";

-- DropIndex
DROP INDEX "documentos_evolucionId_idx";

-- AlterTable
ALTER TABLE "cobros" DROP COLUMN "evolucionId",
ADD COLUMN     "consultaId" TEXT;

-- AlterTable
ALTER TABLE "documentos" DROP COLUMN "evolucionId",
ADD COLUMN     "consultaId" TEXT;

-- AlterTable
ALTER TABLE "recetas" DROP COLUMN "evolucionId",
ADD COLUMN     "consultaId" TEXT;

-- DropTable
DROP TABLE "evoluciones";

-- CreateTable
CREATE TABLE "consultas" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "historiaClinicaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "citaId" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivoConsulta" TEXT NOT NULL,
    "examenFisico" TEXT,
    "diagnostico" TEXT NOT NULL,
    "codigoCIE" TEXT,
    "tratamiento" TEXT,
    "observaciones" TEXT,
    "proximaConsulta" TIMESTAMP(3),
    "signosVitales" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "consultas_pacienteId_idx" ON "consultas"("pacienteId");

-- CreateIndex
CREATE INDEX "consultas_historiaClinicaId_idx" ON "consultas"("historiaClinicaId");

-- CreateIndex
CREATE INDEX "consultas_fecha_idx" ON "consultas"("fecha");

-- CreateIndex
CREATE INDEX "consultas_citaId_idx" ON "consultas"("citaId");

-- CreateIndex
CREATE INDEX "documentos_consultaId_idx" ON "documentos"("consultaId");

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_historiaClinicaId_fkey" FOREIGN KEY ("historiaClinicaId") REFERENCES "historias_clinicas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_citaId_fkey" FOREIGN KEY ("citaId") REFERENCES "citas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobros" ADD CONSTRAINT "cobros_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "consultas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recetas" ADD CONSTRAINT "recetas_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "consultas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "consultas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
