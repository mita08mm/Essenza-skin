// Tipos compartidos entre frontend y backend

export interface Usuario {
  id: string;
  email: string;
  rol: 'ADMIN' | 'MEDICO' | 'RECEPCIONISTA';
  nombre: string;
  apellido: string;
  activo: boolean;
}

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  tipoDocumento: 'DNI' | 'PASAPORTE' | 'OTRO';
  fechaNacimiento: Date;
  telefono: string;
  email?: string;
  direccion?: string;
  estado: 'ACTIVO' | 'INACTIVO';
  sexo?: string;
  grupoSanguineo?: string;
  peso?: number;
  altura?: number;
  alergias?: string;
  contactoEmergenciaNombre?: string;
  contactoEmergenciaTelefono?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}
