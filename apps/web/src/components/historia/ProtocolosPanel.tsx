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
  instrucciones: string;
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

  // Formulario simplificado
  const [nombre, setNombre] = useState('');
  const [items, setItems] = useState<ItemForm[]>([]);
  
  // Item actual (solo 3 campos)
  const [selectedProducto, setSelectedProducto] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [instrucciones, setInstrucciones] = useState('');

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProtocolos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProductos = useCallback(async () => {
    setIsLoadingProductos(true);
    try {
      const response = await fetch(apiEndpoint('/productos'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al cargar productos');

      const data = await response.json();
      setProductos(data.data || []);
    } catch {
      setError('No se pudieron cargar los productos');
    } finally {
      setIsLoadingProductos(false);
    }
  }, [token]);

  useEffect(() => {
    if (showModal && productos.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProductos();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  const handleAgregarItem = () => {
    if (!selectedProducto || !instrucciones.trim()) {
      setError('Seleccione un producto e ingrese las instrucciones');
      return;
    }

    const producto = productos.find(p => p.id === selectedProducto);
    if (!producto) return;

    const nuevoItem: ItemForm = {
      productoId: producto.id,
      nombre: producto.nombre,
      cantidad,
      instrucciones: instrucciones.trim(),
    };

    setItems([...items, nuevoItem]);
    
    // Limpiar campos
    setSelectedProducto('');
    setCantidad(1);
    setInstrucciones('');
    setError('');
  };

  const handleEliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim() || items.length === 0) {
      setError('Ingrese un nombre y agregue al menos un producto');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // Transformar a formato esperado por backend
      const itemsParaBackend = items.map(item => ({
        productoId: item.productoId,
        nombre: item.nombre,
        cantidad: Number(item.cantidad),
        aplicacion: item.instrucciones, // Mapear instrucciones a aplicacion
        frecuencia: item.instrucciones, // Usar mismo valor para frecuencia
      }));

      const payload = {
        pacienteId,
        nombre: nombre.trim(),
        items: itemsParaBackend,
      };

      const response = await fetch(apiEndpoint('/protocolos'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseText = await response.text();
        
        try {
          const errorData = JSON.parse(responseText);
          
          if (errorData.details && Array.isArray(errorData.details)) {
            const mensajes = errorData.details.map((d: { path?: string[]; message: string }) => `${d.path?.join('.')}: ${d.message}`).join(', ');
            throw new Error(`Errores de validación: ${mensajes}`);
          }
          
          throw new Error(errorData.error || 'Error al crear prescripción');
        } catch {
          throw new Error(`Error del servidor (${response.status}): ${responseText || 'Sin detalles'}`);
        }
      }

      // Limpiar y cerrar
      setNombre('');
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
          <h2 className="text-lg font-serif font-light text-gray-900">Prescripciones</h2>
          <button 
            onClick={() => setShowModal(true)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Agregar prescripción"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {isLoadingProtocolos ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-lg h-8 w-8 border-b-2 border-gray-400 mx-auto"></div>
              <p className="text-xs text-gray-400 mt-2">Cargando prescripciones...</p>
            </div>
          ) : protocolos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 mb-1">Sin prescripciones activas</p>
              <p className="text-xs text-gray-300">
                Haga clic en + para agregar
              </p>
            </div>
          ) : (
            protocolos.slice(0, 5).map((protocolo) => (
              <div key={protocolo.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <h4 className="text-sm font-medium text-gray-900 mb-2">{protocolo.nombre}</h4>
                {protocolo.items.map((item) => (
                  <div key={item.id} className="mb-3 last:mb-0 pl-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">
                          {item.producto.nombre} <span className="text-gray-400">x{item.cantidad}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1 italic">
                          {item.aplicacion || item.frecuencia}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-lg flex-shrink-0 ${
                        item.estado === 'COMPLETADO' 
                          ? 'bg-gray-100 text-gray-600' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.estado === 'COMPLETADO' ? 'Finalizado' : 'Activo'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}

          {protocolos.length > 5 && (
            <button className="w-full text-xs text-gray-500 hover:text-gray-700 pt-3 transition-colors">
              Ver todas las prescripciones →
            </button>
          )}
        </div>
      </div>

      {/* Modal simplificado - Solo 3 campos por producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-light text-gray-900">Nueva Prescripción</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  Nombre del Protocolo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Rutina facial anti-edad"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Productos agregados */}
              {items.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <h5 className="text-sm font-medium text-gray-700">Productos Agregados:</h5>
                  {items.map((item, index) => (
                    <div key={index} className="flex items-start justify-between gap-3 bg-gray-50 p-3 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.nombre} <span className="text-gray-500">x{item.cantidad}</span></p>
                        <p className="text-xs text-gray-600 mt-1 italic">{item.instrucciones}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEliminarItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Agregar producto - SOLO 3 CAMPOS */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Agregar Producto</h4>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
                  {/* Campo 1: Producto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Producto <span className="text-red-500">*</span>
                    </label>
                    {isLoadingProductos ? (
                      <div className="text-sm text-gray-500">Cargando productos...</div>
                    ) : (
                      <select
                        value={selectedProducto}
                        onChange={(e) => setSelectedProducto(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">Seleccionar producto...</option>
                        {productos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre} (Stock: {p.stock})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Campo 2: Cantidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  {/* Campo 3: Instrucciones (reemplaza aplicacion + frecuencia + duracion) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instrucciones <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={instrucciones}
                      onChange={(e) => setInstrucciones(e.target.value)}
                      placeholder="Ej: Aplicar 2 veces al día (mañana y noche) durante 30 días"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAgregarItem}
                    className="btn-primary w-full"
                  >
                    + Agregar Producto
                  </button>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || items.length === 0}
                  className="btn-primary"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Prescripción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
