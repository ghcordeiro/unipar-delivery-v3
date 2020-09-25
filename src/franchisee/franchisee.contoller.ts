import { Controller, Post, Body, Get, Param, Delete, Put, Res, UseGuards, Req } from '@nestjs/common';
import { FranchiseeService } from './franchisee.service';
import { FranchiseeDTO } from './franchisee.dto';
import { Franchisee } from './franchisee.entity';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('franchisee')
export class FranchiseeController {
  constructor(private readonly service: FranchiseeService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  save(@Body() franchisee: Franchisee) {
    return this.service.save(franchisee);
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
  async update(@Param() id: string, @Body() { name, address, cep }: FranchiseeDTO) {
    const franchisee = await this.findById(id);
    name ? delete franchisee.name : null;
    address ? delete franchisee.address : null;
    cep ? delete franchisee.cep : null;

    let franchiseeUpdated = Object.assign(franchisee, { name, address, cep });

    return this.service.save(franchiseeUpdated);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param() id: string, @Res() res: Response) {
    this.service.delete(id);
    return res.status(200).json({ message: "The client was successfully deleted!" });
  }
}
