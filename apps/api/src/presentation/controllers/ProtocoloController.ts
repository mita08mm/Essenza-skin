import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@clinica/database';
import { ProtocoloRepository } from '../../infrastructure/repositories/ProtocoloRepository';
import { CreateProtocoloUseCase } from '../../application/use-cases/protocolo/CreateProtocoloUseCase';
import { GetProtocoloByIdUseCase } from '../../application/use-cases/protocolo/GetProtocoloByIdUseCase';
import { GetProtocolosByPacienteUseCase } from '../../application/use-cases/protocolo/GetProtocolosByPacienteUseCase';
import { GetProtocolosUseCase } from '../../application/use-cases/protocolo/GetProtocolosUseCase';
import type { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();
const protocoloRepository = new ProtocoloRepository(prisma);

const createItemProtocoloSchema = z.object({
  productoId: z.string().uuid(),
  nombre: z.string().min(1, 'Nombre requerido'),
  cantidad: z.number().int().positive(),
  aplicacion: z.string().min(1, 'Aplicación requerida'),
  frecuencia: z.string().min(1, 'Frecuencia requerida'),
  duracion: z.string().optional(),
  precio: z.number().optional(),
  estado: z.enum(['INDICADO', 'ADQUIRIDO', 'EN_USO', 'COMPLETADO']).optional(),
});

const createProtocoloSchema = z.object({
  pacienteId: z.string().uuid(),
  tratamientoId: z.string().uuid().optional(),
  nombre: z.string().min(1, 'Nombre del protocolo requerido'),
  indicaciones: z.string().optional(),
  duracion: z.string().optional(),
  items: z.array(createItemProtocoloSchema).min(1, 'Debe incluir al menos un producto'),
});

export class ProtocoloController {
  // POST /api/protocolos
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log('=== POST /api/protocolos ===');
      console.log('Body recibido:', JSON.stringify(req.body, null, 2));
      console.log('Usuario:', req.user);
      
      const validatedData = createProtocoloSchema.parse(req.body);
      const usuarioId = req.user?.userId;

      if (!usuarioId) {
        res.status(401).json({
          success: false,
          error: 'Usuario no autenticado',
        });
        return;
      }

      const useCase = new CreateProtocoloUseCase(protocoloRepository);
      const protocolo = await useCase.execute({
        ...validatedData,
        usuarioId,
      });

      res.status(201).json({
        success: true,
        data: protocolo,
        message: 'Protocolo de cuidados creado exitosamente',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Error de validación Zod:', JSON.stringify(error.errors, null, 2));
        res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          details: error.errors,
        });
        return;
      }

      console.error('Error al crear protocolo:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al crear protocolo',
      });
    }
  }

  // GET /api/protocolos
  static async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const useCase = new GetProtocolosUseCase(protocoloRepository);
      const protocolos = await useCase.execute();

      res.json({
        success: true,
        data: protocolos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener protocolos',
      });
    }
  }

  // GET /api/protocolos/:id
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (Array.isArray(id)) {
        res.status(400).json({ success: false, error: 'ID inválido' });
        return;
      }
      
      const useCase = new GetProtocoloByIdUseCase(protocoloRepository);
      const protocolo = await useCase.execute(id);

      res.json({
        success: true,
        data: protocolo,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Protocolo no encontrado') {
        res.status(404).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener protocolo',
      });
    }
  }

  // GET /api/pacientes/:pacienteId/protocolos
  static async getByPaciente(req: Request, res: Response): Promise<void> {
    try {
      const { pacienteId } = req.params;
      
      if (Array.isArray(pacienteId)) {
        res.status(400).json({ success: false, error: 'ID inválido' });
        return;
      }
      
      const useCase = new GetProtocolosByPacienteUseCase(protocoloRepository);
      const protocolos = await useCase.execute(pacienteId);

      res.json({
        success: true,
        data: protocolos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener protocolos',
      });
    }
  }
}
