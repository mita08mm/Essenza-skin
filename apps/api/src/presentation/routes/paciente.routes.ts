import { Router } from 'express';
import { PrismaClient } from '@clinica/database';
import { PacienteRepository } from '../../infrastructure/repositories/PacienteRepository';
import { CreatePacienteUseCase } from '../../application/use-cases/paciente/CreatePacienteUseCase';
import { GetPacientesUseCase } from '../../application/use-cases/paciente/GetPacientesUseCase';
import { GetPacienteByIdUseCase } from '../../application/use-cases/paciente/GetPacienteByIdUseCase';
import { UpdatePacienteUseCase } from '../../application/use-cases/paciente/UpdatePacienteUseCase';
import { PacienteController } from '../controllers/PacienteController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: Router = Router();
const prisma = new PrismaClient();

const pacienteRepository = new PacienteRepository(prisma);
const createPacienteUseCase = new CreatePacienteUseCase(pacienteRepository);
const getPacientesUseCase = new GetPacientesUseCase(pacienteRepository);
const getPacienteByIdUseCase = new GetPacienteByIdUseCase(pacienteRepository);
const updatePacienteUseCase = new UpdatePacienteUseCase(pacienteRepository);

const pacienteController = new PacienteController(
  createPacienteUseCase,
  getPacientesUseCase,
  getPacienteByIdUseCase,
  updatePacienteUseCase
);

router.use(authMiddleware);

router.post('/', pacienteController.create);
router.get('/', pacienteController.getAll);
router.get('/:id', pacienteController.getById);
router.patch('/:id', pacienteController.update);

export default router;
