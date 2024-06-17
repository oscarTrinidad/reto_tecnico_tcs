import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/models/user.model';
import { DataResponse } from 'src/models/response.model';
// import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //@UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() usuario: User) {
    let status = false;
    let response: DataResponse;
    // console.log('usuario',usuario);
    try {
        const validacion = await this.authService.validateUser(usuario.usuario,usuario.contrasenia);
        if(validacion){
            const token = await this.authService.tokenGenerate(validacion);
            status = true;
            response = {
                status,
                data: {
                    oUsuario: validacion,
                    sToken: token
                }
            }
        } else {
            status = false;
            response = {
                status,
                message: 'Usuario o contraseña incorrecta!'
            }
        }
    } catch (error) {
        status = false;
        response = {
            status,
            message: error.message
        }
    }

    return response;
  }
}
