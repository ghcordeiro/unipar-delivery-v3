import { Injectable } from '@nestjs/common';
import { FranchiseeService } from '../franchisee/franchisee.service';
import { JwtService } from '@nestjs/jwt';
import { Franchisee } from 'src/franchisee/franchisee.entity';

@Injectable()
export class AuthService {
  constructor(
    private franchiseeService: FranchiseeService,
    private jwtService: JwtService
  ) {}

  async validateFranchisee(cnpj: string, pass: string): Promise<any> {
    const franchisee = await this.franchiseeService.findOne(cnpj);
    console.log(franchisee)
    if (franchisee && franchisee.password == pass) {
      return franchisee;
    }
    return null;
  }

  async login(franchisee: Franchisee) {
    const response = await this.validateFranchisee(franchisee.cnpj, franchisee.password);
    console.log(response)
    if(response){
      const payload = { cnpj: franchisee.cnpj, sub: franchisee.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    return 'error';
  }
}
