import { Router } from 'express';
import { ConsultaController } from '../controllers/ConsultaController';
import { authMiddleware } from '../middlewares/auth.middleware';

export const router: Router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// POST /api/tratamientos - Crear nueva sesión de tratamiento
router.post('/', ConsultaController.create);

// GET /api/tratamientos/:id - Obtener tratamiento por ID
router.get('/:id', ConsultaController.getById);

// PUT /api/tratamientos/:id - Actualizar tratamiento
router.put('/:id', ConsultaController.update);

export default router;
