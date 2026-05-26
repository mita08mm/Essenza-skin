/**
 * Formatea un monto como moneda boliviana (Bs)
 */
export function formatMonto(monto: number | string): string {
  const value = typeof monto === 'string' ? Number(monto) : monto;
  return 'Bs ' + new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}