'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/shared/layout/PageHeader';
import { FormSection, FormField } from '@/shared/forms/FormSection';
import DatePicker from '@/shared/ui/DatePicker';
import { api, ApiError } from '@/shared/api';
import { inputBase, textareaBase, alertError, Button, LinkButton, Modal } from '@/shared/ui';
import { Trash2 } from 'lucide-react';
type FormState = {
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  documento: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  direccion: string;
  sexo: string;
  objetivoEstetico: string;
  alergias: string;
  condicionesMedicas: string;
  medicacionActual: string;
  embarazoLactancia: boolean;
  contactoEmergenciaNombre: string;
  contactoEmergenciaTelefono: string;
};

const EMPTY: FormState = {
  nombre: '',
  apellido: '',
  tipoDocumento: 'CI',
  documento: '',
  fechaNacimiento: '',
  telefono: '',
  email: '',
  direccion: '',
  sexo: '',
  objetivoEstetico: '',
  alergias: '',
  condicionesMedicas: '',
  medicacionActual: '',
  embarazoLactancia: false,
  contactoEmergenciaNombre: '',
  contactoEmergenciaTelefono: '',
};

function calcularEdad(fecha: string) {
  if (!fecha) return '—';
  const hoy = new Date();
  const nac = new Date(fecha);
  const edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  const final = m < 0 || (m === 0 && hoy.getDate() < nac.getDate()) ? edad - 1 : edad;
  return `${final} años`;
}

export function PacienteForm({
  mode,
  pacienteId,
}: {
  mode: 'create' | 'edit';
  pacienteId?: string;
}) {
  const router = useRouter();
  const isEdit = mode === 'edit';
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormState>(EMPTY);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (!isEdit || !pacienteId) return;
    (async () => {
      try {
        const p = await api.get<Record<string, unknown> & { fechaNacimiento?: string }>(
          `/pacientes/${pacienteId}`,
        );
        setFormData({
          nombre: (p.nombre as string) ?? '',
          apellido: (p.apellido as string) ?? '',
          tipoDocumento: (p.tipoDocumento as string) ?? 'CI',
          documento: (p.documento as string) ?? '',
          fechaNacimiento: p.fechaNacimiento?.slice(0, 10) ?? '',
          telefono: (p.telefono as string) ?? '',
          email: (p.email as string) ?? '',
          direccion: (p.direccion as string) ?? '',
          sexo: (p.sexo as string) ?? '',
          objetivoEstetico: (p.objetivoEstetico as string) ?? '',
          alergias: (p.alergias as string) ?? '',
          condicionesMedicas: (p.condicionesMedicas as string) ?? '',
          medicacionActual: (p.medicacionActual as string) ?? '',
          embarazoLactancia: (p.embarazoLactancia as boolean) ?? false,
          contactoEmergenciaNombre: (p.contactoEmergenciaNombre as string) ?? '',
          contactoEmergenciaTelefono: (p.contactoEmergenciaTelefono as string) ?? '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsFetching(false);
      }
    })();
  }, [isEdit, pacienteId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'sexo' && value !== 'FEMENINO') {
      setFormData({ ...formData, [name]: value, embarazoLactancia: false });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      console.log('Enviando datos:', formData);
      if (isEdit && pacienteId) {
        await api.patch(`/pacientes/${pacienteId}`, formData);
      } else {
        await api.post('/pacientes', formData);
      }
      router.push('/pacientes');
    } catch (err) {
      console.error('Error al guardar paciente:', err);
      let errorMessage = isEdit ? 'Error al actualizar paciente' : 'Error al crear paciente';
      
      if (err instanceof ApiError) {
        errorMessage = err.message;
        // Si hay detalles de validación, agregarlos al mensaje
        if (err.details && typeof err.details === 'object' && 'details' in err.details) {
          const validationErrors = (err.details as { details?: unknown }).details;
          if (Array.isArray(validationErrors)) {
            const errorList = validationErrors.map((e: { path: string[]; message: string }) => `${e.path.join('.')}: ${e.message}`).join(', ');
            errorMessage += ` - ${errorList}`;
          }
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!pacienteId) return;
    try {
      setIsDeleting(true);
      setDeleteError('');
      await api.delete(`/pacientes/${pacienteId}`);
      router.push('/pacientes');
    } catch (err) {
      setDeleteError(
        err instanceof ApiError ? err.message : 'Error al eliminar paciente'
      );
      setIsDeleting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="subtitle flex min-h-[400px] items-center justify-center">
        Cargando datos del paciente...
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <PageHeader
        overline="Pacientes"
        title={isEdit ? 'Editar paciente' : 'Nuevo paciente'}
        subtitle={
          isEdit
            ? `${formData.nombre} ${formData.apellido}`.trim() || 'Modificar datos del paciente'
            : 'Datos personales, clínicos y contacto de emergencia'
        }
        backHref="/pacientes"
      />

      {error && <div className={`mb-5 ${alertError}`}>{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormSection title="Datos personales">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField label="Nombre" required>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Ana"
                className={inputBase}
                required
                disabled={isLoading}
              />
            </FormField>
            <FormField label="Apellido" required>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ej. García"
                className={inputBase}
                required
                disabled={isLoading}
              />
            </FormField>
            <FormField label="Tipo de documento" required>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className={inputBase}
                required
                disabled={isLoading}
              >
                <option value="CI">CI (Cédula de identidad)</option>
                <option value="PASAPORTE">Pasaporte (Extranjero)</option>
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField label="Número de documento" required>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                placeholder="00000000X"
                className={inputBase}
                required
                disabled={isLoading}
              />
            </FormField>
            <DatePicker
              label="Fecha de nacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              required
              disabled={isLoading}
              maxDate={new Date()}
            />
            <FormField label="Edad">
              <input
                type="text"
                value={calcularEdad(formData.fechaNacimiento)}
                className={inputBase}
                disabled
                readOnly
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Teléfono" required>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="799..."
                className={inputBase}
                required
                disabled={isLoading}
              />
            </FormField>
            <FormField label="Email">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@mail.com"
                className={inputBase}
                disabled={isLoading}
              />
            </FormField>
          </div>

          <FormField label="Dirección">
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Calle, Ciudad, Provincia"
              className={inputBase}
              disabled={isLoading}
            />
          </FormField>
        </FormSection>

        <FormSection
          title="Datos clínicos"
          description="Información clínica relevante del paciente"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Sexo / género" required>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className={inputBase}
                required
                disabled={isLoading}
              >
                <option value="">Seleccionar</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="OTRO">Otro</option>
              </select>
            </FormField>
            <FormField label="Objetivo principal">
              <input
                type="text"
                name="objetivoEstetico"
                value={formData.objetivoEstetico}
                onChange={handleChange}
                placeholder="Ej: Rejuvenecimiento facial..."
                className={inputBase}
                disabled={isLoading}
              />
            </FormField>
          </div>

          <FormField label="Alergias conocidas">
            <textarea
              name="alergias"
              value={formData.alergias}
              onChange={handleChange}
              placeholder="Alergias a productos, sustancias o medicamentos"
              className={textareaBase}
              rows={2}
              disabled={isLoading}
            />
          </FormField>
          <FormField label="Condiciones médicas relevantes">
            <textarea
              name="condicionesMedicas"
              value={formData.condicionesMedicas}
              onChange={handleChange}
              placeholder="Diabetes, hipertensión..."
              className={textareaBase}
              rows={2}
              disabled={isLoading}
            />
          </FormField>
          <FormField label="Medicación actual">
            <textarea
              name="medicacionActual"
              value={formData.medicacionActual}
              onChange={handleChange}
              placeholder="Medicamentos que toma regularmente"
              className={textareaBase}
              rows={2}
              disabled={isLoading}
            />
          </FormField>

          {formData.sexo === 'FEMENINO' && (
            <label className="flex cursor-pointer items-center gap-3 pt-1">
              <input
                type="checkbox"
                name="embarazoLactancia"
                checked={formData.embarazoLactancia}
                onChange={(e) => setFormData({ ...formData, embarazoLactancia: e.target.checked })}
                className="accent-brand-morena h-4 w-4 rounded border-neutral-300"
                disabled={isLoading}
              />
              <span className="body">¿Embarazo o lactancia?</span>
            </label>
          )}
        </FormSection>

        <FormSection title="Contacto de emergencia">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Nombre completo">
              <input
                type="text"
                name="contactoEmergenciaNombre"
                value={formData.contactoEmergenciaNombre}
                onChange={handleChange}
                placeholder="Nombre del contacto"
                className={inputBase}
                disabled={isLoading}
              />
            </FormField>
            <FormField label="Teléfono">
              <input
                type="tel"
                name="contactoEmergenciaTelefono"
                value={formData.contactoEmergenciaTelefono}
                onChange={handleChange}
                placeholder="797..."
                className={inputBase}
                disabled={isLoading}
              />
            </FormField>
          </div>
        </FormSection>

        <div className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-5">
          {isEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="text-danger hover:bg-danger-bg hover:border-danger gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar paciente
            </Button>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <LinkButton href="/pacientes" variant="secondary" size="sm">
              Cancelar
            </LinkButton>
            <Button type="submit" disabled={isLoading} variant="primary" size="sm">
              {isLoading
                ? isEdit
                  ? 'Actualizando...'
                  : 'Guardando...'
                : isEdit
                  ? 'Actualizar paciente'
                  : 'Guardar paciente'}
            </Button>
          </div>
        </div>
      </form>

      {isEdit && (
        <Modal
          open={showDeleteModal}
          onClose={() => !isDeleting && setShowDeleteModal(false)}
          title="Eliminar paciente permanentemente"
          description={`¿Estás seguro de que deseas eliminar a ${formData.nombre} ${formData.apellido}? Esta acción es PERMANENTE y no se puede deshacer.`}
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleDelete}
                isLoading={isDeleting}
                className="bg-danger hover:bg-danger/90 flex-1 sm:flex-none"
              >
                Eliminar permanentemente
              </Button>
            </>
          }
        >
          {deleteError && (
            <div className="alert-danger mb-4 text-sm">{deleteError}</div>
          )}
          <div className="text-sm text-neutral-600">
            <p className="mb-2 font-medium text-neutral-900">Se eliminará permanentemente:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Historia clínica completa</li>
              <li>Todas las consultas y prescripciones</li>
              <li>Todas las citas</li>
              <li>Todos los cobros y pagos</li>
              <li>Todos los documentos y archivos</li>
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
}
