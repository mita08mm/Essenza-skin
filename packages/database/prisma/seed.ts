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
  console.log('👤 Creando usuarios...');

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
      rol: 'MEDICO',
      nombre: 'Dr. Juan',
      apellido: 'Pérez',
      activo: true,
    },
  });
  console.log('✅ Médico creado:', medico.email);

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

  const historia1 = await prisma.historiaClinica.create({
    data: {
      pacienteId: paciente1.id,
      diagnosticoPrincipal: 'Hipertensión arterial',
      antecedentes: 'Padre con diabetes tipo 2',
      alergias: 'Penicilina',
      medicacionHabitual: 'Enalapril 10mg 1 vez al día',
      notasGenerales: 'Paciente colaboradora, buena adherencia al tratamiento',
    },
  });
  console.log('✅ Historia clínica creada para:', paciente1.nombre);

  const historia2 = await prisma.historiaClinica.create({
    data: {
      pacienteId: paciente2.id,
      diagnosticoPrincipal: 'Asma bronquial',
      antecedentes: 'Sin antecedentes familiares relevantes',
      alergias: 'Polen',
      medicacionHabitual: 'Salbutamol inhalador según necesidad',
      notasGenerales: 'Paciente deportista, no fumador',
    },
  });
  console.log('✅ Historia clínica creada para:', paciente2.nombre);

  // ============================
  // EVOLUCIONES
  // ============================
  console.log('\n📝 Creando evoluciones...');

  const evolucion1 = await prisma.evolucion.create({
    data: {
      pacienteId: paciente1.id,
      historiaClinicaId: historia1.id,
      usuarioId: medico.id,
      fecha: new Date('2026-05-01'),
      motivoConsulta: 'Control de presión arterial',
      diagnostico: 'Hipertensión arterial controlada',
      tratamiento: 'Continuar con Enalapril 10mg',
      observaciones: 'Presión arterial 120/80. Peso estable.',
      proximaConsulta: new Date('2026-06-01'),
    },
  });
  console.log('✅ Evolución creada para:', paciente1.nombre);

  // ============================
  // CITAS
  // ============================
  console.log('\n📅 Creando citas...');

  const cita1 = await prisma.cita.create({
    data: {
      pacienteId: paciente1.id,
      fecha: new Date('2026-05-25'),
      horaInicio: '10:00',
      horaFin: '10:30',
      motivo: 'Control de presión arterial',
      estado: 'PROGRAMADA',
      notas: 'Traer estudios de laboratorio',
    },
  });
  console.log('✅ Cita creada para:', paciente1.nombre);

  const cita2 = await prisma.cita.create({
    data: {
      pacienteId: paciente2.id,
      fecha: new Date('2026-05-26'),
      horaInicio: '14:00',
      horaFin: '14:30',
      motivo: 'Control de asma',
      estado: 'PROGRAMADA',
    },
  });
  console.log('✅ Cita creada para:', paciente2.nombre);

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
  // MEDICAMENTOS
  // ============================
  console.log('\n💊 Creando medicamentos...');

  const enalapril = await prisma.medicamento.create({
    data: {
      codigo: 'MED-001',
      nombre: 'Enalapril 10mg',
      descripcion: 'Antihipertensivo - Comprimidos x 30',
      precio: 1200,
      stock: 50,
      stockMinimo: 10,
      activo: true,
    },
  });
  console.log('✅ Medicamento creado:', enalapril.nombre);

  const salbutamol = await prisma.medicamento.create({
    data: {
      codigo: 'MED-002',
      nombre: 'Salbutamol Inhalador',
      descripcion: 'Broncodilatador - 200 dosis',
      precio: 2500,
      stock: 30,
      stockMinimo: 5,
      activo: true,
    },
  });
  console.log('✅ Medicamento creado:', salbutamol.nombre);

  console.log('\n✅ ¡Seed completado exitosamente!\n');
  console.log('📊 Resumen:');
  console.log('  - 3 usuarios (Admin, Médico, Recepcionista)');
  console.log('  - 2 pacientes');
  console.log('  - 2 historias clínicas');
  console.log('  - 1 evolución');
  console.log('  - 2 citas');
  console.log('  - 2 servicios');
  console.log('  - 2 medicamentos');
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
