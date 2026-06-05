import { Router } from 'express';
import { PrescripcionController } from '../controllers/PrescripcionController';
import { authMiddleware } from '../middlewares/auth.middleware';

export const router: Router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// POST /api/protocolos - Crear nuevo protocolo de cuidados
router.post('/', PrescripcionController.create);

// GET /api/protocolos - Obtener todos los protocolos
router.get('/', PrescripcionController.getAll);

// GET /api/protocolos/:id - Obtener protocolo por ID
router.get('/:id', PrescripcionController.getById);

// PATCH /api/protocolos/:id - Actualizar protocolo
router.patch('/:id', PrescripcionController.update);

// DELETE /api/protocolos/:id - Eliminar protocolo
router.delete('/:id', PrescripcionController.delete);

// DELETE /api/protocolos/:id/items/:itemId - Eliminar item individual
router.delete('/:id/items/:itemId', PrescripcionController.deleteItem);

export default router;
