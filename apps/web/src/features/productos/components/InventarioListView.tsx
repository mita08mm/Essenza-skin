'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Badge,
  Spinner,
  EmptyState,
  SearchInput,
  Subtitle,
  Overline,
  LinkButton,
} from '@/shared/ui';
import { PlusIcon } from '@/shared/icons';
import { useProductos, type Producto, type ProductoTipo } from '@/features/productos';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { formatMonto } from '@/shared/utils/money';

const TIPO_LABELS: Record<ProductoTipo, string> = {
  COSMECEUTICO: 'Cosmecéutico',
  DERMOCOSMETICO: 'Dermocosmético',
  EQUIPO: 'Equipo',
  INSUMO: 'Insumo',
};

export function InventarioListView() {
  const { productos, isLoading, error, actualizarStock } = useProductos();
  const [query, setQuery] = useState('');
  const [filterTipo, setFilterTipo] = useState<'' | ProductoTipo>('');
  const [soloBajoStock, setSoloBajoStock] = useState(false);
  const [editing, setEditing] = useState<{ id: string; value: string } | null>(null);
  const debounced = useDebounce(query, 200);

  const filtrados = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return productos.filter((p) => {
      const matchQ =
        !q || p.nombre.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q);
      const matchTipo = !filterTipo || p.tipo === filterTipo;
      const matchStock = !soloBajoStock || p.stock <= p.stockMinimo;
      return matchQ && matchTipo && matchStock;
    });
  }, [productos, debounced, filterTipo, soloBajoStock]);

  const alertas = useMemo(() => productos.filter((p) => p.stock <= p.stockMinimo), [productos]);
  const valorInventario = useMemo(
    () => productos.reduce((sum, p) => sum + p.precio * p.stock, 0),
    [productos],
  );
  

  const handleSaveStock = async () => {
    if (!editing) return;
    const value = parseInt(editing.value, 10);
    if (isNaN(value) || value < 0) return;
    try {
      await actualizarStock(editing.id, value);
      setEditing(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Overline>Stock</Overline>
          <h1 className="title-page mt-1">Inventario</h1>
          <Subtitle className="mt-0.5">
            {productos.length} productos · {formatMonto(valorInventario)} en stock
          </Subtitle>
        </div>
        <LinkButton
          href="/productos/nuevo"
          variant="primary"
          size="sm"
          className="h-10 gap-2 px-4 shadow-xs"
        >
          <PlusIcon className="h-4 w-4" />
          Nuevo producto
        </LinkButton>
      </header>

      {alertas.length > 0 && (
        <div className="bg-warning-bg mb-5 rounded-md border border-[rgba(192,138,46,0.25)] px-4 py-3">
          <p className="text-warning text-sm font-medium">
            {alertas.length} producto{alertas.length !== 1 ? 's' : ''} con stock bajo
          </p>
          <p className="mt-0.5 truncate text-xs text-neutral-600">
            {alertas.map((p) => p.nombre).join(' · ')}
          </p>
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchInput
          containerClassName="flex-1 min-w-[220px] max-w-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos..."
        />
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value as '' | ProductoTipo)}
          className="focus:border-brand-morena h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-800 focus:outline-none"
        >
          <option value="">Todos los tipos</option>
          {(Object.entries(TIPO_LABELS) as [ProductoTipo, string][]).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
        <button
          onClick={() => setSoloBajoStock((s) => !s)}
          className={`h-10 rounded-md px-3 text-xs font-medium transition-colors ${
            soloBajoStock
              ? 'bg-warning-bg text-warning border border-[rgba(192,138,46,0.3)]'
              : 'border border-neutral-300 bg-white text-neutral-600 hover:text-neutral-900'
          }`}
        >
          {soloBajoStock ? '✓ Stock bajo' : 'Stock bajo'}
        </button>
        <span className="muted ml-auto tabular-nums">
          {isLoading
            ? '—'
            : `${filtrados.length} ${filtrados.length === 1 ? 'producto' : 'productos'}`}
        </span>
      </div>

      {error && <div className="alert-danger mb-4">{error}</div>}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="surface-dashed">
          <EmptyState
            title={
              !!query || !!filterTipo || soloBajoStock
                ? 'Sin resultados'
                : 'Sin productos registrados'
            }
            description={
              !!query || !!filterTipo || soloBajoStock
                ? 'Ajusta los filtros para ver más productos'
                : 'Agrega el primer producto para comenzar tu inventario'
            }
            action={
              !query && !filterTipo && !soloBajoStock ? (
                <LinkButton href="/productos/nuevo" variant="primary" size="sm">
                  Crear primer producto
                </LinkButton>
              ) : undefined
            }
          />
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="surface hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-25 border-b border-neutral-200">
                  <Overline as="th" className="px-5 py-2.5 text-left">Producto</Overline>
                  <Overline as="th" className="hidden px-5 py-2.5 text-left 2xl:table-cell">Tipo</Overline>
                  <Overline as="th" className="hidden px-5 py-2.5 text-right xl:table-cell">Precio</Overline>
                  <Overline as="th" className="px-5 py-2.5 text-center">Stock</Overline>
                  <Overline as="th" className="hidden px-5 py-2.5 text-right 2xl:table-cell">Valor</Overline>
                  <th className="px-5 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtrados.map((p) => (
                  <ProductoRow 
                    key={p.id} 
                    producto={p} 
                    editing={editing?.id === p.id ? editing : null}
                    onEdit={(v) => setEditing({ id: p.id, value: v })}
                    onChange={(v) => setEditing({ id: p.id, value: v })}
                    onCancel={() => setEditing(null)}
                    onSave={handleSaveStock}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {filtrados.map((p) => (
              <ProductoCard key={p.id} producto={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

type ProductoRowProps = {
  producto: Producto;
  editing: { id: string; value: string } | null;
  onEdit: (value: string) => void;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

function ProductoRow({ producto, editing, onEdit, onChange, onCancel, onSave }: ProductoRowProps) {
  return (
    <tr className="hover:bg-neutral-25 group transition-colors">
      <td className="px-5 py-3">
        <p className="font-medium text-neutral-900">{producto.nombre}</p>
        {producto.descripcion && (
          <p className="muted mt-0.5 max-w-xs truncate text-xs">{producto.descripcion}</p>
        )}
      </td>
      <td className="hidden px-5 py-3 2xl:table-cell">
        <Badge variant="default">{TIPO_LABELS[producto.tipo]}</Badge>
      </td>
      <td className="hidden px-5 py-3 text-right xl:table-cell">
        <p className="text-sm tabular-nums text-neutral-800">{formatMonto(producto.precio)}</p>
      </td>
      <td className="px-5 py-3 text-center">
        <StockCell
          producto={producto}
          editing={editing}
          onEdit={onEdit}
          onChange={onChange}
          onCancel={onCancel}
          onSave={onSave}
        />
      </td>
      <td className="hidden px-5 py-3 text-right font-medium tabular-nums text-neutral-800 2xl:table-cell">
        {formatMonto(producto.precio * producto.stock)}
      </td>
      <td className="px-5 py-3 text-right">
        <Link
          href={`/productos/${producto.id}/editar`}
          className="text-brand-morena inline-flex h-7 items-center rounded-md px-2.5 text-xs font-medium opacity-100 transition-colors lg:opacity-0 lg:group-hover:opacity-100 hover:bg-[rgba(204,175,125,0.18)]"
        >
          Editar
        </Link>
      </td>
    </tr>
  );
}

function ProductoCard({ producto }: { producto: Producto }) {
  const stockBajo = producto.stock <= producto.stockMinimo;
  return (
    <Link
      href={`/productos/${producto.id}/editar`}
      className="surface block p-4 transition-colors hover:border-neutral-300"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="body-strong truncate text-neutral-900">{producto.nombre}</p>
          {producto.descripcion && (
            <p className="muted mt-0.5 line-clamp-2 text-xs">{producto.descripcion}</p>
          )}
        </div>
        <Badge variant="default">{TIPO_LABELS[producto.tipo]}</Badge>
      </div>
      <div className="grid grid-cols-3 gap-3 border-t border-neutral-100 pt-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-neutral-500">Precio</p>
          <p className="text-sm font-medium text-neutral-800 tabular-nums">
            {formatMonto(producto.precio)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-neutral-500">Stock</p>
          <p className={`text-sm font-medium tabular-nums ${stockBajo ? 'text-orange-600' : 'text-neutral-800'}`}>
            {producto.stock}
            {stockBajo && <span className="ml-1 text-[10px]">⚠️</span>}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wide text-neutral-500">Valor</p>
          <p className="text-sm font-medium text-neutral-800 tabular-nums">
            {formatMonto(producto.precio * producto.stock)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function StockCell({
  producto,
  editing,
  onEdit,
  onChange,
  onCancel,
  onSave,
}: {
  producto: Producto;
  editing: { id: string; value: string } | null;
  onEdit: (value: string) => void;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const stockBajo = producto.stock <= producto.stockMinimo;
  if (editing) {
    return (
      <div className="inline-flex items-center gap-1">
        <input
          type="number"
          value={editing.value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          className="border-brand-morena h-7 w-16 rounded border px-2 text-center text-sm focus:outline-none"
          autoFocus
        />
        <button
          onClick={onSave}
          className="text-success hover:bg-success-bg inline-flex h-7 w-7 items-center justify-center rounded"
          aria-label="Guardar"
        >
          ✓
        </button>
        <button
          onClick={onCancel}
          className="inline-flex h-7 w-7 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100"
          aria-label="Cancelar"
        >
          ✕
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={() => onEdit(producto.stock.toString())}
      className={`text-sm font-medium tabular-nums hover:underline ${stockBajo ? 'text-danger' : 'text-neutral-800'}`}
    >
      {producto.stock}
      {stockBajo && (
        <span className="mt-0.5 block text-[10px] text-neutral-500">
          mín {producto.stockMinimo}
        </span>
      )}
    </button>
  );
}
