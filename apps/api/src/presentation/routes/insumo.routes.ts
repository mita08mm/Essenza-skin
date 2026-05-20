import { Router } from 'express';
import { PrismaClient } from '@clinica/database';
import { InsumoController } from '../controllers/InsumoController';
import { InsumoRepository } from '../../infrastructure/repositories/InsumoRepository';
import { CreateInsumoUseCase } from '../../application/use-cases/insumo/CreateInsumoUseCase';
import { GetInsumosUseCase } from '../../application/use-cases/insumo/GetInsumosUseCase';
import { GetInsumoByIdUseCase } from '../../application/use-cases/insumo/GetInsumoByIdUseCase';
import { UpdateInsumoUseCase } from '../../application/use-cases/insumo/UpdateInsumoUseCase';
import { UpdateStockInsumoUseCase } from '../../application/use-cases/insumo/UpdateStockInsumoUseCase';
import { GetInsumosLowStockUseCase } from '../../application/use-cases/insumo/GetInsumosLowStockUseCase';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

const insumoRepository = new InsumoRepository(prisma);
const createInsumoUseCase = new CreateInsumoUseCase(insumoRepository);
const getInsumosUseCase = new GetInsumosUseCase(insumoRepository);
const getInsumoByIdUseCase = new GetInsumoByIdUseCase(insumoRepository);
const updateInsumoUseCase = new UpdateInsumoUseCase(insumoRepository);
const updateStockInsumoUseCase = new UpdateStockInsumoUseCase(insumoRepository);
const getInsumosLowStockUseCase = new GetInsumosLowStockUseCase(insumoRepository);

const insumoController = new InsumoController(
  createInsumoUseCase,
  getInsumosUseCase,
  getInsumoByIdUseCase,
  updateInsumoUseCase,
  updateStockInsumoUseCase,
  getInsumosLowStockUseCase
);

router.post('/', authMiddleware, insumoController.create);
router.get('/', authMiddleware, insumoController.getAll);
router.get('/low-stock', authMiddleware, insumoController.getLowStock);
router.get('/:id', authMiddleware, insumoController.getById);
router.patch('/:id', authMiddleware, insumoController.update);
router.post('/:id/stock', authMiddleware, insumoController.updateStock);

export default router;
