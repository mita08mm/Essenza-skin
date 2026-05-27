import { Router } from 'express';
import { PrismaClient } from '@clinica/database';
import { AuthService } from '../../infrastructure/services/AuthService';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';

const router: Router = Router();
const prisma = new PrismaClient();

const authService = new AuthService();
const userRepository = new UserRepository(prisma);
const loginUseCase = new LoginUseCase(authService, userRepository);
const authController = new AuthController(loginUseCase);

router.post('/login', authController.login);

router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'No autorizado',
      });
      return;
    }

    const usuario = await userRepository.findById(req.user.userId);

    if (!usuario) {
      res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    });
  } catch (_error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
    });
  }
});

export default router;
