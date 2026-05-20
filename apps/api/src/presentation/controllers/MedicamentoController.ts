import { Request, Response } from 'express';
import { z } from 'zod';
import { CreateMedicamentoUseCase } from '../../application/use-cases/medicamento/CreateMedicamentoUseCase';
import { GetMedicamentosUseCase } from '../../application/use-cases/medicamento/GetMedicamentosUseCase';
import { GetMedicamentoByIdUseCase } from '../../application/use-cases/medicamento/GetMedicamentoByIdUseCase';
import { UpdateMedicamentoUseCase } from '../../application/use-cases/medicamento/UpdateMedicamentoUseCase';
import { UpdateStockMedicamentoUseCase } from '../../application/use-cases/medicamento/UpdateStockMedicamentoUseCase';
import { GetMedicamentosLowStockUseCase } from '../../application/use-cases/medicamento/GetMedicamentosLowStockUseCase';

const createMedicamentoSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  precio: z.number().nonnegative('El precio debe ser mayor o igual a 0'),
  stock: z.number().int().nonnegative().optional(),
  stockMinimo: z.number().int().nonnegative().optional(),
});

const updateMedicamentoSchema = z.object({
  codigo: z.string().min(1).optional(),
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional(),
  precio: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
  stockMinimo: z.number().int().nonnegative().optional(),
  activo: z.boolean().optional(),
});

const updateStockSchema = z.object({
  cantidad: z.number().int().refine((val) => val !== 0, 'La cantidad debe ser diferente de 0'),
});

export class MedicamentoController {
  constructor(
    private createMedicamentoUseCase: CreateMedicamentoUseCase,
    private getMedicamentosUseCase: GetMedicamentosUseCase,
    private getMedicamentoByIdUseCase: GetMedicamentoByIdUseCase,
    private updateMedicamentoUseCase: UpdateMedicamentoUseCase,
    private updateStockMedicamentoUseCase: UpdateStockMedicamentoUseCase,
    private getMedicamentosLowStockUseCase: GetMedicamentosLowStockUseCase
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const validatedData = createMedicamentoSchema.parse(req.body);
      const medicamento = await this.createMedicamentoUseCase.execute(validatedData);

      res.status(201).json({
        success: true,
        data: medicamento,
        message: 'Medicamento creado exitosamente',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const { includeInactive } = req.query;
      const medicamentos = await this.getMedicamentosUseCase.execute(
        includeInactive === 'true'
      );

      res.status(200).json({
        success: true,
        data: medicamentos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  getLowStock = async (_req: Request, res: Response) => {
    try {
      const medicamentos = await this.getMedicamentosLowStockUseCase.execute();

      res.status(200).json({
        success: true,
        data: medicamentos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'ID inválido',
        });
      }

      const medicamento = await this.getMedicamentoByIdUseCase.execute(id);

      res.status(200).json({
        success: true,
        data: medicamento,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Medicamento no encontrado') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'ID inválido',
        });
      }

      const validatedData = updateMedicamentoSchema.parse(req.body);
      const medicamento = await this.updateMedicamentoUseCase.execute(id, validatedData);

      res.status(200).json({
        success: true,
        data: medicamento,
        message: 'Medicamento actualizado exitosamente',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          details: error.errors,
        });
      }

      if (error instanceof Error && error.message === 'Medicamento no encontrado') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
      });
    }
  };

  updateStock = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'ID inválido',
        });
      }

      const validatedData = updateStockSchema.parse(req.body);
      const medicamento = await this.updateStockMedicamentoUseCase.execute(
        id,
        validatedData.cantidad
      );

      res.status(200).json({
        success: true,
        data: medicamento,
        message: 'Stock actualizado exitosamente',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
      });
    }
  };
}
