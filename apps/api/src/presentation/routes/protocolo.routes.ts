import { Router } from 'express';
import { ProtocoloController } from '../controllers/ProtocoloController';
import { authMiddleware } from '../middlewares/auth.middleware';

export const router: Router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// POST /api/protocolos - Crear nuevo protocolo de cuidados
router.post('/', ProtocoloController.create);

// GET /api/protocolos - Obtener todos los protocolos
router.get('/', ProtocoloController.getAll);

// GET /api/protocolos/:id - Obtener protocolo por ID
router.get('/:id', ProtocoloController.getById);

export default router;
