// Constantes del sistema clínico

// Colores oficiales de la clínica
export const COLORES = {
  piel: '#ccaf7d',
  morena: '#754c24',
  marengo: '#666666',
  concreto: '#333333',
} as const;

// Estados de pacientes
export const ESTADOS_PACIENTE = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
} as const;

// Estados de citas
export const ESTADOS_CITA = {
  PROGRAMADA: 'Programada',
  CONFIRMADA: 'Confirmada',
  EN_CURSO: 'En curso',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
  NO_ASISTIO: 'No asistió',
} as const;

// Estados de cobros
export const ESTADOS_COBRO = {
  PENDIENTE: 'Pendiente',
  PARCIAL: 'Pago parcial',
  PAGADO: 'Pagado',
  CANCELADO: 'Cancelado',
} as const;

// Métodos de pago
export const METODOS_PAGO = {
  EFECTIVO: 'Efectivo',
  TARJETA: 'Tarjeta',
  TRANSFERENCIA: 'Transferencia',
  OTRO: 'Otro',
} as const;

// Tipos de documento
export const TIPOS_DOCUMENTO = {
  DNI: 'DNI',
  PASAPORTE: 'Pasaporte',
  OTRO: 'Otro',
} as const;

// Tipos de documento/archivo
export const TIPOS_ARCHIVO = {
  FOTO: 'Foto',
  DOCUMENTO: 'Documento',
} as const;

// Estados de protocolo/item
export const ESTADOS_PROTOCOLO = {
  INDICADO: 'Indicado',
  ADQUIRIDO: 'Adquirido',
  EN_USO: 'En Uso',
  COMPLETADO: 'Completado',
} as const;

// Tipos de tratamiento
export const TIPOS_TRATAMIENTO = {
  FACIAL: 'Facial',
  CORPORAL: 'Corporal',
  CAPILAR: 'Capilar',
  COMBINADO: 'Combinado',
} as const;

// Tipos de producto
export const TIPOS_PRODUCTO = {
  COSMECEUTICO: 'Cosmecéutico (Profesional)',
  DERMOCOSMETICO: 'Dermocosmétic o',
  EQUIPO: 'Equipo',
  INSUMO: 'Insumo',
} as const;

// Roles de usuario
export const ROLES_USUARIO = {
  ADMIN: 'Administrador',
  TERAPEUTA: 'Terapeuta',
  RECEPCIONISTA: 'Recepcionista',
} as const;

// Configuración de paginación
export const PAGINACION = {
  PAGE_SIZE_DEFAULT: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Configuración de horarios
export const HORARIOS = {
  HORA_INICIO: '08:00',
  HORA_FIN: '20:00',
  DURACION_CITA_DEFAULT: 30, // minutos
  INTERVALO_HORARIO: 15, // minutos
} as const;

// Navegación del sistema
export const RUTAS = {
  // Públicas
  public: {
    home: '/',
    sobreNosotros: '/sobre-nosotros',
    servicios: '/servicios',
    contacto: '/contacto',
  },
  // Autenticación
  auth: {
    login: '/login',
    registro: '/registro',
    logout: '/api/auth/logout',
  },
  // Dashboard
  dashboard: {
    home: '/dashboard',
    pacientes: '/pacientes',
    pacienteNuevo: '/pacientes/nuevo',
    pacienteDetalle: (id: string) => `/pacientes/${id}`,
    historiaClinica: '/historia-clinica',
    citas: '/citas',
    citaNueva: '/citas/nueva',
    cobros: '/cobros',
    cobroNuevo: '/cobros/nuevo',
    recetas: '/recetas',
    recetaNueva: '/recetas/nueva',
    reportes: '/reportes',
    configuracion: '/configuracion',
  },
  // API
  api: {
    pacientes: '/api/pacientes',
    citas: '/api/citas',
    cobros: '/api/cobros',
    recetas: '/api/recetas',
    archivos: '/api/archivos',
    reportes: '/api/reportes',
  },
} as const;

// Mensajes del sistema
export const MENSAJES = {
  success: {
    crear: '¡Registro creado exitosamente!',
    actualizar: '¡Registro actualizado exitosamente!',
    eliminar: '¡Registro eliminado exitosamente!',
    guardar: '¡Guardado exitosamente!',
  },
  error: {
    general: 'Ocurrió un error. Por favor, intenta nuevamente.',
    crear: 'Error al crear el registro.',
    actualizar: 'Error al actualizar el registro.',
    eliminar: 'Error al eliminar el registro.',
    cargar: 'Error al cargar los datos.',
    camposRequeridos: 'Por favor, completa todos los campos requeridos.',
    noAutorizado: 'No tienes autorización para realizar esta acción.',
  },
  confirmacion: {
    eliminar: '¿Estás seguro de que deseas eliminar este registro?',
    cancelar: '¿Estás seguro de que deseas cancelar los cambios?',
  },
} as const;

// Expresiones regulares para validación
export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  telefono: /^\+?[\d\s-()]+$/,
  dni: /^\d{7,8}$/,
  soloNumeros: /^\d+$/,
  soloLetras: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
} as const;

// Límites del sistema
export const LIMITES = {
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_UPLOADS_POR_PACIENTE: 50,
  MAX_CARACTERES_NOTAS: 5000,
  MAX_CARACTERES_DESCRIPCION: 500,
  MIN_STOCK_ALERTA: 5,
} as const;

// Formatos de fecha
export const FORMATOS_FECHA = {
  date: 'DD/MM/YYYY',
  datetime: 'DD/MM/YYYY HH:mm',
  time: 'HH:mm',
  monthYear: 'MM/YYYY',
} as const;
