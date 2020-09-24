import { Controller, Post, Body} from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() body) {
    console.log('body = ', body)
    const retorno = await this.authService.login(body);
    console.log('retorno = ', retorno);
    return retorno;
  }
}
