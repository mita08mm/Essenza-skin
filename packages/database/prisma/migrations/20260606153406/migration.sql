-- AlterTable
ALTER TABLE "cobros" ADD COLUMN     "fechaRecordatorio" TIMESTAMP(3),
ADD COLUMN     "notas" TEXT;

-- CreateIndex
CREATE INDEX "cobros_fechaRecordatorio_idx" ON "cobros"("fechaRecordatorio");
