import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Franchisee } from './franchisee.entity';

@Injectable()
export class FranchiseeService {

  constructor(
    @InjectRepository(Franchisee)
    private readonly repository: Repository<Franchisee>) {
  }

  save(franchisee: Franchisee) {
    return this.repository.save(franchisee);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }

  update(id: string, franchisee: Franchisee) {
    return this.repository.update(id, franchisee);
  }

  findAll() {
    return this.repository.find();
  }

  findById(id: string) {
    return this.repository.findOne(id);
  }

  findOne(cnpj: string) {
    return this.repository.findOne({
      where: {
        cnpj
      }
    })
  }
}
