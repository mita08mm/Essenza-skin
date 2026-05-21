import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Limpiar datos existentes (opcional para desarrollo)
  // await prisma.pago.deleteMany();
  // await prisma.itemCobro.deleteMany();
  // await prisma.cobro.deleteMany();
  // await prisma.itemReceta.deleteMany();
  // await prisma.receta.deleteMany();
  // await prisma.evolucion.deleteMany();
  // await prisma.historiaClinica.deleteMany();
  // await prisma.cita.deleteMany();
  // await prisma.archivo.deleteMany();
  // await prisma.paciente.deleteMany();
  // await prisma.usuario.deleteMany();

  // ============================
  // USUARIOS
  // ============================

  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@clinica.com' },
    update: {},
    create: {
      email: 'admin@clinica.com',
      password: adminPassword,
      rol: 'ADMIN',
      nombre: 'Administrador',
      apellido: 'Sistema',
      activo: true,
    },
  });
  console.log('✅ Admin creado:', admin.email);

  const medicoPassword = await bcrypt.hash('medico123', 10);
  const medico = await prisma.usuario.upsert({
    where: { email: 'medico@clinica.com' },
    update: {},
    create: {
      email: 'medico@clinica.com',
      password: medicoPassword,
      rol: 'TERAPEUTA',
      nombre: 'Dra. Juan',
      apellido: 'Pérez',
      activo: true,
    },
  });
  console.log('✅ Terapeuta creado:', medico.email);

  const recepPassword = await bcrypt.hash('recep123', 10);
  const recepcionista = await prisma.usuario.upsert({
    where: { email: 'recepcion@clinica.com' },
    update: {},
    create: {
      email: 'recepcion@clinica.com',
      password: recepPassword,
      rol: 'RECEPCIONISTA',
      nombre: 'María',
      apellido: 'González',
      activo: true,
    },
  });
  console.log('✅ Recepcionista creada:', recepcionista.email);

  // ============================
  // PACIENTES
  // ============================
  console.log('\n👥 Creando pacientes...');

  const paciente1 = await prisma.paciente.create({
    data: {
      nombre: 'Ana',
      apellido: 'Martínez',
      documento: '12345678',
      tipoDocumento: 'DNI',
      fechaNacimiento: new Date('1990-05-15'),
      telefono: '+54 11 1234-5678',
      email: 'ana.martinez@example.com',
      direccion: 'Av. Corrientes 1234, CABA',
      estado: 'ACTIVO',
    },
  });
  console.log('✅ Paciente creado:', paciente1.nombre, paciente1.apellido);

  const paciente2 = await prisma.paciente.create({
    data: {
      nombre: 'Carlos',
      apellido: 'López',
      documento: '87654321',
      tipoDocumento: 'DNI',
      fechaNacimiento: new Date('1985-08-20'),
      telefono: '+54 11 8765-4321',
      email: 'carlos.lopez@example.com',
      direccion: 'Av. Santa Fe 567, CABA',
      estado: 'ACTIVO',
    },
  });
  console.log('✅ Paciente creado:', paciente2.nombre, paciente2.apellido);

  // ============================
  // HISTORIAS CLÍNICAS
  // ============================
  console.log('\n📋 Creando historias clínicas...');

  await prisma.historiaClinica.create({
    data: {
      pacienteId: paciente1.id,
      condicionesMedicas: 'Ninguna',
      tipoPiel: 'Mixta',
      preocupacionPrincipal: 'Arrugas de expresión',
    },
  });
  console.log('✅ Historia clínica creada para:', paciente1.nombre);

  await prisma.historiaClinica.create({
    data: {
      pacienteId: paciente2.id,
      condicionesMedicas: 'Ninguna',
      tipoPiel: 'Grasa',
      preocupacionPrincipal: 'Acné',
    },
  });
  console.log('✅ Historia clínica creada para:', paciente2.nombre);

  // ============================
  // SERVICIOS
  // ============================
  console.log('\n💼 Creando servicios...');

  const consulta = await prisma.servicio.create({
    data: {
      codigo: 'CONS-001',
      nombre: 'Consulta Médica General',
      descripcion: 'Consulta médica de atención primaria',
      precio: 5000,
      activo: true,
    },
  });
  console.log('✅ Servicio creado:', consulta.nombre);

  const electrocardiograma = await prisma.servicio.create({
    data: {
      codigo: 'ECG-001',
      nombre: 'Electrocardiograma',
      descripcion: 'Estudio cardiológico',
      precio: 3000,
      activo: true,
    },
  });
  console.log('✅ Servicio creado:', electrocardiograma.nombre);

  // ============================
  // PRODUCTOS
  // ============================
  console.log('\n🧴 Creando productos...');

  await prisma.producto.create({
    data: {
      codigo: 'PROD-001',
      nombre: 'Sérum Vitamina C 20%',
      tipo: 'COSMECEUTICO',
      categoria: 'Sérum',
      descripcion: 'Sérum antioxidante y despigmentante',
      precio: 8500,
      stock: 30,
      stockMinimo: 5,
      activo: true,
    },
  });
  console.log('✅ Producto creado: Sérum Vitamina C');

  await prisma.producto.create({
    data: {
      codigo: 'PROD-002',
      nombre: 'Retinol 0.5% Noche',
      tipo: 'DERMOCOSMETICO',
      categoria: 'Crema',
      descripcion: 'Crema antiedad con retinol',
      precio: 6500,
      stock: 20,
      stockMinimo: 5,
      activo: true,
    },
  });
  console.log('✅ Producto creado: Retinol Noche');

  console.log('\n✅ ¡Seed completado exitosamente!\n');
  console.log('📊 Resumen:');
  console.log('  - 3 usuarios (Admin, Terapeuta, Recepcionista)');
  console.log('  - 2 pacientes');
  console.log('  - 2 historias clínicas');
  console.log('  - 2 servicios');
  console.log('  - 2 productos cosmé uticos');
  console.log('\n🔑 Credenciales:');
  console.log('  Admin: admin@clinica.com / admin123');
  console.log('  Médico: medico@clinica.com / medico123');
  console.log('  Recepcionista: recepcion@clinica.com / recep123');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
