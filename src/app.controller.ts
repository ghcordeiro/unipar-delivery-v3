import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) { }

  @Post('auth/login')
  async login(@Body() body, @Res() response) {
    const retorno = await this.authService.login(body);
    console.log('Retorno = ', retorno)
    if (retorno === 'error') {
      return response.status(401).json({ message: 'Unauthorized' });
    }
    return response.status(200).json(retorno);
  }
}
