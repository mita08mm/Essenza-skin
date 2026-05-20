import { AuthService } from '../../../infrastructure/services/AuthService';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  token: string;
  usuario: {
    id: string;
    email: string;
    nombre: string;
    rol: string;
  };
}

export class LoginUseCase {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const { email, password } = input;

    const usuario = await this.userRepository.findByEmail(email);

    if (!usuario) {
      throw new Error('Credenciales invalidas');
    }

    if (!usuario.activo) {
      throw new Error('Usuario inactivo');
    }

    const isPasswordValid = await this.authService.comparePassword(
      password,
      usuario.password
    );

    if (!isPasswordValid) {
      throw new Error('Credenciales invalidas');
    }

    const token = this.authService.generateToken({
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    return {
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    };
  }
}
