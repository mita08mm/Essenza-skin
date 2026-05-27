export interface ConfigClinica {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  nit?: string | null;
  ciudad?: string | null;
  pais?: string | null;
  logo?: string | null;
}
