'use client';

import { useMemo, useState } from 'react';
import PanelFrame, { PanelActionButton } from './PanelFrame';
import {
  Button,
  Input,
  Label,
  Modal,
  Spinner,
  PlusIcon,
  BodyStrong,
  Muted,
  Overline,
} from '@/shared/ui';
import { usePacienteCobros, CobroRow } from '@/features/pacientes';

interface PagosHistoryProps {
  pacienteId: string;
}

interface CobroForm {
  titulo: string;
  costo: string;
  pagado: string;
}

const initialForm: CobroForm = { titulo: '', costo: '', pagado: '' };
const fmt = (n: number) => `Bs. ${n.toFixed(2)}`;

export default function PagosHistory({ pacienteId }: PagosHistoryProps) {
  const {
    cobros,
    totales,
    isLoading,
    error: loadError,
    crearCobro,
  } = usePacienteCobros(pacienteId);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CobroForm>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const preview = useMemo(() => {
    const costo = Number(form.costo) || 0;
    const pagado = Number(form.pagado) || 0;
    return { total: costo, pendiente: Math.max(costo - pagado, 0) };
  }, [form.costo, form.pagado]);

  const closeModal = () => {
    setShowModal(false);
    setForm(initialForm);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const titulo = form.titulo.trim();
    const costo = Number(form.costo);
    const pagado = Number(form.pagado || 0);

    if (!titulo) return setError('Ingrese un título');
    if (Number.isNaN(costo) || costo <= 0) return setError('El costo debe ser mayor a 0');
    if (Number.isNaN(pagado) || pagado < 0) return setError('Lo pagado no puede ser negativo');
    if (pagado > costo) return setError('Lo pagado no puede ser mayor al total');

    try {
      setIsSaving(true);
      setError('');
      await crearCobro({ titulo, costo, pagado });
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar cobro');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PanelFrame
      title="Cobros"
      description={
        cobros.length === 0
          ? undefined
          : `${cobros.length} ${cobros.length === 1 ? 'registro' : 'registros'}`
      }
      action={
        <PanelActionButton onClick={() => setShowModal(true)} title="Nuevo cobro">
          <PlusIcon className="h-4 w-4" />
        </PanelActionButton>
      }
      contentClassName="px-0 py-0"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      ) : loadError ? (
        <div className="text-danger px-5 py-4 text-sm">{loadError}</div>
      ) : cobros.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <BodyStrong as="p">Sin cobros registrados</BodyStrong>
          <p className="muted mt-1">Usa el botón + para añadir el primero</p>
        </div>
      ) : (
        <>
          <div className="bg-neutral-25 grid grid-cols-3 divide-x divide-neutral-100 border-b border-neutral-100">
            <Totals label="Total" value={totales.costoTotal} />
            <Totals label="Pagado" value={totales.pagadoTotal} tone="success" />
            <Totals
              label="Pendiente"
              value={totales.pendienteTotal}
              tone={totales.pendienteTotal > 0 ? 'warning' : 'success'}
            />
          </div>
          <ul className="divide-y divide-neutral-100">
            {cobros.map((c) => (
              <CobroLi key={c.id} cobro={c} />
            ))}
          </ul>
        </>
      )}

      <Modal
        open={showModal}
        onClose={closeModal}
        title="Nuevo cobro"
        description="Registra un cargo y opcionalmente un pago inicial"
        footer={
          <>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" form="cobro-form" variant="primary" isLoading={isSaving}>
              Guardar
            </Button>
          </>
        }
      >
        <form id="cobro-form" onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="alert-danger text-xs">{error}</div>}

          <div>
            <Label htmlFor="titulo" required>
              Título
            </Label>
            <Input
              id="titulo"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Ej: Limpieza facial, sérum reparador"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="costo" required>
                Costo (Bs.)
              </Label>
              <Input
                id="costo"
                type="number"
                min="0"
                step="0.01"
                value={form.costo}
                onChange={(e) => setForm({ ...form, costo: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="pagado">Pagado (Bs.)</Label>
              <Input
                id="pagado"
                type="number"
                min="0"
                step="0.01"
                value={form.pagado}
                onChange={(e) => setForm({ ...form, pagado: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-neutral-100 pt-2">
            <PreviewRow label="Total" value={fmt(preview.total)} />
            <PreviewRow
              label="Pendiente"
              value={fmt(preview.pendiente)}
              tone={preview.pendiente > 0 ? 'warning' : 'success'}
            />
          </div>
        </form>
      </Modal>
    </PanelFrame>
  );
}

function Totals({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: 'success' | 'warning';
}) {
  const color =
    tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning' : 'text-neutral-900';
  return (
    <div className="px-4 py-3 text-center">
      <Overline>{label}</Overline>
      <p className={`font-heading mt-1 text-base font-medium ${color}`}>{fmt(value)}</p>
    </div>
  );
}

function CobroLi({ cobro }: { cobro: CobroRow }) {
  return (
    <li className="flex items-center gap-3 px-5 py-3">
      <div className="min-w-0 flex-1">
        <p className="body-strong truncate text-neutral-900">{cobro.titulo}</p>
        <p className="mt-0.5 text-[11px] tracking-wide text-neutral-500 uppercase">
          {cobro.tipo === 'PRODUCTO' ? 'Producto' : 'Servicio'} · {fmt(cobro.costo)}
        </p>
      </div>
      {cobro.pendiente > 0 ? (
        <div className="text-right">
          <Muted>Pendiente</Muted>
          <p className="text-warning text-sm font-semibold">{fmt(cobro.pendiente)}</p>
        </div>
      ) : (
        <div className="text-right">
          <Muted>Pagado</Muted>
          <p className="text-success text-sm font-semibold">{fmt(cobro.pagado)}</p>
        </div>
      )}
    </li>
  );
}

function PreviewRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'success' | 'warning';
}) {
  const color =
    tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning' : 'text-neutral-800';
  return (
    <div>
      <Overline>{label}</Overline>
      <p className={`mt-1 text-sm font-semibold ${color}`}>{value}</p>
    </div>
  );
}
