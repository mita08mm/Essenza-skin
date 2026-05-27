import { Router } from 'express';
import { PrismaClient } from '@clinica/database';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { UsuarioController } from '../controllers/UsuarioController';
import { authMiddleware } from '../middlewares/auth.middleware';

export const router: Router = Router();
const prisma = new PrismaClient();

// Dependency Injection
const userRepository = new UserRepository(prisma);
const usuarioController = new UsuarioController(userRepository);

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de usuarios
router.get('/', usuarioController.getAll);
router.post('/', usuarioController.create);
router.patch('/:id', usuarioController.update);

export default router;
