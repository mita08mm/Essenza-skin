import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient, TipoDocumento } from '@clinica/database';
import { DocumentoRepository } from '../../infrastructure/repositories/DocumentoRepository';
import { CreateDocumentoUseCase } from '../../application/use-cases/documento/CreateDocumentoUseCase';
import { GetDocumentosByPacienteUseCase } from '../../application/use-cases/documento/GetDocumentosByPacienteUseCase';
import { DeleteDocumentoUseCase } from '../../application/use-cases/documento/DeleteDocumentoUseCase';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();
const documentoRepository = new DocumentoRepository(prisma);

const createDocumentoSchema = z.object({
  pacienteId: z.string().uuid(),
  tratamientoId: z.string().uuid().optional(),
  descripcion: z.string().optional(),
  tipo: z.enum([
    'FOTO_FACIAL',
    'FOTO_CORPORAL',
    'FOTO_CAPILAR',
    'ANALISIS',
    'CONSENTIMIENTO',
    'INFORME',
    'OTRO',
  ]),
});

export class DocumentoController {
  // POST /api/documentos/upload
  static async upload(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'No se ha proporcionado ningún archivo',
        });
        return;
      }

      const validatedData = createDocumentoSchema.parse(req.body);

      const useCase = new CreateDocumentoUseCase(documentoRepository);
      const documento = await useCase.execute({
        ...validatedData,
        nombre: req.file.originalname,
        tipo: validatedData.tipo as TipoDocumento,
        url: `/uploads/${req.file.filename}`,
        tamaño: req.file.size,
        mimeType: req.file.mimetype,
      });

      res.status(201).json({
        success: true,
        data: documento,
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
        error: error instanceof Error ? error.message : 'Error al subir documento',
      });
    }
  }

  // GET /api/pacientes/:pacienteId/documentos
  static async getByPaciente(req: Request, res: Response): Promise<void> {
    try {
      const pacienteId = req.params.pacienteId as string;

      const useCase = new GetDocumentosByPacienteUseCase(documentoRepository);
      const documentos = await useCase.execute(pacienteId);

      res.json({
        success: true,
        data: documentos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener documentos',
      });
    }
  }

  // GET /api/documentos/:id
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const documento = await documentoRepository.findById(id);

      if (!documento) {
        res.status(404).json({
          success: false,
          error: 'Documento no encontrado',
        });
        return;
      }

      res.json({
        success: true,
        data: documento,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener documento',
      });
    }
  }

  // GET /api/documentos/:id/download
  static async download(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const documento = await documentoRepository.findById(id);

      if (!documento) {
        res.status(404).json({
          success: false,
          error: 'Documento no encontrado',
        });
        return;
      }

      const uploadsDir = process.env.UPLOADS_DIR || './uploads';
      const filePath = path.join(uploadsDir, path.basename(documento.url));

      if (!fs.existsSync(filePath)) {
        res.status(404).json({
          success: false,
          error: 'Archivo físico no encontrado',
        });
        return;
      }

      res.download(filePath, documento.nombre);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al descargar documento',
      });
    }
  }

  // DELETE /api/documentos/:id
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const useCase = new DeleteDocumentoUseCase(documentoRepository);
      await useCase.execute(id);

      res.json({
        success: true,
        message: 'Documento eliminado correctamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al eliminar documento',
      });
    }
  }
}
