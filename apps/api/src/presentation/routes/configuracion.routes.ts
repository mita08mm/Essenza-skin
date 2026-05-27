import { Router } from 'express';
import { PrismaClient } from '@clinica/database';
import { ConfiguracionRepository } from '../../infrastructure/repositories/ConfiguracionRepository';
import { GetConfiguracionUseCase } from '../../application/use-cases/configuracion/GetConfiguracionUseCase';
import { UpdateConfiguracionUseCase } from '../../application/use-cases/configuracion/UpdateConfiguracionUseCase';
import { ConfiguracionController } from '../controllers/ConfiguracionController';
import { authMiddleware } from '../middlewares/auth.middleware';

export const router: Router = Router();
const prisma = new PrismaClient();

// Dependency Injection
const configuracionRepository = new ConfiguracionRepository(prisma);
const getConfiguracionUseCase = new GetConfiguracionUseCase(configuracionRepository);
const updateConfiguracionUseCase = new UpdateConfiguracionUseCase(configuracionRepository);

const configuracionController = new ConfiguracionController(
  getConfiguracionUseCase,
  updateConfiguracionUseCase,
);

// Ruta pública para obtener configuración (solo si isPublic = true)
router.get('/public', configuracionController.getConfiguracion);

// Rutas protegidas para administración
router.get('/', authMiddleware, configuracionController.getConfiguracion);
router.put('/', authMiddleware, configuracionController.updateConfiguracion);

export default router;
