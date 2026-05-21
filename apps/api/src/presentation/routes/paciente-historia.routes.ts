import { Router } from 'express';
import { PrismaClient } from '@clinica/database';
import { HistoriaClinicaController } from '../controllers/HistoriaClinicaController';
import { TratamientoController } from '../controllers/TratamientoController';
import { ProtocoloController } from '../controllers/ProtocoloController';
import { DocumentoController } from '../controllers/DocumentoController';
import { authMiddleware } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const router: Router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/pacientes/:pacienteId/historia-clinica
router.get('/:pacienteId/historia-clinica', HistoriaClinicaController.getByPaciente);

// PUT /api/pacientes/:pacienteId/historia-clinica
router.put('/:pacienteId/historia-clinica', HistoriaClinicaController.update);

// GET /api/pacientes/:pacienteId/tratamientos
router.get('/:pacienteId/tratamientos', TratamientoController.getByPaciente);

// GET /api/pacientes/:pacienteId/protocolos
router.get('/:pacienteId/protocolos', ProtocoloController.getByPaciente);

// GET /api/pacientes/:pacienteId/documentos
router.get('/:pacienteId/documentos', DocumentoController.getByPaciente);

// GET /api/pacientes/:pacienteId/saldo - Obtener saldo pendiente
router.get('/:pacienteId/saldo', async (req, res) => {
  try {
    const { pacienteId } = req.params;

    // Obtener todos los cobros pendientes o parciales
    const cobros = await prisma.cobro.findMany({
      where: {
        pacienteId,
        estado: {
          in: ['PENDIENTE', 'PARCIAL']
        }
      },
      include: {
        pagos: true
      }
    });

    // Calcular saldo total
    const saldoTotal = cobros.reduce((total, cobro) => {
      const pagado = cobro.pagos.reduce((sum, pago) => sum + Number(pago.monto), 0);
      const saldo = Number(cobro.total) - pagado;
      return total + saldo;
    }, 0);

    res.json({ saldo: saldoTotal });
  } catch (error) {
    console.error('Error al obtener saldo:', error);
    res.status(500).json({ error: 'Error al obtener saldo' });
  }
});

// GET /api/pacientes/pacienteId/cobros - Historial de cobros y pagos
router.get('/:pacienteId/cobros', async (req, res) => {
  try {
    const { pacienteId } = req.params;

    const cobros = await prisma.cobro.findMany({
      where: { pacienteId },
      include: {
        items: true,
        pagos: {
          orderBy: { fecha: 'desc' }
        },
        tratamiento: {
          select: {
            id: true,
            nombreTratamiento: true,
            objetivo: true
          }
        }
      },
      orderBy: { fecha: 'desc' }
    });

    const cobrosConSaldo = cobros.map(cobro => {
      const pagado = cobro.pagos.reduce((sum, pago) => sum + Number(pago.monto), 0);
      const saldo = Number(cobro.total) - pagado;
      return {
        ...cobro,
        pagado,
        saldo
      };
    });

    res.json({ data: cobrosConSaldo });
  } catch (error) {
    console.error('Error al obtener cobros:', error);
    res.status(500).json({ error: 'Error al obtener historial de cobros' });
  }
});

export default router;
