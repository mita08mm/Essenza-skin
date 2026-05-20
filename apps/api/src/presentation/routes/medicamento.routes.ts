import { Router } from 'express';
import { PrismaClient } from '@clinica/database';
import { MedicamentoController } from '../controllers/MedicamentoController';
import { MedicamentoRepository } from '../../infrastructure/repositories/MedicamentoRepository';
import { CreateMedicamentoUseCase } from '../../application/use-cases/medicamento/CreateMedicamentoUseCase';
import { GetMedicamentosUseCase } from '../../application/use-cases/medicamento/GetMedicamentosUseCase';
import { GetMedicamentoByIdUseCase } from '../../application/use-cases/medicamento/GetMedicamentoByIdUseCase';
import { UpdateMedicamentoUseCase } from '../../application/use-cases/medicamento/UpdateMedicamentoUseCase';
import { UpdateStockMedicamentoUseCase } from '../../application/use-cases/medicamento/UpdateStockMedicamentoUseCase';
import { GetMedicamentosLowStockUseCase } from '../../application/use-cases/medicamento/GetMedicamentosLowStockUseCase';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

const medicamentoRepository = new MedicamentoRepository(prisma);
const createMedicamentoUseCase = new CreateMedicamentoUseCase(medicamentoRepository);
const getMedicamentosUseCase = new GetMedicamentosUseCase(medicamentoRepository);
const getMedicamentoByIdUseCase = new GetMedicamentoByIdUseCase(medicamentoRepository);
const updateMedicamentoUseCase = new UpdateMedicamentoUseCase(medicamentoRepository);
const updateStockMedicamentoUseCase = new UpdateStockMedicamentoUseCase(medicamentoRepository);
const getMedicamentosLowStockUseCase = new GetMedicamentosLowStockUseCase(medicamentoRepository);

const medicamentoController = new MedicamentoController(
  createMedicamentoUseCase,
  getMedicamentosUseCase,
  getMedicamentoByIdUseCase,
  updateMedicamentoUseCase,
  updateStockMedicamentoUseCase,
  getMedicamentosLowStockUseCase
);

router.post('/', authMiddleware, medicamentoController.create);
router.get('/', authMiddleware, medicamentoController.getAll);
router.get('/low-stock', authMiddleware, medicamentoController.getLowStock);
router.get('/:id', authMiddleware, medicamentoController.getById);
router.patch('/:id', authMiddleware, medicamentoController.update);
router.post('/:id/stock', authMiddleware, medicamentoController.updateStock);

export default router;
