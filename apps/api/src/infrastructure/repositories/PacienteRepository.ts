import { PrismaClient, Paciente, TipoDocumento, EstadoPaciente } from '@clinica/database';

export interface CreatePacienteInput {
  nombre: string;
  apellido: string;
  documento: string;
  tipoDocumento: TipoDocumento;
  fechaNacimiento: Date;
  telefono: string;
  email?: string;
  direccion?: string;
  sexo?: string;
  grupoSanguineo?: string;
  peso?: number;
  altura?: number;
  alergias?: string;
  contactoEmergenciaNombre?: string;
  contactoEmergenciaTelefono?: string;
  fotoUrl?: string;
}

export interface UpdatePacienteInput {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  sexo?: string;
  grupoSanguineo?: string;
  peso?: number;
  altura?: number;
  alergias?: string;
  contactoEmergenciaNombre?: string;
  contactoEmergenciaTelefono?: string;
  fotoUrl?: string;
  estado?: EstadoPaciente;
}

export class PacienteRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreatePacienteInput): Promise<Paciente> {
    return this.prisma.paciente.create({
      data,
    });
  }

  async findAll(): Promise<Paciente[]> {
    return this.prisma.paciente.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Paciente | null> {
    return this.prisma.paciente.findUnique({
      where: { id },
      include: {
        historiaClinica: true,
        citas: {
          orderBy: { fecha: 'desc' },
          take: 5,
        },
        cobros: {
          orderBy: { fecha: 'desc' },
          take: 5,
        },
      },
    });
  }

  async findByDocumento(documento: string, tipoDocumento: TipoDocumento): Promise<Paciente | null> {
    return this.prisma.paciente.findUnique({
      where: {
        documento_tipoDocumento: {
          documento,
          tipoDocumento,
        },
      },
    });
  }

  async update(id: string, data: UpdatePacienteInput): Promise<Paciente> {
    return this.prisma.paciente.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Paciente> {
    return this.prisma.paciente.update({
      where: { id },
      data: { estado: 'INACTIVO' },
    });
  }

  async search(query: string): Promise<Paciente[]> {
    return this.prisma.paciente.findMany({
      where: {
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { apellido: { contains: query, mode: 'insensitive' } },
          { documento: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
