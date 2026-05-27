import { Request, Response } from 'express';
import { z } from 'zod';
import { UserRepository, CreateUsuarioInput } from '../../infrastructure/repositories/UserRepository';

const createUsuarioSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('El email no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rol: z.enum(['ADMIN', 'MEDICO', 'RECEPCIONISTA']),
});

const updateUsuarioSchema = z.object({
  activo: z.boolean().optional(),
});

export class UsuarioController {
  constructor(private userRepository: UserRepository) {}

  // GET /api/usuarios
  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const usuarios = await this.userRepository.findAll();
      res.json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ 
        message: 'Error al obtener usuarios' 
      });
    }
  };

  // POST /api/usuarios
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createUsuarioSchema.parse(req.body);
      
      // Verificar si el email ya existe
      const existingUser = await this.userRepository.findByEmail(validatedData.email);
      if (existingUser) {
        res.status(400).json({ 
          message: 'El email ya está registrado' 
        });
        return;
      }

      const usuario = await this.userRepository.create(validatedData as CreateUsuarioInput);
      res.status(201).json(usuario);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: error.errors[0]?.message || 'Datos inválidos' 
        });
        return;
      }
      console.error('Error al crear usuario:', error);
      res.status(500).json({ 
        message: 'Error al crear usuario' 
      });
    }
  };

  // PATCH /api/usuarios/:id
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const validatedData = updateUsuarioSchema.parse(req.body);

      const usuario = await this.userRepository.update(id, validatedData);
      res.json(usuario);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: error.errors[0]?.message || 'Datos inválidos' 
        });
        return;
      }
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ 
        message: 'Error al actualizar usuario' 
      });
    }
  };
}
