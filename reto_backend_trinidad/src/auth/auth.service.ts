import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from 'src/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(usuario: string, contra: string): Promise<any> {
    const user: User = await this.userService.findOne(usuario);
    if (user && user.contrasenia === contra) {
      const { contrasenia, ...result } = user;
      return result;
    } else {
      return null;
    }
  }

  async tokenGenerate(user: any) {
    const payload = { usuario: user.usuario, id: user.id };
    return this.jwtService.sign(payload);
  }
}
