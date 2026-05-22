'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { apiEndpoint } from '@/lib/config';
import Link from 'next/link';

export default function NuevoProductoPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'COSMECEUTICO' as 'COSMECEUTICO' | 'DERMOCOSMETICO' | 'EQUIPO' | 'INSUMO',
    precio: '',
    stock: '',
    stockMinimo: '',
    unidad: 'unidad',
    descripcion: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

    if (isNaN(precio) || precio <= 0) {
      setError('El precio debe ser un número mayor a 0');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      setError('El stock debe ser un número mayor o igual a 0');
      return;
    }

    if (isNaN(stockMinimo) || stockMinimo < 0) {
      setError('El stock mínimo debe ser un número mayor o igual a 0');
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        nombre: formData.nombre.trim(),
        tipo: formData.tipo,
        precio,
        stock,
        stockMinimo,
        unidad: formData.unidad,
        descripcion: formData.descripcion.trim() || undefined,
      };

      const response = await fetch(apiEndpoint('/productos'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const  data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Error al crear producto');
      }

      router.push('/inventario');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const inputClass = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marengo focus:border-transparent';

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-3xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/inventario" className="text-marengo hover:text-concreto">
              ← Volver
            </Link>
            <div>
              <h1 className="text-3xl font-heading font-bold text-concreto">Nuevo Producto</h1>
              <p className="text-marengo mt-1">Agregar producto al inventario</p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="card p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label className={labelClass}>
                  Nombre del Producto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Ej: Ácido Hialurónico 2%"
                  required
                />
              </div>

              {/* Tipo */}
              <div>
                <label className={labelClass}>
                  Tipo de Producto <span className="text-red-500">*</span>
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="COSMECEUTICO">Cosmecéutico</option>
                  <option value="DERMOCOSMETICO">Dermocosmético</option>
                  <option value="EQUIPO">Equipo</option>
                  <option value="INSUMO">Insumo</option>
                </select>
              </div>

              {/* Unidad */}
              <div>
                <label className={labelClass}>
                  Unidad de Medida <span className="text-red-500">*</span>
                </label>
                <select
                  name="unidad"
                  value={formData.unidad}
                  onChange={handleChange}
                  className={inputClass}
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
              </div>

              {/* Precio */}
              <div>
                <label className={labelClass}>
                  Precio Unitario (Bs.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {/* Stock Inicial */}
              <div>
                <label className={labelClass}>
                  Stock Inicial <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              {/* Stock Mínimo */}
              <div>
                <label className={labelClass}>
                  Stock Mínimo (Alerta) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stockMinimo"
                  value={formData.stockMinimo}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="5"
                  min="0"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recibirás una alerta cuando el stock sea menor o igual a este valor
                </p>
              </div>

              {/* Descripción */}
              <div className="md:col-span-2">
                <label className={labelClass}>Descripción (Opcional)</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className={inputClass}
                  rows={3}
                  placeholder="Información adicional del producto..."
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-marengo text-white rounded-lg hover:bg-concreto transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Guardando...' : 'Guardar Producto'}
              </button>
              <Link
                href="/inventario"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>

          {/* Tarjeta informativa */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Consejo</h3>
            <p className="text-xs text-blue-800">
              Mantén el stock mínimo en un valor que te permita realizar pedidos sin quedarte sin producto.
              Por ejemplo, si un producto se vende rápido, establece un stock mínimo mayor.
            </p>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
