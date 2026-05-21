-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "marca" TEXT,
ADD COLUMN     "principioActivo" TEXT;

-- AddForeignKey
ALTER TABLE "tratamientos" ADD CONSTRAINT "tratamientos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
