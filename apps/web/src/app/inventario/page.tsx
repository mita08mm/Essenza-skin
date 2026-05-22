'use client';

import { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { apiEndpoint } from '@/lib/config';
import Link from 'next/link';

interface Producto {
  id: string;
  nombre: string;
  tipo: 'COSMECEUTICO' | 'DERMOCOSMETICO' | 'EQUIPO' | 'INSUMO';
  precio: number;
  stock: number;
  stockMinimo: number;
  unidad: string;
  descripcion?: string;
}

const TIPO_LABELS = {
  COSMECEUTICO: 'Cosmecéutico',
  DERMOCOSMETICO: 'Dermocosmético',
  EQUIPO: 'Equipo',
  INSUMO: 'Insumo',
};

const TIPO_COLORS = {
  COSMECEUTICO: 'bg-purple-100 text-purple-800',
  DERMOCOSMETICO: 'bg-blue-100 text-blue-800',
  EQUIPO: 'bg-amber-100 text-amber-800',
  INSUMO: 'bg-gray-100 text-gray-800',
};

export default function InventarioPage() {
  const { token } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('');
  const [showBajoStock, setShowBajoStock] = useState(false);
  const [editingStock, setEditingStock] = useState<{ id: string; value: string } | null>(null);

  const fetchProductos = useCallback(async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(apiEndpoint('/productos'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al cargar productos');

      const data = await response.json();
      setProductos(data.data || []);
    } catch (err) {
      console.error('Error cargando productos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProductos();
  }, [fetchProductos]);

  const handleUpdateStock = async (id: string, nuevoStock: number) => {
    try {
      const response = await fetch(apiEndpoint(`/productos/${id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stock: nuevoStock }),
      });

      if (!response.ok) throw new Error('Error al actualizar stock');

      await fetchProductos();
      setEditingStock(null);
    } catch (err) {
      console.error('Error actualizando stock:', err);
      alert('Error al actualizar stock');
    }
  };

  const filteredProductos = productos.filter((p) => {
    const matchSearch = searchTerm === '' || 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchTipo = filterTipo === '' || p.tipo === filterTipo;
    const matchStock = !showBajoStock || p.stock <= p.stockMinimo;

    return matchSearch && matchTipo && matchStock;
  });

  const productosConAlertas = filteredProductos.filter(p => p.stock <= p.stockMinimo);
  const valorInventario = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-concreto">
                Inventario
              </h1>
              <p className="text-marengo mt-1">
                {productos.length} productos · Bs. {valorInventario.toFixed(2)} en stock
              </p>
            </div>
            <Link
              href="/inventario/nuevo"
              className="px-4 py-2.5 bg-marengo text-white rounded-lg hover:bg-concreto transition-colors font-medium"
            >
              + Nuevo Producto
            </Link>
          </div>

          {/* Alertas de stock bajo */}
          {productosConAlertas.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-900">
                    {productosConAlertas.length} producto{productosConAlertas.length !== 1 ? 's' : ''} con stock bajo
                  </h3>
                  <p className="text-xs text-red-700 mt-1">
                    {productosConAlertas.map(p => p.nombre).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filtros */}
          <div className="card p-4">
            <div className="flex flex-wrap gap-4">
              {/* Búsqueda */}
              <div className="flex-1 min-w-[250px]">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marengo focus:border-transparent"
                />
              </div>

              {/* Filtro por tipo */}
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marengo focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                {Object.entries(TIPO_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              {/* Mostrar solo bajo stock */}
              <button
                onClick={() => setShowBajoStock(!showBajoStock)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showBajoStock
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showBajoStock ? '✓ Stock Bajo' : 'Stock Bajo'}
              </button>
            </div>
          </div>

          {/* Tabla de productos */}
          {isLoading ? (
            <div className="card p-12 text-center">
              <p className="text-marengo">Cargando productos...</p>
            </div>
          ) : filteredProductos.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-marengo">
                {searchTerm || filterTipo || showBajoStock
                  ? 'No se encontraron productos con los filtros aplicados'
                  : 'No hay productos registrados'}
              </p>
            </div>
          ) : (
            <div className="card card-no-padding overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Valor Total
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProductos.map((producto) => {
                    const stockBajo =producto.stock <= producto.stockMinimo;
                    const isEditing = editingStock?.id === producto.id;

                    return (
                      <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{producto.nombre}</p>
                            {producto.descripcion && (
                              <p className="text-xs text-gray-500 mt-0.5">{producto.descripcion}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${TIPO_COLORS[producto.tipo]}`}>
                            {TIPO_LABELS[producto.tipo]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Bs. {producto.precio.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">por {producto.unidad}</p>
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-2">
                              <input
                                type="number"
                                value={editingStock.value}
                                onChange={(e) => setEditingStock({ ...editingStock, value: e.target.value })}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                                autoFocus
                              />
                              <button
                                onClick={() => handleUpdateStock(producto.id, parseInt(editingStock.value))}
                                className="text-green-600 hover:text-green-700"
                                title="Guardar"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => setEditingStock(null)}
                                className="text-red-600 hover:text-red-700"
                                title="Cancelar"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <button
                                onClick={() => setEditingStock({ id: producto.id, value: producto.stock.toString() })}
                                className={`font-semibold hover:underline ${
                                  stockBajo ? 'text-red-600' : 'text-gray-900'
                                }`}
                              >
                                {producto.stock} {producto.unidad}
                              </button>
                              {stockBajo && (
                                <p className="text-xs text-red-600 mt-0.5">
                                  ⚠ Mín: {producto.stockMinimo}
                                </p>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            Bs. {(producto.precio * producto.stock).toFixed(2)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={`/inventario/${producto.id}/editar`}
                            className="text-marengo hover:text-concreto text-sm font-medium"
                          >
                            Editar
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-100">
              <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Cosmecéuticos</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {productos.filter(p => p.tipo === 'COSMECEUTICO').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Dermocosméticos</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {productos.filter(p => p.tipo === 'DERMOCOSMETICO').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-5 border border-amber-100">
              <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">Equipos</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">
                {productos.filter(p => p.tipo === 'EQUIPO').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-5 border border-red-100">
              <p className="text-xs font-medium text-red-600 uppercase tracking-wider">Alertas Stock</p>
              <p className="text-2xl font-bold text-red-900 mt-1">
                {productosConAlertas.length}
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
