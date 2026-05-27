export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  documento: string;
  sexo?: string;
  createdAt: string;
  objetivoEstetico?: string;
  alergias?: string;
  embarazoLactancia?: boolean;
}

export interface ItemProtocolo {
  id: string;
  nombre: string;
  cantidad?: number;
  aplicacion?: string;
  indicaciones?: string;
  estado: 'INDICADO' | 'ADQUIRIDO' | 'EN_USO' | 'COMPLETADO';
}

export interface Protocolo {
  id: string;
  nombre?: string;
  fecha: string;
  indicaciones?: string;
  items: ItemProtocolo[];
}

export interface Documento {
  id: string;
  nombre: string;
  kind: 'FOTO' | 'DOCUMENTO';
  url: string;
  createdAt: string;
}

export interface Tratamiento {
  id: string;
  fecha: string;
  tipoTratamiento: 'FACIAL' | 'CORPORAL' | 'CAPILAR' | 'COMBINADO';
  nombreTratamiento: string;
  zonaTratada?: string;
  objetivo?: string;
  evaluacionInicial?: string;
  protocolo?: string;
  observaciones?: string;
  proximaSesion?: string;
  usuario: {
    nombre: string;
    apellido?: string;
    rol: 'ADMIN' | 'TERAPEUTA' | 'RECEPCIONISTA';
  };
  protocolos?: Protocolo[];
  documentos?: Documento[];
}

export interface HistoriaClinica {
  id: string;
  tipoSangre?: string;
  objetivoEstetico?: string;
  condicionesMedicas?: string;
  medicacionActual?: string;
  alergias?: string;
  embarazoLactancia?: boolean;
  antecedentesPersonales?: string;
  antecedentesFamiliares?: string;
  antecedentesQuirurgicos?: string;
  paciente: Paciente;
  tratamientos: Tratamiento[];
}

export type TabType = 'tratamientos' | 'protocolos' | 'documentos' | 'resumen';
