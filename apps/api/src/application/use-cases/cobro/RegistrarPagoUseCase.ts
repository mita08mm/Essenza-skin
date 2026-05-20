import { CobroRepository, CreatePagoInput } from '../../../infrastructure/repositories/CobroRepository';

export class RegistrarPagoUseCase {
  constructor(private cobroRepository: CobroRepository) {}

  async execute(input: CreatePagoInput) {
    // Validar que el monto sea positivo
    if (input.monto <= 0) {
      throw new Error('El monto del pago debe ser mayor a 0');
    }

    // Verificar que el cobro existe
    const cobro = await this.cobroRepository.findById(input.cobroId);
    
    if (!cobro) {
      throw new Error('Cobro no encontrado');
    }

    // Verificar que el cobro no esté cancelado
    if (cobro.estado === 'CANCELADO') {
      throw new Error('No se puede registrar un pago en un cobro cancelado');
    }

    // Calcular saldo pendiente
    const saldoPendiente = await this.cobroRepository.getSaldoPendiente(input.cobroId);

    // Verificar que el pago no exceda el saldo pendiente
    if (input.monto > saldoPendiente) {
      throw new Error(`El monto del pago (${input.monto}) excede el saldo pendiente (${saldoPendiente})`);
    }

    return this.cobroRepository.registrarPago(input);
  }
}
