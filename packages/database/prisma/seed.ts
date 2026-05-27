import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de base de datos...');

  console.log('\nCreando usuarios del sistema...');

  const adminPassword = await bcrypt.hash('Sol20#@.Cli', 10);
  const admin = await prisma.usuario.upsert({
    where: { email: 'cecile.arce@gmail.com' },
    update: {},
    create: { 
      email: 'cecile.arce@gmail.com',
      password: adminPassword,
      rol: 'ADMIN',
      nombre: 'Cecile',
      apellido: 'Arce',
      activo: true,
    },
  });
  console.log('Admin creado:', admin.email);

  const medicoPassword = await bcrypt.hash('DocBlue#24', 10);
  const medico = await prisma.usuario.upsert({
    where: { email: 'cecile.derpic@gmail.com' },
    update: {},
    create: {
      email: 'cecile.derpic@gmail.com',
      password: medicoPassword,
      rol: 'MEDICO',
      nombre: 'Cecile',
      apellido: 'Derpic',
      activo: true,
    },
  });
  console.log('Médico creado:', medico.email);

  const recepPassword = await bcrypt.hash('Recep&Green99', 10);
  const recepcionista = await prisma.usuario.upsert({
    where: { email: 'ana.gonzalez@clinica.com' },
    update: {},
    create: {
      email: 'ana.gonzalez@clinica.com',
      password: recepPassword,
      rol: 'RECEPCIONISTA',
      nombre: 'Ana',
      apellido: 'González',
      activo: true,
    },
  });
  console.log('✅ Recepcionista creada:', recepcionista.email);

  console.log('\n¡Seed completado exitosamente!\n');
  console.log('Resumen:');
  console.log('  - 3 usuarios (Admin, Médico, Recepcionista)');
  console.log('\n🔑 Credenciales de acceso:');
  console.log('  Admin:         cecile.arce@gmail.com / Sol20#@.Cli');
  console.log('  Médico:        dra.mlopez@clinica.com / DocBlue#24');
  console.log('  Recepcionista: ana.gonzalez@clinica.com / Recep&Green99');
}

main()
  .catch((e) => {
    console.error('Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
