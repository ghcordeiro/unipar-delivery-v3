import { Controller, Post, Body, Get, Param, Delete, Put, Res, UseGuards, Req } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerDTO } from './customer.dto';
import { Customer } from './customer.entity';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('customer')
export class CustomerController {
  constructor(private readonly service: CustomerService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  save(@Body() customer: Customer) {
    return this.service.save(customer);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findById(@Param() id: string) {
    return this.service.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(@Param() id: string, @Body() { name, address, cep }: CustomerDTO) {
    const customer = await this.findById(id);
    name ? delete customer.name : null;
    address ? delete customer.address : null;
    cep ? delete customer.cep : null;

    let customerUpdated = Object.assign(customer, { name, address, cep });

    return this.service.save(customerUpdated);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param() id: string, @Res() res: Response) {
    this.service.delete(id);
    return res.status(200).json({ message: "The client was successfully deleted!" });
  }
}
