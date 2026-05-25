export { usePacientes } from './hooks/usePacientes';
export type { Paciente } from './hooks/usePacientes';
export { usePacienteCobros } from './hooks/usePacienteCobros';
export type {
  CobroItem,
  CobroPago,
  CobroRaw,
  CobroRow,
  CobroTotales,
  CrearCobroPayload,
} from './hooks/usePacienteCobros';
export { usePacienteSaldo } from './hooks/usePacienteSaldo';
export { usePacienteProtocolos } from './hooks/usePacienteProtocolos';
export type {
  PrescripcionItem,
  Prescripcion,
  NuevaPrescripcionItem,
} from './hooks/usePacienteProtocolos';
export { calcularEdad } from './lib/paciente';
export { PacientesListView } from './components/PacientesListView';
export { PacienteForm } from './components/PacienteForm';
export { PacienteHistoriaView } from './components/PacienteHistoriaView';
export { ConsultaForm } from './components/ConsultaForm';
export { RecetaConsultaForm } from './components/RecetaConsultaForm';
