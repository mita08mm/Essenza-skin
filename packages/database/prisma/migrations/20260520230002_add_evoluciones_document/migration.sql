/*
  Warnings:

  - You are about to drop the column `antecedentes` on the `historias_clinicas` table. All the data in the column will be lost.
  - You are about to drop the `archivos` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoArchivoMedico" AS ENUM ('LABORATORIO', 'IMAGEN_RADIOLOGICA', 'ESTUDIO', 'RECETA_ESCANEADA', 'CONSENTIMIENTO', 'OTRO');

-- DropForeignKey
ALTER TABLE "archivos" DROP CONSTRAINT "archivos_pacienteId_fkey";

-- AlterTable
ALTER TABLE "evoluciones" ADD COLUMN     "citaId" TEXT,
ADD COLUMN     "codigoCIE" TEXT,
ADD COLUMN     "examenFisico" TEXT,
ADD COLUMN     "signosVitales" JSONB;

-- AlterTable
ALTER TABLE "historias_clinicas" DROP COLUMN "antecedentes",
ADD COLUMN     "antecedentesFamiliares" TEXT,
ADD COLUMN     "antecedentesPersonales" TEXT,
ADD COLUMN     "antecedentesQuirurgicos" TEXT,
ADD COLUMN     "tipoSangre" TEXT;

-- DropTable
DROP TABLE "archivos";

-- DropEnum
DROP TYPE "TipoArchivo";

-- CreateTable
CREATE TABLE "documentos" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "evolucionId" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" "TipoArchivoMedico" NOT NULL,
    "url" TEXT NOT NULL,
    "tamaño" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "documentos_pacienteId_idx" ON "documentos"("pacienteId");

-- CreateIndex
CREATE INDEX "documentos_evolucionId_idx" ON "documentos"("evolucionId");

-- CreateIndex
CREATE INDEX "documentos_tipo_idx" ON "documentos"("tipo");

-- CreateIndex
CREATE INDEX "evoluciones_citaId_idx" ON "evoluciones"("citaId");

-- AddForeignKey
ALTER TABLE "evoluciones" ADD CONSTRAINT "evoluciones_citaId_fkey" FOREIGN KEY ("citaId") REFERENCES "citas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_evolucionId_fkey" FOREIGN KEY ("evolucionId") REFERENCES "evoluciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
