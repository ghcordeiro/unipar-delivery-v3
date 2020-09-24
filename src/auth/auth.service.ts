import { Injectable } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { JwtService } from '@nestjs/jwt';
import { Customer } from 'src/customer/customer.entity';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private jwtService: JwtService
  ) {}

  async validateCustomer(cpf: string, pass: string): Promise<any> {
    const customer = await this.customerService.findOne(cpf);
    console.log(customer)
    if (customer && customer.password == pass) {
      return customer;
    }
  }

  async login(customer: Customer) {
    const response = await this.validateCustomer(customer.cpf, customer.password);
    console.log(response)
    if(response){
      const payload = { cpf: customer.cpf, sub: customer.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    return 'error';
  }
}
