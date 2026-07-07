import { PrismaClient } from '@clinica/database';

// Una sola instancia compartida por todo el proceso.
// Node.js cachea los módulos, así que todos los archivos que
// importen este módulo reciben el mismo objeto.
const prisma = new PrismaClient();

export default prisma;
