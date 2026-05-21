'use client';

import { useState, useEffect, useCallback } from 'react';
import { Protocolo } from '@/types/historia';
import { apiEndpoint } from '@/lib/config';
import { useAuth } from '@/contexts/AuthContext';

interface ProtocolosPanelProps {
  pacienteId: string;
}

interface Producto {
  id: string;
  nombre: string;
  tipo: 'COSMECEUTICO' | 'DERMOCOSMETICO' | 'EQUIPO' | 'INSUMO';
  precio: number;
  stock: number;
}

interface ItemForm {
  productoId: string;
  nombre: string;
  cantidad: number;
  aplicacion: string;
  frecuencia: string;
  duracion?: string;
  precio?: number;
}

export default function ProtocolosPanel({ pacienteId }: ProtocolosPanelProps) {
  const { token } = useAuth();
  const [protocolos, setProtocolos] = useState<Protocolo[]>([]);
  const [isLoadingProtocolos, setIsLoadingProtocolos] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoadingProductos, setIsLoadingProductos] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Formulario
  const [nombre, setNombre] = useState('');
  const [indicaciones, setIndicaciones] = useState('');
  const [items, setItems] = useState<ItemForm[]>([]);
  
  // Item actual
  const [selectedProducto, setSelectedProducto] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [aplicacion, setAplicacion] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [duracion, setDuracion] = useState('');

  // Cargar protocolos del paciente
  const fetchProtocolos = useCallback(async () => {
    if (!token) return;
    
    try {
      setIsLoadingProtocolos(true);
      const response = await fetch(apiEndpoint(`/pacientes/${pacienteId}/protocolos`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al cargar prescripciones');

      const data = await response.json();
      setProtocolos(data.data || []);
    } catch (err) {
      console.error('Error cargando prescripciones:', err);
    } finally {
      setIsLoadingProtocolos(false);
    }
  }, [pacienteId, token]);

  // Cargar protocolos al montar y cuando cambie el paciente
  useEffect(() => {
    fetchProtocolos();
  }, [fetchProtocolos]);

  useEffect(() => {
    if (showModal && productos.length === 0) {
      fetchProductos();
    }
  }, [showModal]);

  const fetchProductos = async () => {
    setIsLoadingProductos(true);
    try {
      const response = await fetch(apiEndpoint('/productos'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al cargar productos');

      const data = await response.json();
      setProductos(data.data || []);
    } catch (err) {
      setError('No se pudieron cargar los productos');
    } finally {
      setIsLoadingProductos(false);
    }
  };

  const handleAgregarItem = () => {
    if (!selectedProducto || !aplicacion || !frecuencia) {
      setError('Complete todos los campos obligatorios del producto');
      return;
    }

    const producto = productos.find(p => p.id === selectedProducto);
    if (!producto) return;

    const nuevoItem: ItemForm = {
      productoId: producto.id,
      nombre: producto.nombre,
      cantidad,
      aplicacion: aplicacion.trim(),
      frecuencia: frecuencia.trim(),
      duracion: duracion.trim() || undefined,
      precio: producto.precio,
    };

    setItems([...items, nuevoItem]);
    
    // Limpiar campos
    setSelectedProducto('');
    setCantidad(1);
    setAplicacion('');
    setFrecuencia('');
    setDuracion('');
    setError('');
  };

  const handleEliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre || items.length === 0) {
      setError('Ingrese un nombre y agregue al menos un producto');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // Limpiar items: remover campos undefined y asegurar tipos correctos
      const itemsLimpios = items.map(item => ({
        productoId: item.productoId,
        nombre: item.nombre,
        cantidad: Number(item.cantidad),
        aplicacion: item.aplicacion,
        frecuencia: item.frecuencia,
        ...(item.duracion && { duracion: item.duracion }),
        ...(item.precio !== undefined && item.precio !== null && { precio: Number(item.precio) }),
      }));

      const payload = {
        pacienteId,
        nombre: nombre.trim(),
        indicaciones: indicaciones.trim() || undefined,
        items: itemsLimpios,
      };

      console.log('Enviando payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(apiEndpoint('/protocolos'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        // Obtener el texto raw primero
        const responseText = await response.text();
        console.log('Response text:', responseText);
        
        try {
          const errorData = JSON.parse(responseText);
          console.error('Error del servidor:', errorData);
          
          // Mostrar detalles de validación si existen
          if (errorData.details && Array.isArray(errorData.details)) {
            const mensajes = errorData.details.map((d: any) => `${d.path?.join('.')}: ${d.message}`).join(', ');
            throw new Error(`Errores de validación: ${mensajes}`);
          }
          
          throw new Error(errorData.error || 'Error al crear prescripción');
        } catch (parseError) {
          // Si no es JSON válido, mostrar el texto raw
          throw new Error(`Error del servidor (${response.status}): ${responseText || 'Sin detalles'}`);
        }
      }

      // Limpiar y cerrar
      setNombre('');
      setIndicaciones('');
      setItems([]);
      setShowModal(false);
      
      // Recargar protocolos
      await fetchProtocolos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar prescripción');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-serif font-light text-gray-900">Prescriptions</h2>
          <button 
            onClick={() => setShowModal(true)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            title="Add prescription"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {isLoadingProtocolos ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto"></div>
              <p className="text-xs text-gray-400 mt-2">Loading prescriptions...</p>
            </div>
          ) : protocolos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 mb-1">No active prescriptions</p>
              <p className="text-xs text-gray-300">
                Click + to add prescriptions
              </p>
            </div>
          ) : (
            protocolos.slice(0, 5).map((protocolo) => (
              <div key={protocolo.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                {protocolo.items.map((item) => (
                  <div key={item.id} className="mb-3 last:mb-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.producto.nombre}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.aplicacion || item.frecuencia || `${item.cantidad} unit(s)`}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${
                        item.estado === 'COMPLETADO' 
                          ? 'bg-gray-100 text-gray-600' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.estado === 'COMPLETADO' ? 'Finished' : 'Active'}
                      </span>
                    </div>
                    
                    {item.frecuencia && (
                      <p className="text-xs text-gray-600">
                        {item.frecuencia}
                      </p>
                    )}
                    
                    {item.estado === 'EN_USO' && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>In progress</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}

          {protocolos.length > 5 && (
            <button className="w-full text-xs text-gray-500 hover:text-gray-700 pt-3 transition-colors">
              View All Prescriptions →
            </button>
          )}
        </div>
      </div>

      {/* Modal para agregar prescripción */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-light text-gray-900">New Prescription</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Nombre del protocolo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protocol Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="e.g., Anti-aging facial routine"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Indicaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  value={indicaciones}
                  onChange={(e) => setIndicaciones(e.target.value)}
                  placeholder="General instructions, precautions, recommendations..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Agregar productos */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Products</h4>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Producto */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product <span className="text-red-500">*</span>
                      </label>
                      {isLoadingProductos ? (
                        <div className="text-sm text-gray-500">Loading products...</div>
                      ) : (
                        <select
                          value={selectedProducto}
                          onChange={(e) => setSelectedProducto(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="">Select a product...</option>
                          {productos.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nombre} - {p.tipo} (Stock: {p.stock})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Cantidad */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={cantidad}
                        onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    {/* Aplicación */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Application <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={aplicacion}
                        onChange={(e) => setAplicacion(e.target.value)}
                        placeholder="e.g., 2ml per zone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    {/* Frecuencia */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={frecuencia}
                        onChange={(e) => setFrecuencia(e.target.value)}
                        placeholder="e.g., Twice daily"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    {/* Duración */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={duracion}
                        onChange={(e) => setDuracion(e.target.value)}
                        placeholder="e.g., 30 days"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    {/* Botón agregar */}
                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={handleAgregarItem}
                        className="btn-primary w-full"
                      >
                        + Add Product
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lista de items agregados */}
                {items.length > 0 && (
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between bg-white border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">{item.nombre}</h5>
                          <p className="text-xs text-gray-600 mt-1">
                            {item.cantidad} unit(s) • {item.aplicacion} • {item.frecuencia}
                            {item.duracion && ` • ${item.duracion}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleEliminarItem(index)}
                          className="ml-3 text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {items.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No products added yet
                  </p>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary"
                >
                  {isSaving ? 'Saving...' : 'Save Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
