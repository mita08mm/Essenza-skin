import { Request, Response } from 'express';
import { z } from 'zod';
import { CreateRecetaUseCase } from '../../application/use-cases/receta/CreateRecetaUseCase';
import { GetRecetasUseCase } from '../../application/use-cases/receta/GetRecetasUseCase';
import { GetRecetaByIdUseCase } from '../../application/use-cases/receta/GetRecetaByIdUseCase';
import { GetRecetasByPacienteUseCase } from '../../application/use-cases/receta/GetRecetasByPacienteUseCase';
import { UpdateRecetaUseCase } from '../../application/use-cases/receta/UpdateRecetaUseCase';
import { MarcarItemsEntregadosUseCase } from '../../application/use-cases/receta/MarcarItemsEntregadosUseCase';
import { GetItemsPendientesEntregaUseCase } from '../../application/use-cases/receta/GetItemsPendientesEntregaUseCase';

// Zod schemas para validación
const itemRecetaSchema = z.object({
  tipo: z.enum(['MEDICAMENTO', 'INSUMO']),
  itemId: z.string().uuid(),
  nombre: z.string().min(1, 'El nombre es requerido'),
  cantidad: z.number().int().positive('La cantidad debe ser mayor a 0'),
  dosis: z.string().optional(),
  frecuencia: z.string().optional(),
  duracion: z.string().optional(),
  precio: z.number().nonnegative().optional(),
});

const createRecetaSchema = z.object({
  pacienteId: z.string().uuid(),
  evolucionId: z.string().uuid().optional(),
  usuarioId: z.string().uuid(),
  indicaciones: z.string().optional(),
  items: z.array(itemRecetaSchema).min(1, 'La receta debe tener al menos un item'),
});

const updateRecetaSchema = z.object({
  indicaciones: z.string().optional(),
});

const marcarItemsSchema = z.object({
  items: z.array(
    z.object({
      itemId: z.string().uuid(),
      estado: z.enum(['PRESCRITO', 'ENTREGADO']),
    })
  ).min(1, 'Debe proporcionar al menos un item'),
});

export class RecetaController {
  constructor(
    private createRecetaUseCase: CreateRecetaUseCase,
    private getRecetasUseCase: GetRecetasUseCase,
    private getRecetaByIdUseCase: GetRecetaByIdUseCase,
    private getRecetasByPacienteUseCase: GetRecetasByPacienteUseCase,
    private updateRecetaUseCase: UpdateRecetaUseCase,
    private marcarItemsEntregadosUseCase: MarcarItemsEntregadosUseCase,
    private getItemsPendientesEntregaUseCase: GetItemsPendientesEntregaUseCase
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const validatedData = createRecetaSchema.parse(req.body);
      const receta = await this.createRecetaUseCase.execute(validatedData);

      res.status(201).json({
        success: true,
        data: receta,
        message: 'Receta creada exitosamente',
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
      const { pacienteId } = req.query;

      let recetas;
      if (pacienteId && typeof pacienteId === 'string') {
        recetas = await this.getRecetasByPacienteUseCase.execute(pacienteId);
      } else {
        recetas = await this.getRecetasUseCase.execute();
      }

      res.status(200).json({
        success: true,
        data: recetas,
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

      const receta = await this.getRecetaByIdUseCase.execute(id);

      res.status(200).json({
        success: true,
        data: receta,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Receta no encontrada') {
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

      const validatedData = updateRecetaSchema.parse(req.body);

      const receta = await this.updateRecetaUseCase.execute(id, validatedData);

      res.status(200).json({
        success: true,
        data: receta,
        message: 'Receta actualizada exitosamente',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          details: error.errors,
        });
      }

      if (error instanceof Error && error.message === 'Receta no encontrada') {
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

  marcarItemsEntregados = async (req: Request, res: Response) => {
    try {
      const validatedData = marcarItemsSchema.parse(req.body);
      const result = await this.marcarItemsEntregadosUseCase.execute(validatedData.items);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Items actualizados exitosamente',
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

  getItemsPendientes = async (req: Request, res: Response) => {
    try {
      const { pacienteId } = req.query;

      const items = await this.getItemsPendientesEntregaUseCase.execute(
        pacienteId && typeof pacienteId === 'string' ? pacienteId : undefined
      );

      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };
}
