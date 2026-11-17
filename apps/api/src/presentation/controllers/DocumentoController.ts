import { Request, Response } from 'express';
import { z } from 'zod';
import { CategoriaFoto, Documento, PrismaClient, TipoDocumento } from '@clinica/database';
import { DocumentoRepository } from '../../infrastructure/repositories/DocumentoRepository';
import { CreateDocumentoUseCase } from '../../application/use-cases/documento/CreateDocumentoUseCase';
import { GetDocumentosByPacienteUseCase } from '../../application/use-cases/documento/GetDocumentosByPacienteUseCase';
import { DeleteDocumentoUseCase } from '../../application/use-cases/documento/DeleteDocumentoUseCase';
import { UpdateDocumentoUseCase } from '../../application/use-cases/documento/UpdateDocumentoUseCase';
import { UpdateCategoriaDocumentosUseCase } from '../../application/use-cases/documento/UpdateCategoriaDocumentosUseCase';

const prisma = new PrismaClient();
const documentoRepository = new DocumentoRepository(prisma);

const updateDocumentoSchema = z.object({
  nombre: z.string().min(1).optional(),
  kind: z.enum(['FOTO', 'DOCUMENTO']).optional(),
});

const categoriaSchema = z.enum(['antes', 'despues']).nullable();

const archivoSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
  nombre: z.string().optional(),
});

const createDocumentoSchema = z
  .object({
    pacienteId: z.string().uuid(),
    kind: z.enum(['FOTO', 'DOCUMENTO']),
    categoria: categoriaSchema.optional(),
    url: z.string().url().optional(),
    publicId: z.string().optional(),
    nombre: z.string().optional(),
    archivos: z.array(archivoSchema).min(1).max(50).optional(),
  })
  .refine((d) => d.archivos || (d.url && d.publicId !== undefined), {
    message: 'Se requiere url y publicId, o una lista de archivos',
  });

const updateCategoriaSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(200),
  categoria: categoriaSchema,
});

function mapKindToTipo(kind: 'FOTO' | 'DOCUMENTO'): TipoDocumento {
  return kind;
}

function mapTipoToKind(tipo: TipoDocumento): 'FOTO' | 'DOCUMENTO' {
  return tipo;
}

function serializeDocumento(documento: Documento) {
  return {
    id: documento.id,
    nombre: documento.nombre,
    kind: mapTipoToKind(documento.tipo),
    url: documento.url,
    categoria: documento.categoria ?? null,
    createdAt: documento.createdAt,
  };
}

export class DocumentoController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const pacienteId = typeof req.query.pacienteId === 'string' ? req.query.pacienteId : undefined;
      const documentos = pacienteId
        ? await documentoRepository.findByPaciente(pacienteId)
        : await documentoRepository.findAll();
      res.json({ success: true, data: documentos.map(serializeDocumento) });
    } catch (_error) {
      res.status(500).json({ success: false, error: 'Error al listar documentos' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { pacienteId, kind, categoria, url, publicId, nombre, archivos } =
        createDocumentoSchema.parse(req.body);

      const categoriaFinal: CategoriaFoto | null = kind === 'FOTO' ? (categoria ?? null) : null;
      const toData = (a: { url: string; publicId: string; nombre?: string }) => ({
        pacienteId,
        tipo: kind,
        url: a.url,
        publicId: a.publicId,
        categoria: categoriaFinal,
        nombre: a.nombre ?? a.url.split('/').pop() ?? 'sin-nombre',
      });

      const useCase = new CreateDocumentoUseCase(documentoRepository);

      if (archivos) {
        const documentos = await useCase.executeMany(archivos.map(toData));
        res.status(201).json({ success: true, data: documentos.map(serializeDocumento) });
        return;
      }

      const documento = await useCase.execute(
        toData({ url: url!, publicId: publicId!, nombre }),
      );
      res.status(201).json({ success: true, data: serializeDocumento(documento) });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: 'Datos inválidos', details: error.errors });
        return;
      }
      console.error('Error al guardar documento:', error);
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Error al guardar documento' });
    }
  }

  static async updateCategoria(req: Request, res: Response): Promise<void> {
    try {
      const { ids, categoria } = updateCategoriaSchema.parse(req.body);
      const useCase = new UpdateCategoriaDocumentosUseCase(documentoRepository);
      const actualizados = await useCase.execute(ids, categoria);
      res.json({ success: true, data: { actualizados, categoria } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: 'Datos inválidos', details: error.errors });
        return;
      }
      res.status(500).json({ success: false, error: 'Error al actualizar la categoría' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const validatedData = updateDocumentoSchema.parse(req.body);
      const { kind, ...rest } = validatedData;
      const useCase = new UpdateDocumentoUseCase(documentoRepository);
      const documento = await useCase.execute(id, {
        ...rest,
        ...(kind ? { tipo: mapKindToTipo(kind) } : {}),
      });
      res.json({ success: true, data: serializeDocumento(documento) });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: 'Datos inválidos', details: error.errors });
        return;
      }
      res.status(500).json({ success: false, error: 'Error al actualizar documento' });
    }
  }

  static async getByPaciente(req: Request, res: Response): Promise<void> {
    try {
      const pacienteId = req.params.pacienteId as string;
      const useCase = new GetDocumentosByPacienteUseCase(documentoRepository);
      const documentos = await useCase.execute(pacienteId);
      res.json({ success: true, data: documentos.map(serializeDocumento) });
    } catch (_error) {
      res.status(500).json({ success: false, error: 'Error al obtener documentos' });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const documento = await documentoRepository.findById(id);
      if (!documento) {
        res.status(404).json({ success: false, error: 'Documento no encontrado' });
        return;
      }
      res.json({ success: true, data: serializeDocumento(documento) });
    } catch (_error) {
      res.status(500).json({ success: false, error: 'Error al obtener documento' });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const useCase = new DeleteDocumentoUseCase(documentoRepository);
      await useCase.execute(id);
      res.json({ success: true, message: 'Documento eliminado correctamente' });
    } catch (_error) {
      res.status(500).json({ success: false, error: 'Error al eliminar documento' });
    }
  }
}