import { Router } from 'express';
import { ProductoController } from '../controllers/ProductoController';
import { authMiddleware } from '../middlewares/auth.middleware';

export const router: Router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// POST /api/productos - Crear nuevo producto
router.post('/', ProductoController.create);

// GET /api/productos - Obtener todos los productos
router.get('/', ProductoController.getAll);

// GET /api/productos/low-stock - Obtener productos con stock bajo
router.get('/low-stock', ProductoController.getLowStock);

// GET /api/productos/:id - Obtener producto por ID
router.get('/:id', ProductoController.getById);

// PATCH /api/productos/:id/stock - Actualizar stock del producto
router.patch('/:id/stock', ProductoController.updateStock);

export default router;
