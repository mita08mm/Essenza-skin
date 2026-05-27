import { Request, Response } from 'express';
import { GetConfiguracionUseCase } from '../../application/use-cases/configuracion/GetConfiguracionUseCase';
import { UpdateConfiguracionUseCase } from '../../application/use-cases/configuracion/UpdateConfiguracionUseCase';

export class ConfiguracionController {
  constructor(
    private getConfiguracionUseCase: GetConfiguracionUseCase,
    private updateConfiguracionUseCase: UpdateConfiguracionUseCase
  ) {}

  getConfiguracion = async (req: Request, res: Response) => {
    try {
      const configuracion = await this.getConfiguracionUseCase.execute();
      res.json(configuracion);
    } catch (error) {
      console.error('Error al obtener configuración:', error);
      res.status(500).json({ 
        message: 'Error al obtener la configuración de la clínica' 
      });
    }
  };

  updateConfiguracion = async (req: Request, res: Response) => {
    try {
      const configuracion = await this.updateConfiguracionUseCase.execute(req.body);
      res.json(configuracion);
    } catch (error: any) {
      console.error('Error al actualizar configuración:', error);
      
      if (error.message && error.message.includes('requerido')) {
        return res.status(400).json({ message: error.message });
      }
      
      if (error.message && error.message.includes('válido')) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ 
        message: 'Error al actualizar la configuración de la clínica' 
      });
    }
  };
}
