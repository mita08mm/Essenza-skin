-- Migración NO destructiva: solo agrega un tipo y una columna nullable.
-- Las fotos existentes quedan con categoria = NULL (sin clasificar).

-- CreateEnum
CREATE TYPE "CategoriaFoto" AS ENUM ('antes', 'despues');

-- AlterTable
ALTER TABLE "documentos" ADD COLUMN "categoria" "CategoriaFoto";
