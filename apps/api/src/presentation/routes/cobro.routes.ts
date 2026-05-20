import { Router } from 'express';
import { PrismaClient } from '@clinica/database';
import { CobroRepository } from '../../infrastructure/repositories/CobroRepository';
import { CreateCobroUseCase } from '../../application/use-cases/cobro/CreateCobroUseCase';
import { GetCobrosUseCase } from '../../application/use-cases/cobro/GetCobrosUseCase';
import { GetCobroByIdUseCase } from '../../application/use-cases/cobro/GetCobroByIdUseCase';
import { UpdateCobroUseCase } from '../../application/use-cases/cobro/UpdateCobroUseCase';
import { RegistrarPagoUseCase } from '../../application/use-cases/cobro/RegistrarPagoUseCase';
import { GetCobrosByPacienteUseCase } from '../../application/use-cases/cobro/GetCobrosByPacienteUseCase';
import { CobroController } from '../controllers/CobroController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Dependency Injection
const cobroRepository = new CobroRepository(prisma);
const createCobroUseCase = new CreateCobroUseCase(cobroRepository);
const getCobrosUseCase = new GetCobrosUseCase(cobroRepository);
const getCobroByIdUseCase = new GetCobroByIdUseCase(cobroRepository);
const updateCobroUseCase = new UpdateCobroUseCase(cobroRepository);
const registrarPagoUseCase = new RegistrarPagoUseCase(cobroRepository);
const getCobrosByPacienteUseCase = new GetCobrosByPacienteUseCase(cobroRepository);

const cobroController = new CobroController(
  createCobroUseCase,
  getCobrosUseCase,
  getCobroByIdUseCase,
  updateCobroUseCase,
  registrarPagoUseCase,
  getCobrosByPacienteUseCase,
);

// Routes
router.post('/', authMiddleware, cobroController.create);
router.get('/', authMiddleware, cobroController.getAll);
router.get('/:id', authMiddleware, cobroController.getById);
router.patch('/:id', authMiddleware, cobroController.update);
router.post('/:id/pago', authMiddleware, cobroController.registrarPago);

export default router;
