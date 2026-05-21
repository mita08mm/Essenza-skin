import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@clinica/database';
import { TratamientoRepository } from '../../infrastructure/repositories/TratamientoRepository';
import { HistoriaClinicaRepository } from '../../infrastructure/repositories/HistoriaClinicaRepository';
import { CreateTratamientoUseCase } from '../../application/use-cases/tratamiento/CreateTratamientoUseCase';
import { GetTratamientoByIdUseCase } from '../../application/use-cases/tratamiento/GetTratamientoByIdUseCase';
import { GetTratamientosByPacienteUseCase } from '../../application/use-cases/tratamiento/GetTratamientosByPacienteUseCase';
import { UpdateTratamientoUseCase } from '../../application/use-cases/tratamiento/UpdateTratamientoUseCase';
import type { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();
const tratamientoRepository = new TratamientoRepository(prisma);
const historiaClinicaRepository = new HistoriaClinicaRepository(prisma);

// Schemas de validación
const medidasSchema = z.object({
  peso: z.number().optional(),
  talla: z.number().optional(),
  imc: z.number().optional(),
  circunferenciaCadera: z.number().optional(),
  circunferenciaCintura: z.number().optional(),
  circunferenciaBrazo: z.number().optional(),
  circunferenciaPierna: z.number().optional(),
  porcentajeGrasa: z.number().optional(),
  masaMuscular: z.number().optional(),
}).optional();

const createTratamientoSchema = z.object({
  pacienteId: z.string().uuid(),
  citaId: z.string().uuid().optional(),
  tipoTratamiento: z.enum(['FACIAL', 'CORPORAL', 'CAPILAR', 'COMBINADO']),
  nombreTratamiento: z.string().min(1, 'Nombre del tratamiento requerido'),
  zonaTratada: z.string().min(1, 'Zona tratada requerida'),
  objetivo: z.string().min(1, 'Objetivo del tratamiento requerido'),
  evaluacionInicial: z.string().optional(),
  protocolo: z.string().optional(),
  parametros: z.any().optional(),
  reaccionesInmediatas: z.string().optional(),
  sesionNumero: z.number().int().positive().optional(),
  totalSesiones: z.number().int().positive().optional(),
  observaciones: z.string().optional(),
  proximaSesion: z.string().datetime().optional(),
  medidas: medidasSchema,
});

const updateTratamientoSchema = z.object({
  tipoTratamiento: z.enum(['FACIAL', 'CORPORAL', 'CAPILAR', 'COMBINADO']).optional(),
  zonaTratada: z.string().optional(),
  objetivo: z.string().optional(),
  evaluacionInicial: z.string().optional(),
  protocolo: z.string().optional(),
  parametros: z.any().optional(),
  reaccionesInmediatas: z.string().optional(),
  sesionNumero: z.number().int().positive().optional(),
  totalSesiones: z.number().int().positive().optional(),
  observaciones: z.string().optional(),
  proximaSesion: z.string().datetime().optional(),
  medidas: medidasSchema,
});

export class TratamientoController {
  // POST /api/tratamientos
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const validatedData = createTratamientoSchema.parse(req.body);
      const usuarioId = req.user?.userId;

      if (!usuarioId) {
        res.status(401).json({
          success: false,
          error: 'Usuario no autenticado',
        });
        return;
      }

      const useCase = new CreateTratamientoUseCase(
        tratamientoRepository,
        historiaClinicaRepository
      );

      const tratamiento = await useCase.execute({
        ...validatedData,
        usuarioId,
        proximaSesion: validatedData.proximaSesion
          ? new Date(validatedData.proximaSesion)
          : undefined,
      });

      res.status(201).json({
        success: true,
        data: tratamiento,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          details: error.errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al crear tratamiento',
      });
    }
  }

  // GET /api/tratamientos/:id
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (Array.isArray(id)) {
        res.status(400).json({ success: false, error: 'ID inválido' });
        return;
      }

      const useCase = new GetTratamientoByIdUseCase(tratamientoRepository);
      const tratamiento = await useCase.execute(id);

      res.json({
        success: true,
        data: tratamiento,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Tratamiento no encontrado') {
        res.status(404).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener tratamiento',
      });
    }
  }

  // GET /api/pacientes/:pacienteId/tratamientos
  static async getByPaciente(req: Request, res: Response): Promise<void> {
    try {
      const { pacienteId } = req.params;
      
      if (Array.isArray(pacienteId)) {
        res.status(400).json({ success: false, error: 'ID inválido' });
        return;
      }

      const useCase = new GetTratamientosByPacienteUseCase(tratamientoRepository);
      const tratamientos = await useCase.execute(pacienteId);

      res.json({
        success: true,
        data: tratamientos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener tratamientos',
      });
    }
  }

  // PUT /api/tratamientos/:id
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (Array.isArray(id)) {
        res.status(400).json({ success: false, error: 'ID inválido' });
        return;
      }
      
      const validatedData = updateTratamientoSchema.parse(req.body);

      const useCase = new UpdateTratamientoUseCase(tratamientoRepository);
      const tratamiento = await useCase.execute(id, {
        ...validatedData,
        proximaSesion: validatedData.proximaSesion
          ? new Date(validatedData.proximaSesion)
          : undefined,
      });

      res.json({
        success: true,
        data: tratamiento,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          details: error.errors,
        });
        return;
      }

      if (error instanceof Error && error.message === 'Tratamiento no encontrado') {
        res.status(404).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al actualizar tratamiento',
      });
    }
  }
}
