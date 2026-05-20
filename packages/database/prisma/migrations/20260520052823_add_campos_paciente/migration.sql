-- AlterTable
ALTER TABLE "pacientes" ADD COLUMN     "alergias" TEXT,
ADD COLUMN     "altura" DECIMAL(5,2),
ADD COLUMN     "contactoEmergenciaNombre" TEXT,
ADD COLUMN     "contactoEmergenciaTelefono" TEXT,
ADD COLUMN     "grupoSanguineo" TEXT,
ADD COLUMN     "peso" DECIMAL(5,2),
ADD COLUMN     "sexo" TEXT;
