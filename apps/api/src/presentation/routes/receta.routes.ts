import { Router } from 'express';
import { PrismaClient } from '@clinica/database';
import { RecetaController } from '../controllers/RecetaController';
import { RecetaRepository } from '../../infrastructure/repositories/RecetaRepository';
import { CreateRecetaUseCase } from '../../application/use-cases/receta/CreateRecetaUseCase';
import { GetRecetasUseCase } from '../../application/use-cases/receta/GetRecetasUseCase';
import { GetRecetaByIdUseCase } from '../../application/use-cases/receta/GetRecetaByIdUseCase';
import { GetRecetasByPacienteUseCase } from '../../application/use-cases/receta/GetRecetasByPacienteUseCase';
import { UpdateRecetaUseCase } from '../../application/use-cases/receta/UpdateRecetaUseCase';
import { MarcarItemsEntregadosUseCase } from '../../application/use-cases/receta/MarcarItemsEntregadosUseCase';
import { GetItemsPendientesEntregaUseCase } from '../../application/use-cases/receta/GetItemsPendientesEntregaUseCase';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Dependency Injection
const recetaRepository = new RecetaRepository(prisma);
const createRecetaUseCase = new CreateRecetaUseCase(recetaRepository);
const getRecetasUseCase = new GetRecetasUseCase(recetaRepository);
const getRecetaByIdUseCase = new GetRecetaByIdUseCase(recetaRepository);
const getRecetasByPacienteUseCase = new GetRecetasByPacienteUseCase(recetaRepository);
const updateRecetaUseCase = new UpdateRecetaUseCase(recetaRepository);
const marcarItemsEntregadosUseCase = new MarcarItemsEntregadosUseCase(recetaRepository);
const getItemsPendientesEntregaUseCase = new GetItemsPendientesEntregaUseCase(recetaRepository);

const recetaController = new RecetaController(
  createRecetaUseCase,
  getRecetasUseCase,
  getRecetaByIdUseCase,
  getRecetasByPacienteUseCase,
  updateRecetaUseCase,
  marcarItemsEntregadosUseCase,
  getItemsPendientesEntregaUseCase
);

// Routes
router.post('/', authMiddleware, recetaController.create);
router.get('/', authMiddleware, recetaController.getAll);
router.get('/items-pendientes', authMiddleware, recetaController.getItemsPendientes);
router.get('/:id', authMiddleware, recetaController.getById);
router.patch('/:id', authMiddleware, recetaController.update);
router.post('/marcar-entregados', authMiddleware, recetaController.marcarItemsEntregados);

export default router;
