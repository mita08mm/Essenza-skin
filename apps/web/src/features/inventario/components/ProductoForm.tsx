'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/shared/layout/PageHeader';
import { FormSection, FormField } from '@/shared/forms/FormSection';
import { api } from '@/shared/api';
import { inputBase, textareaBase, alertError, Button, LinkButton } from '@/shared/ui';
type Tipo = 'COSMECEUTICO' | 'DERMOCOSMETICO' | 'EQUIPO' | 'INSUMO';

export function ProductoForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'COSMECEUTICO' as Tipo,
    precio: '',
    stock: '',
    stockMinimo: '',
    unidad: 'unidad',
    descripcion: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre || !formData.precio || !formData.stock || !formData.stockMinimo) {
      setError('Complete todos los campos obligatorios');
      return;
    }

    const precio = parseFloat(formData.precio);
    const stock = parseInt(formData.stock);
    const stockMinimo = parseInt(formData.stockMinimo);

    if (isNaN(precio) || precio <= 0) return setError('El precio debe ser un número mayor a 0');
    if (isNaN(stock) || stock < 0) return setError('El stock debe ser un número mayor o igual a 0');
    if (isNaN(stockMinimo) || stockMinimo < 0)
      return setError('El stock mínimo debe ser un número mayor o igual a 0');

    try {
      setIsLoading(true);
      await api.post('/productos', {
        nombre: formData.nombre.trim(),
        tipo: formData.tipo,
        precio,
        stock,
        stockMinimo,
        unidad: formData.unidad,
        descripcion: formData.descripcion.trim() || undefined,
      });
      router.push('/inventario');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        overline="Inventario"
        title="Nuevo producto"
        subtitle="Agrega un producto al inventario con su stock inicial y alerta de reposición"
        backHref="/inventario"
      />

      {error && <div className={`mb-5 ${alertError}`}>{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormSection title="Información del producto">
          <FormField label="Nombre del producto" required>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={inputBase}
              placeholder="Ej. Ácido hialurónico 2%"
              required
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Tipo de producto" required>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className={inputBase}
                required
              >
                <option value="COSMECEUTICO">Cosmecéutico</option>
                <option value="DERMOCOSMETICO">Dermocosmético</option>
                <option value="EQUIPO">Equipo</option>
                <option value="INSUMO">Insumo</option>
              </select>
            </FormField>

            <FormField label="Unidad de medida" required>
              <select
                name="unidad"
                value={formData.unidad}
                onChange={handleChange}
                className={inputBase}
                required
              >
                <option value="unidad">Unidad</option>
                <option value="ml">Mililitro (ml)</option>
                <option value="gr">Gramo (gr)</option>
                <option value="ampolla">Ampolla</option>
                <option value="vial">Vial</option>
                <option value="caja">Caja</option>
                <option value="paquete">Paquete</option>
              </select>
            </FormField>
          </div>

          <FormField label="Descripción">
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className={textareaBase}
              rows={3}
              placeholder="Información adicional del producto..."
            />
          </FormField>
        </FormSection>

        <FormSection title="Precio y stock">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField label="Precio unitario (Bs.)" required>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className={inputBase}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </FormField>

            <FormField label="Stock inicial" required>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={inputBase}
                placeholder="0"
                min="0"
                required
              />
            </FormField>

            <FormField
              label="Stock mínimo"
              required
              hint="Recibirás una alerta cuando el stock llegue a este valor"
            >
              <input
                type="number"
                name="stockMinimo"
                value={formData.stockMinimo}
                onChange={handleChange}
                className={inputBase}
                placeholder="5"
                min="0"
                required
              />
            </FormField>
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-3">
          <LinkButton href="/inventario" variant="secondary" size="sm">
            Cancelar
          </LinkButton>
          <Button type="submit" disabled={isLoading} variant="primary" size="sm">
            {isLoading ? 'Guardando...' : 'Guardar producto'}
          </Button>
        </div>
      </form>
    </div>
  );
}
