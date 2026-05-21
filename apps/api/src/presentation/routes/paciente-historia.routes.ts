import { Router } from 'express';
import { HistoriaClinicaController } from '../controllers/HistoriaClinicaController';
import { ConsultaController } from '../controllers/ConsultaController';
import { DocumentoController } from '../controllers/DocumentoController';
import { authMiddleware } from '../middlewares/auth.middleware';

export const router: Router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/pacientes/:pacienteId/historia-clinica
router.get('/:pacienteId/historia-clinica', HistoriaClinicaController.getByPaciente);

// PUT /api/pacientes/:pacienteId/historia-clinica
router.put('/:pacienteId/historia-clinica', HistoriaClinicaController.update);

// GET /api/pacientes/:pacienteId/consultas
router.get('/:pacienteId/consultas', ConsultaController.getByPaciente);

// GET /api/pacientes/:pacienteId/documentos
router.get('/:pacienteId/documentos', DocumentoController.getByPaciente);

export default router;
