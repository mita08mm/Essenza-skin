import { Request, Response } from 'express';
import { z } from 'zod';
import { CreateInsumoUseCase } from '../../application/use-cases/insumo/CreateInsumoUseCase';
import { GetInsumosUseCase } from '../../application/use-cases/insumo/GetInsumosUseCase';
import { GetInsumoByIdUseCase } from '../../application/use-cases/insumo/GetInsumoByIdUseCase';
import { UpdateInsumoUseCase } from '../../application/use-cases/insumo/UpdateInsumoUseCase';
import { UpdateStockInsumoUseCase } from '../../application/use-cases/insumo/UpdateStockInsumoUseCase';
import { GetInsumosLowStockUseCase } from '../../application/use-cases/insumo/GetInsumosLowStockUseCase';

const createInsumoSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  precio: z.number().nonnegative('El precio debe ser mayor o igual a 0'),
  stock: z.number().int().nonnegative().optional(),
  stockMinimo: z.number().int().nonnegative().optional(),
});

const updateInsumoSchema = z.object({
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

export class InsumoController {
  constructor(
    private createInsumoUseCase: CreateInsumoUseCase,
    private getInsumosUseCase: GetInsumosUseCase,
    private getInsumoByIdUseCase: GetInsumoByIdUseCase,
    private updateInsumoUseCase: UpdateInsumoUseCase,
    private updateStockInsumoUseCase: UpdateStockInsumoUseCase,
    private getInsumosLowStockUseCase: GetInsumosLowStockUseCase
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const validatedData = createInsumoSchema.parse(req.body);
      const insumo = await this.createInsumoUseCase.execute(validatedData);

      res.status(201).json({
        success: true,
        data: insumo,
        message: 'Insumo creado exitosamente',
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
      const insumos = await this.getInsumosUseCase.execute(
        includeInactive === 'true'
      );

      res.status(200).json({
        success: true,
        data: insumos,
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
      const insumos = await this.getInsumosLowStockUseCase.execute();

      res.status(200).json({
        success: true,
        data: insumos,
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

      const insumo = await this.getInsumoByIdUseCase.execute(id);

      res.status(200).json({
        success: true,
        data: insumo,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Insumo no encontrado') {
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

      const validatedData = updateInsumoSchema.parse(req.body);
      const insumo = await this.updateInsumoUseCase.execute(id, validatedData);

      res.status(200).json({
        success: true,
        data: insumo,
        message: 'Insumo actualizado exitosamente',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          details: error.errors,
        });
      }

      if (error instanceof Error && error.message === 'Insumo no encontrado') {
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
      const insumo = await this.updateStockInsumoUseCase.execute(
        id,
        validatedData.cantidad
      );

      res.status(200).json({
        success: true,
        data: insumo,
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
