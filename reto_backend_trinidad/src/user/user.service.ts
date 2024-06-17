import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: 1,
      usuario: 'test01',
      contrasenia: 'test01',
      perfil: 1 // 1: ADMIN | 2: GESTOR
    },
    {
      id: 2,
      usuario: 'test02',
      contrasenia: 'test02',
      perfil: 2 // 1: ADMIN | 2: GESTOR
    }
  ];

  async findOne(usuario: string): Promise<any> {
    return this.users.find(user => user.usuario === usuario);
  }
}
