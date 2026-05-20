import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../infrastructure/services/AuthService';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    rol: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No autorizado - Token no proporcionado',
      });
      return;
    }

    const token = authHeader.substring(7);

    const authService = new AuthService();
    const payload = authService.verifyToken(token);

    req.user = {
      userId: payload.userId,
      email: payload.email,
      rol: payload.rol,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'No autorizado - Token invalido',
    });
  }
};
