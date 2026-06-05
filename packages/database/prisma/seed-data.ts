import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const medico = await prisma.usuario.findFirst({ where: { rol: 'MEDICO' } });
  if (!medico) throw new Error('Ejecuta primero: pnpm db:seed');

  // ========== PRODUCTOS (15) ==========
  const productos = await Promise.all([
    prisma.producto.upsert({
      where: { codigo: 'COSM-001' },
      update: {},
      create: {
        codigo: 'COSM-001',
        nombre: 'Ácido Hialurónico 2%',
        tipo: 'COSMECEUTICO',
        categoria: 'Hidratación',
        marca: 'The Ordinary',
        principioActivo: 'Ácido Hialurónico',
        precio: 280,
        stock: 50,
        stockMinimo: 10,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'COSM-002' },
      update: {},
      create: {
        codigo: 'COSM-002',
        nombre: 'Vitamina C + HA Spheres',
        tipo: 'COSMECEUTICO',
        categoria: 'Antioxidante',
        marca: 'Drunk Elephant',
        principioActivo: 'Vitamina C',
        precio: 520,
        stock: 30,
        stockMinimo: 5,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'DERM-001' },
      update: {},
      create: {
        codigo: 'DERM-001',
        nombre: 'Effaclar Duo (+)',
        tipo: 'DERMOCOSMETICO',
        categoria: 'Acné',
        marca: 'La Roche-Posay',
        principioActivo: 'Niacinamida + LHA',
        precio: 385,
        stock: 40,
        stockMinimo: 8,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'DERM-002' },
      update: {},
      create: {
        codigo: 'DERM-002',
        nombre: 'Toleriane Ultra Crème',
        tipo: 'DERMOCOSMETICO',
        categoria: 'Piel Sensible',
        marca: 'La Roche-Posay',
        precio: 425,
        stock: 35,
        stockMinimo: 7,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'INSU-001' },
      update: {},
      create: {
        codigo: 'INSU-001',
        nombre: 'Agujas Dermapen (12 pines)',
        tipo: 'INSUMO',
        categoria: 'Microagujas',
        precio: 45,
        stock: 100,
        stockMinimo: 20,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'INSU-002' },
      update: {},
      create: {
        codigo: 'INSU-002',
        nombre: 'Gasas Estériles 10x10',
        tipo: 'INSUMO',
        categoria: 'Material Médico',
        precio: 12,
        stock: 200,
        stockMinimo: 50,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'COSM-003' },
      update: {},
      create: {
        codigo: 'COSM-003',
        nombre: 'Retinol 0.5% en Squalane',
        tipo: 'COSMECEUTICO',
        categoria: 'Antiedad',
        marca: 'The Ordinary',
        principioActivo: 'Retinol',
        precio: 320,
        stock: 25,
        stockMinimo: 8,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'COSM-004' },
      update: {},
      create: {
        codigo: 'COSM-004',
        nombre: 'Niacinamida 10% + Zinc 1%',
        tipo: 'COSMECEUTICO',
        categoria: 'Regulación',
        marca: 'The Ordinary',
        principioActivo: 'Niacinamida',
        precio: 245,
        stock: 60,
        stockMinimo: 15,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'DERM-003' },
      update: {},
      create: {
        codigo: 'DERM-003',
        nombre: 'Anthelios UV Mune 400',
        tipo: 'DERMOCOSMETICO',
        categoria: 'Protección Solar',
        marca: 'La Roche-Posay',
        precio: 395,
        stock: 45,
        stockMinimo: 10,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'DERM-004' },
      update: {},
      create: {
        codigo: 'DERM-004',
        nombre: 'Cicaplast Baume B5+',
        tipo: 'DERMOCOSMETICO',
        categoria: 'Reparación',
        marca: 'La Roche-Posay',
        precio: 365,
        stock: 38,
        stockMinimo: 8,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'COSM-005' },
      update: {},
      create: {
        codigo: 'COSM-005',
        nombre: 'Alpha Arbutin 2% + HA',
        tipo: 'COSMECEUTICO',
        categoria: 'Despigmentante',
        marca: 'The Ordinary',
        principioActivo: 'Alpha Arbutin',
        precio: 290,
        stock: 32,
        stockMinimo: 10,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'EQUI-001' },
      update: {},
      create: {
        codigo: 'EQUI-001',
        nombre: 'Dermapen 4',
        tipo: 'EQUIPO',
        categoria: 'Microagujas',
        marca: 'Dermapen World',
        precio: 12500,
        stock: 2,
        stockMinimo: 1,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'INSU-003' },
      update: {},
      create: {
        codigo: 'INSU-003',
        nombre: 'Guantes Nitrilo (caja 100u)',
        tipo: 'INSUMO',
        categoria: 'Material Médico',
        precio: 85,
        stock: 50,
        stockMinimo: 10,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'COSM-006' },
      update: {},
      create: {
        codigo: 'COSM-006',
        nombre: 'Peptide Complex Serum',
        tipo: 'COSMECEUTICO',
        categoria: 'Antiedad',
        marca: 'SkinCeuticals',
        principioActivo: 'Péptidos',
        precio: 680,
        stock: 18,
        stockMinimo: 5,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'DERM-005' },
      update: {},
      create: {
        codigo: 'DERM-005',
        nombre: 'Hyalu B5 Sérum',
        tipo: 'DERMOCOSMETICO',
        categoria: 'Hidratación',
        marca: 'La Roche-Posay',
        precio: 485,
        stock: 28,
        stockMinimo: 7,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'INSU-004' },
      update: {},
      create: {
        codigo: 'INSU-004',
        nombre: 'Suero Fisiológico 500ml',
        tipo: 'INSUMO',
        categoria: 'Material Médico',
        precio: 25,
        stock: 80,
        stockMinimo: 20,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'COSM-007' },
      update: {},
      create: {
        codigo: 'COSM-007',
        nombre: 'Lactic Acid 10% + HA',
        tipo: 'COSMECEUTICO',
        categoria: 'Exfoliación',
        marca: 'The Ordinary',
        principioActivo: 'Ácido Láctico',
        precio: 265,
        stock: 42,
        stockMinimo: 12,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'DERM-006' },
      update: {},
      create: {
        codigo: 'DERM-006',
        nombre: 'Kerium DS Shampoo',
        tipo: 'DERMOCOSMETICO',
        categoria: 'Capilar',
        marca: 'La Roche-Posay',
        precio: 285,
        stock: 35,
        stockMinimo: 8,
      },
    }),
    prisma.producto.upsert({
      where: { codigo: 'INSU-005' },
      update: {},
      create: {
        codigo: 'INSU-005',
        nombre: 'Alcohol Gel 500ml',
        tipo: 'INSUMO',
        categoria: 'Antisepsia',
        precio: 35,
        stock: 120,
        stockMinimo: 30,
      },
    }),
  ]);

  // ========== PACIENTES (15) ==========
  const pacientes = await Promise.all([
    prisma.paciente.upsert({
      where: { 
        documento_tipoDocumento: { 
          documento: '12345678', 
          tipoDocumento: 'CI' 
        } 
      },
      update: {},
      create: {
        nombre: 'María',
        apellido: 'Rodríguez',
        documento: '12345678',
        tipoDocumento: 'CI',
        fechaNacimiento: new Date('1985-03-15'),
        telefono: '79812345',
        email: 'maria.rodriguez@mail.com',
        direccion: 'Av. Arce #2341, La Paz',
        sexo: 'FEMENINO',
        objetivoEstetico: 'Rejuvenecimiento facial',
        alergias: 'Ninguna',
        condicionesMedicas: 'Hipertensión controlada',
        embarazoLactancia: false,
        contactoEmergenciaNombre: 'Carlos Rodríguez',
        contactoEmergenciaTelefono: '79898765',
        estado: 'ACTIVO',
      },
    }),
    prisma.paciente.upsert({
      where: { 
        documento_tipoDocumento: { 
          documento: '87654321', 
          tipoDocumento: 'CI' 
        } 
      },
      update: {},
      create: {
        nombre: 'Ana',
        apellido: 'Pérez',
        documento: '87654321',
        tipoDocumento: 'CI',
        fechaNacimiento: new Date('1992-07-22'),
        telefono: '79823456',
        email: 'ana.perez@mail.com',
        direccion: 'Calle 21, Calacoto',
        sexo: 'FEMENINO',
        objetivoEstetico: 'Tratamiento antiacné',
        alergias: 'Penicilina',
        condicionesMedicas: 'Ninguna',
        embarazoLactancia: false,
        contactoEmergenciaNombre: 'Laura Pérez',
        contactoEmergenciaTelefono: '79887654',
        estado: 'ACTIVO',
      },
    }),
    prisma.paciente.upsert({
      where: { 
        documento_tipoDocumento: { 
          documento: '11223344', 
          tipoDocumento: 'CI' 
        } 
      },
      update: {},
      create: {
        nombre: 'Carlos',
        apellido: 'Martínez',
        documento: '11223344',
        tipoDocumento: 'CI',
        fechaNacimiento: new Date('1978-11-05'),
        telefono: '79834567',
        email: 'carlos.martinez@mail.com',
        direccion: 'Zona Sur, Calle 15',
        sexo: 'MASCULINO',
        objetivoEstetico: 'Tratamiento capilar',
        condicionesMedicas: 'Diabetes tipo 2',
        estado: 'ACTIVO',
      },
    }),
    prisma.paciente.upsert({
      where: { 
        documento_tipoDocumento: { 
          documento: '55667788', 
          tipoDocumento: 'CI' 
        } 
      },
      update: {},
      create: {
        nombre: 'Sofía',
        apellido: 'López',
        documento: '55667788',
        tipoDocumento: 'CI',
        fechaNacimiento: new Date('1995-01-30'),
        telefono: '79845678',
        email: 'sofia.lopez@mail.com',
        direccion: 'Sopocachi, Av. Ecuador',
        sexo: 'FEMENINO',
        objetivoEstetico: 'Reducción de grasa localizada',
        alergias: 'Ninguna',
        embarazoLactancia: false,
        contactoEmergenciaNombre: 'José López',
        contactoEmergenciaTelefono: '79876543',
        estado: 'ACTIVO',
      },
    }),
    prisma.paciente.upsert({
      where: { 
        documento_tipoDocumento: { 
          documento: '99887766', 
          tipoDocumento: 'CI' 
        } 
      },
      update: {},
      create: {
        nombre: 'Roberto',
        apellido: 'Fernández',
        documento: '99887766',
        tipoDocumento: 'CI',
        fechaNacimiento: new Date('1988-09-12'),
        telefono: '79856789',
        email: 'roberto.fernandez@mail.com',
        direccion: 'San Miguel, Calle 8',
        sexo: 'MASCULINO',
        objetivoEstetico: 'Eliminación de manchas',
        alergias: 'Látex',
        estado: 'ACTIVO',
      },
    }),
    prisma.paciente.upsert({
      where: { 
        documento_tipoDocumento: { 
          documento: '22334455', 
          tipoDocumento: 'CI' 
        } 
      },
      update: {},
      create: {
        nombre: 'Valentina',
        apellido: 'Sánchez',
        documento: '22334455',
        tipoDocumento: 'CI',
        fechaNacimiento: new Date('1990-05-18'),
        telefono: '79867890',
        email: 'valentina.sanchez@mail.com',
        direccion: 'Miraflores, Calle 12',
        sexo: 'FEMENINO',
        objetivoEstetico: 'Hidratación profunda',
        alergias: 'Ninguna',
        embarazoLactancia: false,
        contactoEmergenciaNombre: 'Pedro Sánchez',
        contactoEmergenciaTelefono: '79865432',
        estado: 'ACTIVO',
      },
    }),
    prisma.paciente.upsert({
      where: { 
        documento_tipoDocumento: { 
          documento: '33445566', 
          tipoDocumento: 'CI' 
        } 
      },
      update: {},
      create: {
        nombre: 'Diego',
        apellido: 'Morales',
        documento: '33445566',
        tipoDocumento: 'CI',
        fechaNacimiento: new Date('1982-12-08'),
        telefono: '79878901',
        email: 'diego.morales@mail.com',
        direccion: 'Obrajes, Av. Hernando Siles',
        sexo: 'MASCULINO',
        objetivoEstetico: 'Reducción papada',
        condicionesMedicas: 'Ninguna',
        contactoEmergenciaNombre: 'Andrea Morales',
        contactoEmergenciaTelefono: '79854321',
        estado: 'ACTIVO',
      },
    }),
    prisma.paciente.upsert({
      where: { 
        documento_tipoDocumento: { 
          documento: '44556677', 
          tipoDocumento: 'CI' 
        } 
      },
      update: {},
      create: {
        nombre: 'Lucía',
        apellido: 'Vargas',
        documento: '44556677',
        tipoDocumento: 'CI',
        fechaNacimiento: new Date('1998-02-25'),
        telefono: '79889012',
        email: 'lucia.vargas@mail.com',
        direccion: 'Achumani, Calle 22',
        sexo: 'FEMENINO',
        objetivoEstetico: 'Tratamiento cicatrices acné',
        alergias: 'Ninguna',
        embarazoLactancia: false,
        contactoEmergenciaNombre: 'Marta Vargas',
        contactoEmergenciaTelefono: '79843210',
        estado: 'ACTIVO',
      },
    }),
    prisma.paciente.upsert({
      where: { 
        documento_tipoDocumento: { 
          documento: '55667799', 
          tipoDocumento: 'CI' 
        } 
      },
      update: {},
      create: {
        nombre: 'Fernando',
        apellido: 'Ríos',
        documento: '55667799',
        tipoDocumento: 'CI',
        fechaNacimiento: new Date('1975-08-14'),
        telefono: '79890123',
        email: 'fernando.rios@mail.com',
        direccion: 'Irpavi, Calle 30',
        sexo: 'MASCULINO',
        objetivoEstetico: 'Rejuvenecimiento facial',
        condicionesMedicas: 'Colesterol alto',
        contactoEmergenciaNombre: 'Rosa Ríos',
        contactoEmergenciaTelefono: '79832109',
        estado: 'ACTIVO',
      },
    }),
    prisma.paciente.upsert({
      where: { 
        documento_tipoDocumento: { 
          documento: '66778899', 
          tipoDocumento: 'CI' 
        } 
      },
      update: {},
      create: {
        nombre: 'Camila',
        apellido: 'Torres',
        documento: '66778899',
        tipoDocumento: 'CI',
        fechaNacimiento: new Date('1993-11-03'),
        telefono: '79801234',
        email: 'camila.torres@mail.com',
        direccion: 'San Pedro, Av. Camacho',
        sexo: 'FEMENINO',
        objetivoEstetico: 'Voluminización labial',
        alergias: 'Ninguna',
        embarazoLactancia: false,
        contactoEmergenciaNombre: 'Luis Torres',
        contactoEmergenciaTelefono: '79821098',
        estado: 'ACTIVO',
      },
    }),
    prisma.paciente.upsert({
      where: { 
        documento_tipoDocumento: { 
          documento: '77889900', 
          tipoDocumento: 'CI' 
        } 
      },
      update: {},
      create: {
        nombre: 'Javier',
        apellido: 'Castro',
        documento: '77889900',
        tipoDocumento: 'CI',
        fechaNacimiento: new Date('1987-04-20'),
        telefono: '79812345',
        email: 'javier.castro@mail.com',
        direccion: 'Cota Cota, Calle 5',
        sexo: 'MASCULINO',
        objetivoEstetico: 'Depilación láser',
        condicionesMedicas: 'Ninguna',
        estado: 'ACTIVO',
      },
    }),
    prisma.paciente.upsert({
      where: { 
        documento_tipoDocumento: { 
          documento: '88990011', 
          tipoDocumento: 'CI' 
        } 
      },
      update: {},
      create: {
        nombre: 'Daniela',
        apellido: 'Gutiérrez',
        documento: '88990011',
        tipoDocumento: 'CI',
        fechaNacimiento: new Date('1996-06-12'),
        telefono: '79823456',
        email: 'daniela.gutierrez@mail.com',
        direccion: 'Seguencoma, Av. Costanera',
        sexo: 'FEMENINO',
        objetivoEstetico: 'Reducción ojeras',
        alergias: 'Ninguna',
        embarazoLactancia: false,
        contactoEmergenciaNombre: 'Elena Gutiérrez',
        contactoEmergenciaTelefono: '79810987',
        estado: 'ACTIVO',
      },
    }),
    prisma.paciente.upsert({
      where: { 
        documento_tipoDocumento: { 
          documento: '99001122', 
          tipoDocumento: 'CI' 
        } 
      },
      update: {},
      create: {
        nombre: 'Andrés',
        apellido: 'Mendoza',
        documento: '99001122',
        tipoDocumento: 'CI',
        fechaNacimiento: new Date('1980-10-07'),
        telefono: '79834567',
        email: 'andres.mendoza@mail.com',
        direccion: 'Calacoto, Calle 18',
        sexo: 'MASCULINO',
        objetivoEstetico: 'Mesoterapia corporal',
        alergias: 'Aspirina',
        condicionesMedicas: 'Ninguna',
        contactoEmergenciaNombre: 'Patricia Mendoza',
        contactoEmergenciaTelefono: '79809876',
        estado: 'ACTIVO',
      },
    }),
    prisma.paciente.upsert({
      where: { 
        documento_tipoDocumento: { 
          documento: '00112233', 
          tipoDocumento: 'CI' 
        } 
      },
      update: {},
      create: {
        nombre: 'Isabel',
        apellido: 'Romero',
        documento: '00112233',
        tipoDocumento: 'CI',
        fechaNacimiento: new Date('1991-01-29'),
        telefono: '79845678',
        email: 'isabel.romero@mail.com',
        direccion: 'Villa Fátima, Av. Panorámica',
        sexo: 'FEMENINO',
        objetivoEstetico: 'Radiofrecuencia facial',
        alergias: 'Ninguna',
        embarazoLactancia: false,
        contactoEmergenciaNombre: 'Mario Romero',
        contactoEmergenciaTelefono: '79798765',
        estado: 'ACTIVO',
      },
    }),
    prisma.paciente.upsert({
      where: { 
        documento_tipoDocumento: { 
          documento: '11223399', 
          tipoDocumento: 'CI' 
        } 
      },
      update: {},
      create: {
        nombre: 'Patricia',
        apellido: 'Vega',
        documento: '11223399',
        tipoDocumento: 'CI',
        fechaNacimiento: new Date('1994-08-16'),
        telefono: '79856789',
        email: 'patricia.vega@mail.com',
        direccion: 'Los Pinos, Calle 7',
        sexo: 'FEMENINO',
        objetivoEstetico: 'Tratamiento rosácea',
        alergias: 'Ninguna',
        embarazoLactancia: false,
        contactoEmergenciaNombre: 'Gabriel Vega',
        contactoEmergenciaTelefono: '79787654',
        estado: 'ACTIVO',
      },
    }),
  ]);

  // Crear historias clínicas para todos los pacientes
  for (const paciente of pacientes) {
    await prisma.historiaClinica.upsert({
      where: { pacienteId: paciente.id },
      update: {},
      create: {
        pacienteId: paciente.id,
        tipoSangre: ['A+', 'O+', 'B+', 'AB+'][Math.floor(Math.random() * 4)],
        alergias: paciente.alergias,
        medicacionHabitual: paciente.condicionesMedicas ? 'Metformina 850mg' : null,
        antecedentesPersonales: 'Sin antecedentes relevantes',
      },
    });
  }

  const ahora = new Date();
  const haceUnMes = new Date(ahora);
  haceUnMes.setMonth(haceUnMes.getMonth() - 1);
  const haceTresDias = new Date(ahora);
  haceTresDias.setDate(haceTresDias.getDate() - 3);
  const haceUnaSemana = new Date(ahora);
  haceUnaSemana.setDate(haceUnaSemana.getDate() - 7);
  const haceDosSemanas = new Date(ahora);
  haceDosSemanas.setDate(haceDosSemanas.getDate() - 14);
  const manana = new Date(ahora);
  manana.setDate(manana.getDate() + 1);
  const proximaSemana = new Date(ahora);
  proximaSemana.setDate(proximaSemana.getDate() + 7);
  const proximoMes = new Date(ahora);
  proximoMes.setMonth(proximoMes.getMonth() + 1);

  // ========== CITAS (20) ==========
  const citas = await Promise.all([
    // Cita completada (María - hace 1 mes)
    prisma.cita.create({
      data: {
        pacienteId: pacientes[0].id,
        fecha: haceUnMes,
        horaInicio: '09:00',
        horaFin: '10:00',
        tipoTratamiento: 'FACIAL',
        motivo: 'Evaluación inicial + Limpieza profunda',
        estado: 'COMPLETADA',
        notas: 'Paciente satisfecha con el resultado',
      },
    }),
    // Cita completada (Ana - hace 3 días)
    prisma.cita.create({
      data: {
        pacienteId: pacientes[1].id,
        fecha: haceTresDias,
        horaInicio: '10:30',
        horaFin: '11:30',
        tipoTratamiento: 'FACIAL',
        motivo: 'Tratamiento antiacné - Sesión 2',
        estado: 'COMPLETADA',
      },
    }),
    // Cita programada (Sofía - mañana)
    prisma.cita.create({
      data: {
        pacienteId: pacientes[3].id,
        fecha: manana,
        horaInicio: '14:00',
        horaFin: '15:30',
        tipoTratamiento: 'CORPORAL',
        motivo: 'Criolipólisis zona abdominal',
        estado: 'CONFIRMADA',
        notas: 'Paciente confirmó asistencia',
      },
    }),
    // Cita programada (Carlos - próxima semana)
    prisma.cita.create({
      data: {
        pacienteId: pacientes[2].id,
        fecha: proximaSemana,
        horaInicio: '16:00',
        horaFin: '17:00',
        tipoTratamiento: 'CAPILAR',
        motivo: 'Mesoterapia capilar - Sesión 4',
        estado: 'PROGRAMADA',
      },
    }),
    // Cita cancelada (Roberto)
    prisma.cita.create({
      data: {
        pacienteId: pacientes[4].id,
        fecha: haceTresDias,
        horaInicio: '11:00',
        horaFin: '12:00',
        tipoTratamiento: 'FACIAL',
        motivo: 'Láser para manchas',
        estado: 'CANCELADA',
        notas: 'Paciente canceló por viaje',
      },
    }),
    // Más citas pasadas completadas
    prisma.cita.create({
      data: {
        pacienteId: pacientes[5].id,
        fecha: haceDosSemanas,
        horaInicio: '09:00',
        horaFin: '10:00',
        tipoTratamiento: 'FACIAL',
        motivo: 'Hidratación profunda',
        estado: 'COMPLETADA',
      },
    }),
    prisma.cita.create({
      data: {
        pacienteId: pacientes[6].id,
        fecha: haceUnaSemana,
        horaInicio: '11:00',
        horaFin: '12:00',
        tipoTratamiento: 'CORPORAL',
        motivo: 'Radiofrecuencia papada',
        estado: 'COMPLETADA',
      },
    }),
    prisma.cita.create({
      data: {
        pacienteId: pacientes[7].id,
        fecha: haceUnMes,
        horaInicio: '14:00',
        horaFin: '15:00',
        tipoTratamiento: 'FACIAL',
        motivo: 'Microagujas con PRP',
        estado: 'COMPLETADA',
        notas: 'Excelentes resultados',
      },
    }),
    prisma.cita.create({
      data: {
        pacienteId: pacientes[8].id,
        fecha: haceDosSemanas,
        horaInicio: '15:00',
        horaFin: '16:00',
        tipoTratamiento: 'FACIAL',
        motivo: 'Peeling químico',
        estado: 'COMPLETADA',
      },
    }),
    prisma.cita.create({
      data: {
        pacienteId: pacientes[9].id,
        fecha: haceUnaSemana,
        horaInicio: '16:00',
        horaFin: '17:30',
        tipoTratamiento: 'FACIAL',
        motivo: 'Rellenos ácido hialurónico labios',
        estado: 'COMPLETADA',
        notas: 'Satisfecha con volumen natural',
      },
    }),
    prisma.cita.create({
      data: {
        pacienteId: pacientes[10].id,
        fecha: haceTresDias,
        horaInicio: '10:00',
        horaFin: '11:00',
        tipoTratamiento: 'CORPORAL',
        motivo: 'Depilación láser axilas',
        estado: 'COMPLETADA',
      },
    }),
    prisma.cita.create({
      data: {
        pacienteId: pacientes[11].id,
        fecha: haceDosSemanas,
        horaInicio: '12:00',
        horaFin: '13:00',
        tipoTratamiento: 'FACIAL',
        motivo: 'Tratamiento ojeras con ácido',
        estado: 'COMPLETADA',
      },
    }),
    prisma.cita.create({
      data: {
        pacienteId: pacientes[12].id,
        fecha: haceUnMes,
        horaInicio: '08:00',
        horaFin: '09:30',
        tipoTratamiento: 'CORPORAL',
        motivo: 'Mesoterapia abdominal',
        estado: 'COMPLETADA',
      },
    }),
    prisma.cita.create({
      data: {
        pacienteId: pacientes[13].id,
        fecha: haceUnaSemana,
        horaInicio: '13:00',
        horaFin: '14:00',
        tipoTratamiento: 'FACIAL',
        motivo: 'Radiofrecuencia facial',
        estado: 'COMPLETADA',
        notas: 'Piel más firme tras sesión',
      },
    }),
    // Citas futuras programadas
    prisma.cita.create({
      data: {
        pacienteId: pacientes[0].id,
        fecha: manana,
        horaInicio: '09:00',
        horaFin: '10:00',
        tipoTratamiento: 'FACIAL',
        motivo: 'Seguimiento peeling',
        estado: 'CONFIRMADA',
      },
    }),
    prisma.cita.create({
      data: {
        pacienteId: pacientes[5].id,
        fecha: proximaSemana,
        horaInicio: '10:00',
        horaFin: '11:00',
        tipoTratamiento: 'FACIAL',
        motivo: 'Hidratación profunda - Sesión 2',
        estado: 'PROGRAMADA',
      },
    }),
    prisma.cita.create({
      data: {
        pacienteId: pacientes[7].id,
        fecha: proximaSemana,
        horaInicio: '14:00',
        horaFin: '15:00',
        tipoTratamiento: 'FACIAL',
        motivo: 'Microagujas - Sesión 2',
        estado: 'PROGRAMADA',
      },
    }),
    prisma.cita.create({
      data: {
        pacienteId: pacientes[11].id,
        fecha: proximoMes,
        horaInicio: '11:00',
        horaFin: '12:00',
        tipoTratamiento: 'FACIAL',
        motivo: 'Control ojeras',
        estado: 'PROGRAMADA',
      },
    }),
    prisma.cita.create({
      data: {
        pacienteId: pacientes[14].id,
        fecha: proximaSemana,
        horaInicio: '15:00',
        horaFin: '16:00',
        tipoTratamiento: 'FACIAL',
        motivo: 'Primera consulta - evaluación',
        estado: 'PROGRAMADA',
      },
    }),
    prisma.cita.create({
      data: {
        pacienteId: pacientes[8].id,
        fecha: proximoMes,
        horaInicio: '09:00',
        horaFin: '10:00',
        tipoTratamiento: 'FACIAL',
        motivo: 'Peeling químico - Sesión 2',
        estado: 'PROGRAMADA',
      },
    }),
  ]);

  const historias = await prisma.historiaClinica.findMany({
    where: { pacienteId: { in: pacientes.map(p => p.id) } },
  });

  // ========== CONSULTAS (12) ==========
  const consultas: any[] = [];

  const consulta1 = await prisma.consulta.create({
    data: {
      pacienteId: pacientes[0].id,
      historiaClinicaId: historias.find(h => h.pacienteId === pacientes[0].id)!.id,
      usuarioId: medico.id,
      citaId: citas[0].id,
      fecha: haceUnMes,
      tipoTratamiento: 'FACIAL',
      nombreTratamiento: 'Limpieza profunda + Peeling químico',
      zonaTratada: 'Rostro completo',
      objetivo: 'Rejuvenecimiento y luminosidad',
      evaluacionInicial: 'Piel opaca, líneas de expresión moderadas, poros dilatados',
      protocolo: 'Doble limpieza + Peeling con ácido glicólico 30% + Máscara hidratante',
      observaciones: 'Buena tolerancia al peeling. Hidratación post-tratamiento.',
      proximaSesion: new Date(haceUnMes.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 días
    },
  });

  const consulta2 = await prisma.consulta.create({
    data: {
      pacienteId: pacientes[1].id,
      historiaClinicaId: historias.find(h => h.pacienteId === pacientes[1].id)!.id,
      usuarioId: medico.id,
      citaId: citas[1].id,
      fecha: haceTresDias,
      tipoTratamiento: 'FACIAL',
      nombreTratamiento: 'Terapia LED azul + Extracción',
      zonaTratada: 'Zona T y mejillas',
      objetivo: 'Control de acné activo',
      evaluacionInicial: 'Lesiones inflamatorias activas, comedones abiertos',
      protocolo: 'Limpieza + Extracción comedones + LED azul 20min + Serum niacinamida',
      observaciones: 'Mejoría notable desde sesión 1. Continuar tratamiento domiciliario.',
      proximaSesion: new Date(haceTresDias.getTime() + 14 * 24 * 60 * 60 * 1000),
    },
  });
  consultas.push(consulta1, consulta2);

  const consulta3 = await prisma.consulta.create({
    data: {
      pacienteId: pacientes[5].id,
      historiaClinicaId: historias.find(h => h.pacienteId === pacientes[5].id)!.id,
      usuarioId: medico.id,
      citaId: citas[5].id,
      fecha: haceDosSemanas,
      tipoTratamiento: 'FACIAL',
      nombreTratamiento: 'Hydrafacial',
      zonaTratada: 'Rostro completo',
      objetivo: 'Hidratación profunda',
      evaluacionInicial: 'Piel deshidratada, opaca',
      protocolo: 'Exfoliación + Extracción + Hidratación intensiva',
      observaciones: 'Excelente respuesta. Piel luminosa.',
    },
  });
  consultas.push(consulta3);

  const consulta4 = await prisma.consulta.create({
    data: {
      pacienteId: pacientes[6].id,
      historiaClinicaId: historias.find(h => h.pacienteId === pacientes[6].id)!.id,
      usuarioId: medico.id,
      citaId: citas[6].id,
      fecha: haceUnaSemana,
      tipoTratamiento: 'CORPORAL',
      nombreTratamiento: 'Radiofrecuencia corporal',
      zonaTratada: 'Papada',
      objetivo: 'Reafirmación',
      evaluacionInicial: 'Flacidez moderada en zona submentoniana',
      protocolo: 'Radiofrecuencia bipolar 45min',
      observaciones: 'Buena tolerancia. Resultados progresivos.',
    },
  });
  consultas.push(consulta4);

  const consulta5 = await prisma.consulta.create({
    data: {
      pacienteId: pacientes[7].id,
      historiaClinicaId: historias.find(h => h.pacienteId === pacientes[7].id)!.id,
      usuarioId: medico.id,
      citaId: citas[7].id,
      fecha: haceUnMes,
      tipoTratamiento: 'FACIAL',
      nombreTratamiento: 'Microagujas + PRP',
      zonaTratada: 'Rostro y cuello',
      objetivo: 'Rejuvenecimiento, cicatrices',
      evaluacionInicial: 'Cicatrices atróficas acné, líneas finas',
      protocolo: 'Dermapen 1.5mm + PRP autólogo',
      observaciones: 'Excelente resultado. Mejoría de textura.',
      proximaSesion: new Date(haceUnMes.getTime() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  consultas.push(consulta5);

  const consulta6 = await prisma.consulta.create({
    data: {
      pacienteId: pacientes[8].id,
      historiaClinicaId: historias.find(h => h.pacienteId === pacientes[8].id)!.id,
      usuarioId: medico.id,
      citaId: citas[8].id,
      fecha: haceDosSemanas,
      tipoTratamiento: 'FACIAL',
      nombreTratamiento: 'Peeling TCA 15%',
      zonaTratada: 'Rostro',
      objetivo: 'Renovación celular, manchas',
      evaluacionInicial: 'Hiperpigmentación postinflamatoria',
      protocolo: 'Peeling TCA 15% + neutralización + protección',
      observaciones: 'Descamación esperada días 3-5.',
    },
  });
  consultas.push(consulta6);

  const consulta7 = await prisma.consulta.create({
    data: {
      pacienteId: pacientes[9].id,
      historiaClinicaId: historias.find(h => h.pacienteId === pacientes[9].id)!.id,
      usuarioId: medico.id,
      citaId: citas[9].id,
      fecha: haceUnaSemana,
      tipoTratamiento: 'FACIAL',
      nombreTratamiento: 'Relleno ácido hialurónico',
      zonaTratada: 'Labios',
      objetivo: 'Voluminización natural',
      evaluacionInicial: 'Labios finos, asimetría leve',
      protocolo: 'AH 0.5ml labio superior + 0.4ml inferior',
      observaciones: 'Resultado natural. Paciente satisfecha.',
    },
  });
  consultas.push(consulta7);

  const consulta8 = await prisma.consulta.create({
    data: {
      pacienteId: pacientes[10].id,
      historiaClinicaId: historias.find(h => h.pacienteId === pacientes[10].id)!.id,
      usuarioId: medico.id,
      citaId: citas[10].id,
      fecha: haceTresDias,
      tipoTratamiento: 'CORPORAL',
      nombreTratamiento: 'Láser Alejandrita depilación',
      zonaTratada: 'Axilas',
      objetivo: 'Depilación permanente',
      evaluacionInicial: 'Pelo oscuro, fototipo III',
      protocolo: 'Láser Alejandrita 755nm, fluencia 18J',
      observaciones: 'Sesión 3/8. Reducción 60% aprox.',
    },
  });
  consultas.push(consulta8);

  const consulta9 = await prisma.consulta.create({
    data: {
      pacienteId: pacientes[11].id,
      historiaClinicaId: historias.find(h => h.pacienteId === pacientes[11].id)!.id,
      usuarioId: medico.id,
      citaId: citas[11].id,
      fecha: haceDosSemanas,
      tipoTratamiento: 'FACIAL',
      nombreTratamiento: 'Ácido hialurónico ojeras',
      zonaTratada: 'Área periocular',
      objetivo: 'Relleno ojeras, hidratación',
      evaluacionInicial: 'Ojeras hundidas, tonalidad violácea',
      protocolo: 'AH reticulado 0.3ml por lado',
      observaciones: 'Mejoría inmediata. Control 2 semanas.',
    },
  });
  consultas.push(consulta9);

  const consulta10 = await prisma.consulta.create({
    data: {
      pacienteId: pacientes[12].id,
      historiaClinicaId: historias.find(h => h.pacienteId === pacientes[12].id)!.id,
      usuarioId: medico.id,
      citaId: citas[12].id,
      fecha: haceUnMes,
      tipoTratamiento: 'CORPORAL',
      nombreTratamiento: 'Mesoterapia lipolítica',
      zonaTratada: 'Abdomen',
      objetivo: 'Reducción grasa localizada',
      evaluacionInicial: 'Acumulación adiposa abdominal',
      protocolo: 'Deoxicolato + fosfatidilcolina',
      observaciones: 'Sesión 1/6. Drenaje linfático recomendado.',
      proximaSesion: new Date(haceUnMes.getTime() + 21 * 24 * 60 * 60 * 1000),
    },
  });
  consultas.push(consulta10);

  const consulta11 = await prisma.consulta.create({
    data: {
      pacienteId: pacientes[13].id,
      historiaClinicaId: historias.find(h => h.pacienteId === pacientes[13].id)!.id,
      usuarioId: medico.id,
      citaId: citas[13].id,
      fecha: haceUnaSemana,
      tipoTratamiento: 'FACIAL',
      nombreTratamiento: 'Radiofrecuencia facial',
      zonaTratada: 'Rostro y cuello',
      objetivo: 'Reafirmación tejidos',
      evaluacionInicial: 'Flacidez leve a moderada',
      protocolo: 'RF monopolar 60min',
      observaciones: 'Efecto lifting inmediato. Continuar.',
    },
  });
  consultas.push(consulta11);

  const consulta12 = await prisma.consulta.create({
    data: {
      pacienteId: pacientes[2].id,
      historiaClinicaId: historias.find(h => h.pacienteId === pacientes[2].id)!.id,
      usuarioId: medico.id,
      citaId: citas[3].id,
      fecha: new Date(citas[3].fecha),
      tipoTratamiento: 'CAPILAR',
      nombreTratamiento: 'Mesoterapia capilar',
      zonaTratada: 'Cuero cabelludo',
      objetivo: 'Estimulación folicular',
      evaluacionInicial: 'Alopecia androgenética grado II',
      protocolo: 'Minoxidil + biotina + complejo vitamínico',
      observaciones: 'Sesión 4/10. Densidad mejorando.',
    },
  });
  consultas.push(consulta12);

  // ========== PRESCRIPCIONES (15) ==========
  await prisma.prescripcion.create({
    data: {
      pacienteId: pacientes[0].id,
      usuarioId: medico.id,
      consultaId: consultas[0].id,
      fecha: haceUnMes,
      nombre: 'Rutina post-peeling',
      items: {
        create: [
          {
            nombre: 'Ácido Hialurónico 2%',
            cantidad: 1,
            aplicacion: 'Aplicar 2 veces al día sobre piel limpia',
            estado: 'EN_USO',
          },
          {
            nombre: 'Protector Solar SPF 50+',
            cantidad: 1,
            aplicacion: 'Aplicar cada 3 horas durante el día',
            estado: 'EN_USO',
          },
        ],
      },
    },
  });

  await prisma.prescripcion.create({
    data: {
      pacienteId: pacientes[1].id,
      usuarioId: medico.id,
      consultaId: consultas[1].id,
      fecha: haceTresDias,
      nombre: 'Tratamiento domiciliario antiacné',
      items: {
        create: [
          {
            nombre: 'Effaclar Duo (+)',
            cantidad: 1,
            aplicacion: 'Aplicar en zona T por la noche',
            estado: 'ADQUIRIDO',
          },
          {
            nombre: 'Limpiador Gel sin jabón',
            cantidad: 1,
            aplicacion: 'Usar 2 veces al día',
            estado: 'ADQUIRIDO',
          },
          {
            nombre: 'Niacinamida 10%',
            cantidad: 1,
            aplicacion: 'Aplicar por la mañana antes del protector',
            estado: 'INDICADO',
          },
        ],
      },
    },
  });

  await prisma.prescripcion.create({
    data: {
      pacienteId: pacientes[5].id,
      usuarioId: medico.id,
      consultaId: consultas[2].id,
      fecha: haceDosSemanas,
      nombre: 'Hidratación intensiva',
      items: {
        create: [
          {
            nombre: 'Hyalu B5 Sérum',
            cantidad: 1,
            aplicacion: 'Aplicar mañana y noche',
            estado: 'ADQUIRIDO',
          },
        ],
      },
    },
  });

  await prisma.prescripcion.create({
    data: {
      pacienteId: pacientes[7].id,
      usuarioId: medico.id,
      consultaId: consultas[4].id,
      fecha: haceUnMes,
      nombre: 'Post-microagujas',
      items: {
        create: [
          {
            nombre: 'Cicaplast Baume B5+',
            cantidad: 1,
            aplicacion: 'Aplicar cada 4 horas los primeros 3 días',
            estado: 'EN_USO',
          },
          {
            nombre: 'Protector Solar SPF 50+',
            cantidad: 1,
            aplicacion: 'Aplicar generosamente cada 2 horas',
            estado: 'EN_USO',
          },
        ],
      },
    },
  });

  await prisma.prescripcion.create({
    data: {
      pacienteId: pacientes[8].id,
      usuarioId: medico.id,
      consultaId: consultas[5].id,
      fecha: haceDosSemanas,
      nombre: 'Post-peeling TCA',
      items: {
        create: [
          {
            nombre: 'Cicaplast Baume B5+',
            cantidad: 1,
            aplicacion: 'Aplicar 3 veces al día durante descamación',
            estado: 'ADQUIRIDO',
          },
          {
            nombre: 'Alpha Arbutin 2% + HA',
            cantidad: 1,
            aplicacion: 'Iniciar tras descamación completa, 1 vez/noche',
            estado: 'INDICADO',
          },
        ],
      },
    },
  });

  await prisma.prescripcion.create({
    data: {
      pacienteId: pacientes[9].id,
      usuarioId: medico.id,
      consultaId: consultas[6].id,
      fecha: haceUnaSemana,
      nombre: 'Post-relleno labial',
      items: {
        create: [
          {
            nombre: 'Paracetamol 500mg',
            cantidad: 10,
            aplicacion: 'Tomar cada 8h si hay molestia (máx 3 días)',
            estado: 'INDICADO',
          },
        ],
      },
    },
  });

  await prisma.prescripcion.create({
    data: {
      pacienteId: pacientes[11].id,
      usuarioId: medico.id,
      consultaId: consultas[8].id,
      fecha: haceDosSemanas,
      nombre: 'Mantenimiento ojeras',
      items: {
        create: [
          {
            nombre: 'Peptide Complex Serum',
            cantidad: 1,
            aplicacion: 'Aplicar contorno de ojos mañana y noche',
            estado: 'INDICADO',
          },
        ],
      },
    },
  });

  await prisma.prescripcion.create({
    data: {
      pacienteId: pacientes[12].id,
      usuarioId: medico.id,
      consultaId: consultas[9].id,
      fecha: haceUnMes,
      nombre: 'Drenaje post-mesoterapia',
      items: {
        create: [
          {
            nombre: 'Drenaje linfático manual',
            cantidad: 3,
            aplicacion: 'Sesiones cada 3 días tras cada aplicación',
            estado: 'INDICADO',
          },
        ],
      },
    },
  });

  await prisma.prescripcion.create({
    data: {
      pacienteId: pacientes[13].id,
      usuarioId: medico.id,
      consultaId: consultas[10].id,
      fecha: haceUnaSemana,
      nombre: 'Mantenimiento RF',
      items: {
        create: [
          {
            nombre: 'Retinol 0.5% en Squalane',
            cantidad: 1,
            aplicacion: 'Aplicar 3 noches por semana',
            estado: 'INDICADO',
          },
        ],
      },
    },
  });

  await prisma.prescripcion.create({
    data: {
      pacienteId: pacientes[2].id,
      usuarioId: medico.id,
      consultaId: consultas[11].id,
      fecha: new Date(citas[3].fecha),
      nombre: 'Tratamiento capilar domiciliario',
      items: {
        create: [
          {
            nombre: 'Kerium DS Shampoo',
            cantidad: 1,
            aplicacion: 'Uso 3 veces por semana',
            estado: 'ADQUIRIDO',
          },
          {
            nombre: 'Minoxidil 5%',
            cantidad: 1,
            aplicacion: 'Aplicar 1ml cada 12h en cuero cabelludo seco',
            estado: 'EN_USO',
          },
        ],
      },
    },
  });

  await prisma.prescripcion.create({
    data: {
      pacienteId: pacientes[6].id,
      usuarioId: medico.id,
      consultaId: consultas[3].id,
      fecha: haceUnaSemana,
      nombre: 'Cuidados post-RF corporal',
      items: {
        create: [
          {
            nombre: 'Crema reafirmante corporal',
            cantidad: 1,
            aplicacion: 'Aplicar 2 veces al día con masaje ascendente',
            estado: 'INDICADO',
          },
        ],
      },
    },
  });

  await prisma.prescripcion.create({
    data: {
      pacienteId: pacientes[10].id,
      usuarioId: medico.id,
      consultaId: consultas[7].id,
      fecha: haceTresDias,
      nombre: 'Post-depilación láser',
      items: {
        create: [
          {
            nombre: 'Anthelios UV Mune 400',
            cantidad: 1,
            aplicacion: 'Aplicar en zona tratada antes de exposición solar',
            estado: 'ADQUIRIDO',
          },
        ],
      },
    },
  });

  await prisma.prescripcion.create({
    data: {
      pacienteId: pacientes[3].id,
      usuarioId: medico.id,
      fecha: manana,
      nombre: 'Preparación criolipólisis',
      items: {
        create: [
          {
            nombre: 'Hidratación abundante',
            cantidad: 1,
            aplicacion: 'Beber 2L agua diarios',
            estado: 'INDICADO',
          },
        ],
      },
    },
  });

  await prisma.prescripcion.create({
    data: {
      pacienteId: pacientes[14].id,
      usuarioId: medico.id,
      fecha: ahora,
      nombre: 'Rutina básica pre-consulta',
      items: {
        create: [
          {
            nombre: 'Limpiador facial suave',
            cantidad: 1,
            aplicacion: 'Usar mañana y noche',
            estado: 'INDICADO',
          },
          {
            nombre: 'Protector Solar SPF 50+',
            cantidad: 1,
            aplicacion: 'Aplicar cada mañana',
            estado: 'INDICADO',
          },
        ],
      },
    },
  });

  await prisma.prescripcion.create({
    data: {
      pacienteId: pacientes[4].id,
      usuarioId: medico.id,
      fecha: haceTresDias,
      nombre: 'Preparación láser manchas',
      items: {
        create: [
          {
            nombre: 'Lactic Acid 10% + HA',
            cantidad: 1,
            aplicacion: 'Suspender 1 semana antes del láser',
            estado: 'EN_USO',
          },
        ],
      },
    },
  });

  // ========== COBROS (15) ==========
  await prisma.cobro.create({
    data: {
      pacienteId: pacientes[0].id,
      consultaId: consultas[0].id,
      fecha: haceUnMes,
      subtotal: 850,
      total: 850,
      estado: 'PAGADO',
      items: {
        create: [
          {
            tipo: 'SERVICIO',
            nombre: 'Limpieza profunda + Peeling químico',
            cantidad: 1,
            precioUnitario: 650,
            subtotal: 650,
          },
          {
            tipo: 'PRODUCTO',
            productoId: productos[0].id,
            nombre: 'Ácido Hialurónico 2%',
            cantidad: 1,
            precioUnitario: 280,
            subtotal: 280,
          },
        ],
      },
      pagos: {
        create: [
          {
            fecha: haceUnMes,
            monto: 850,
            metodoPago: 'TARJETA',
            referencia: 'VISA **** 1234',
          },
        ],
      },
    },
  });

  await prisma.cobro.create({
    data: {
      pacienteId: pacientes[1].id,
      consultaId: consultas[1].id,
      fecha: haceTresDias,
      subtotal: 1195,
      total: 1195,
      estado: 'PARCIAL',
      items: {
        create: [
          {
            tipo: 'SERVICIO',
            nombre: 'Terapia LED azul + Extracción',
            cantidad: 1,
            precioUnitario: 450,
            subtotal: 450,
          },
          {
            tipo: 'PRODUCTO',
            productoId: productos[2].id,
            nombre: 'Effaclar Duo (+)',
            cantidad: 2,
            precioUnitario: 385,
            subtotal: 770,
          },
        ],
      },
      pagos: {
        create: [
          {
            fecha: haceTresDias,
            monto: 600,
            metodoPago: 'EFECTIVO',
            notas: 'Pago inicial, saldo pendiente 595 Bs',
          },
        ],
      },
    },
  });

  await prisma.cobro.create({
    data: {
      pacienteId: pacientes[3].id,
      fecha: ahora,
      subtotal: 3200,
      total: 3200,
      estado: 'PENDIENTE',
      items: {
        create: [
          {
            tipo: 'PAQUETE',
            nombre: 'Paquete Criolipólisis (4 sesiones)',
            cantidad: 1,
            precioUnitario: 3200,
            subtotal: 3200,
          },
        ],
      },
    },
  });

  await prisma.cobro.create({
    data: {
      pacienteId: pacientes[5].id,
      consultaId: consultas[2].id,
      fecha: haceDosSemanas,
      subtotal: 970,
      total: 970,
      estado: 'PAGADO',
      items: {
        create: [
          {
            tipo: 'SERVICIO',
            nombre: 'Hydrafacial',
            cantidad: 1,
            precioUnitario: 485,
            subtotal: 485,
          },
          {
            tipo: 'PRODUCTO',
            productoId: productos[10].id,
            nombre: 'Hyalu B5 Sérum',
            cantidad: 1,
            precioUnitario: 485,
            subtotal: 485,
          },
        ],
      },
      pagos: {
        create: [
          {
            fecha: haceDosSemanas,
            monto: 970,
            metodoPago: 'TRANSFERENCIA',
            referencia: 'TRF-20260519-001',
          },
        ],
      },
    },
  });

  await prisma.cobro.create({
    data: {
      pacienteId: pacientes[6].id,
      consultaId: consultas[3].id,
      fecha: haceUnaSemana,
      subtotal: 850,
      total: 850,
      estado: 'PAGADO',
      items: {
        create: [
          {
            tipo: 'SERVICIO',
            nombre: 'Radiofrecuencia corporal papada',
            cantidad: 1,
            precioUnitario: 850,
            subtotal: 850,
          },
        ],
      },
      pagos: {
        create: [
          {
            fecha: haceUnaSemana,
            monto: 850,
            metodoPago: 'EFECTIVO',
          },
        ],
      },
    },
  });

  await prisma.cobro.create({
    data: {
      pacienteId: pacientes[7].id,
      consultaId: consultas[4].id,
      fecha: haceUnMes,
      subtotal: 1950,
      total: 1950,
      estado: 'PAGADO',
      items: {
        create: [
          {
            tipo: 'SERVICIO',
            nombre: 'Microagujas + PRP',
            cantidad: 1,
            precioUnitario: 1585,
            subtotal: 1585,
          },
          {
            tipo: 'PRODUCTO',
            productoId: productos[11].id,
            nombre: 'Cicaplast Baume B5+',
            cantidad: 1,
            precioUnitario: 365,
            subtotal: 365,
          },
        ],
      },
      pagos: {
        create: [
          {
            fecha: haceUnMes,
            monto: 1950,
            metodoPago: 'TARJETA',
            referencia: 'MC **** 5678',
          },
        ],
      },
    },
  });

  await prisma.cobro.create({
    data: {
      pacienteId: pacientes[8].id,
      consultaId: consultas[5].id,
      fecha: haceDosSemanas,
      subtotal: 1540,
      total: 1540,
      estado: 'PARCIAL',
      items: {
        create: [
          {
            tipo: 'SERVICIO',
            nombre: 'Peeling TCA 15%',
            cantidad: 1,
            precioUnitario: 885,
            subtotal: 885,
          },
          {
            tipo: 'PRODUCTO',
            productoId: productos[11].id,
            nombre: 'Cicaplast Baume B5+',
            cantidad: 1,
            precioUnitario: 365,
            subtotal: 365,
          },
          {
            tipo: 'PRODUCTO',
            productoId: productos[6].id,
            nombre: 'Alpha Arbutin 2% + HA',
            cantidad: 1,
            precioUnitario: 290,
            subtotal: 290,
          },
        ],
      },
      pagos: {
        create: [
          {
            fecha: haceDosSemanas,
            monto: 1000,
            metodoPago: 'EFECTIVO',
            notas: 'Saldo pendiente: 540 Bs',
          },
        ],
      },
    },
  });

  await prisma.cobro.create({
    data: {
      pacienteId: pacientes[9].id,
      consultaId: consultas[6].id,
      fecha: haceUnaSemana,
      subtotal: 1850,
      total: 1850,
      estado: 'PAGADO',
      items: {
        create: [
          {
            tipo: 'SERVICIO',
            nombre: 'Relleno labial con ácido hialurónico',
            cantidad: 1,
            precioUnitario: 1850,
            subtotal: 1850,
          },
        ],
      },
      pagos: {
        create: [
          {
            fecha: haceUnaSemana,
            monto: 1850,
            metodoPago: 'TRANSFERENCIA',
            referencia: 'TRF-20260526-002',
          },
        ],
      },
    },
  });

  await prisma.cobro.create({
    data: {
      pacienteId: pacientes[10].id,
      consultaId: consultas[7].id,
      fecha: haceTresDias,
      subtotal: 715,
      total: 715,
      estado: 'PAGADO',
      items: {
        create: [
          {
            tipo: 'SERVICIO',
            nombre: 'Depilación láser axilas - Sesión 3',
            cantidad: 1,
            precioUnitario: 320,
            subtotal: 320,
          },
          {
            tipo: 'PRODUCTO',
            productoId: productos[8].id,
            nombre: 'Anthelios UV Mune 400',
            cantidad: 1,
            precioUnitario: 395,
            subtotal: 395,
          },
        ],
      },
      pagos: {
        create: [
          {
            fecha: haceTresDias,
            monto: 715,
            metodoPago: 'TARJETA',
            referencia: 'VISA **** 9012',
          },
        ],
      },
    },
  });

  await prisma.cobro.create({
    data: {
      pacienteId: pacientes[11].id,
      consultaId: consultas[8].id,
      fecha: haceDosSemanas,
      subtotal: 2180,
      total: 2180,
      estado: 'PAGADO',
      items: {
        create: [
          {
            tipo: 'SERVICIO',
            nombre: 'Relleno ojeras con ácido hialurónico',
            cantidad: 1,
            precioUnitario: 1500,
            subtotal: 1500,
          },
          {
            tipo: 'PRODUCTO',
            productoId: productos[9].id,
            nombre: 'Peptide Complex Serum',
            cantidad: 1,
            precioUnitario: 680,
            subtotal: 680,
          },
        ],
      },
      pagos: {
        create: [
          {
            fecha: haceDosSemanas,
            monto: 2180,
            metodoPago: 'TRANSFERENCIA',
            referencia: 'TRF-20260520-003',
          },
        ],
      },
    },
  });

  await prisma.cobro.create({
    data: {
      pacienteId: pacientes[12].id,
      consultaId: consultas[9].id,
      fecha: haceUnMes,
      subtotal: 5400,
      total: 5400,
      estado: 'PARCIAL',
      items: {
        create: [
          {
            tipo: 'PAQUETE',
            nombre: 'Mesoterapia lipolítica abdominal (6 sesiones)',
            cantidad: 1,
            precioUnitario: 5400,
            subtotal: 5400,
          },
        ],
      },
      pagos: {
        create: [
          {
            fecha: haceUnMes,
            monto: 2700,
            metodoPago: 'EFECTIVO',
            notas: 'Pago 50%, saldo: 2700 Bs',
          },
        ],
      },
    },
  });

  await prisma.cobro.create({
    data: {
      pacienteId: pacientes[13].id,
      consultaId: consultas[10].id,
      fecha: haceUnaSemana,
      subtotal: 1250,
      total: 1250,
      estado: 'PAGADO',
      items: {
        create: [
          {
            tipo: 'SERVICIO',
            nombre: 'Radiofrecuencia facial',
            cantidad: 1,
            precioUnitario: 950,
            subtotal: 950,
          },
          {
            tipo: 'PRODUCTO',
            productoId: productos[3].id,
            nombre: 'Retinol 0.5% en Squalane',
            cantidad: 1,
            precioUnitario: 300,
            subtotal: 300,
          },
        ],
      },
      pagos: {
        create: [
          {
            fecha: haceUnaSemana,
            monto: 1250,
            metodoPago: 'TARJETA',
            referencia: 'AMEX **** 3456',
          },
        ],
      },
    },
  });

  await prisma.cobro.create({
    data: {
      pacienteId: pacientes[2].id,
      consultaId: consultas[11].id,
      fecha: new Date(citas[3].fecha),
      subtotal: 935,
      total: 935,
      estado: 'PAGADO',
      items: {
        create: [
          {
            tipo: 'SERVICIO',
            nombre: 'Mesoterapia capilar - Sesión 4',
            cantidad: 1,
            precioUnitario: 450,
            subtotal: 450,
          },
          {
            tipo: 'PRODUCTO',
            productoId: productos[13].id,
            nombre: 'Kerium DS Shampoo',
            cantidad: 1,
            precioUnitario: 285,
            subtotal: 285,
          },
          {
            tipo: 'PRODUCTO',
            nombre: 'Minoxidil 5%',
            cantidad: 1,
            precioUnitario: 200,
            subtotal: 200,
          },
        ],
      },
      pagos: {
        create: [
          {
            fecha: new Date(citas[3].fecha),
            monto: 935,
            metodoPago: 'EFECTIVO',
          },
        ],
      },
    },
  });

  await prisma.cobro.create({
    data: {
      pacienteId: pacientes[14].id,
      fecha: ahora,
      subtotal: 680,
      total: 680,
      estado: 'PENDIENTE',
      items: {
        create: [
          {
            tipo: 'PRODUCTO',
            productoId: productos[4].id,
            nombre: 'Niacinamida 10% + Zinc 1%',
            cantidad: 1,
            precioUnitario: 245,
            subtotal: 245,
          },
          {
            tipo: 'PRODUCTO',
            productoId: productos[8].id,
            nombre: 'Anthelios UV Mune 400',
            cantidad: 1,
            precioUnitario: 395,
            subtotal: 395,
          },
        ],
      },
    },
  });

  await prisma.cobro.create({
    data: {
      pacienteId: pacientes[4].id,
      fecha: haceTresDias,
      subtotal: 1250,
      total: 1250,
      estado: 'PENDIENTE',
      items: {
        create: [
          {
            tipo: 'SERVICIO',
            nombre: 'Consulta evaluación láser manchas',
            cantidad: 1,
            precioUnitario: 250,
            subtotal: 250,
          },
          {
            tipo: 'PAQUETE',
            nombre: 'Paquete láser Q-Switched (4 sesiones)',
            cantidad: 1,
            precioUnitario: 1000,
            subtotal: 1000,
          },
        ],
      },
    },
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
