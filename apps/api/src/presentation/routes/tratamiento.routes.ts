import { Router } from 'express';
import { TratamientoController } from '../controllers/TratamientoController';
import { authMiddleware } from '../middlewares/auth.middleware';

export const router: Router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// POST /api/tratamientos - Crear nueva sesión de tratamiento
router.post('/', TratamientoController.create);

// GET /api/tratamientos/:id - Obtener tratamiento por ID
router.get('/:id', TratamientoController.getById);

// PUT /api/tratamientos/:id - Actualizar tratamiento
router.put('/:id', TratamientoController.update);

export default router;
