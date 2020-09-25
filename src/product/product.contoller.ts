import { Controller, Post, Body, Get, Param, Delete, Put, Res, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { ProductDTO } from './product.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import crypto from 'crypto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { fi } from 'date-fns/locale';


const imageFileFilter = (request, file, callback) => {
  const fileHash = crypto.randomBytes(10).toString('hex');
  const fileName = `${fileHash}-${file.originalname}`;

  return callback(null, fileName);
};
@Controller('product')
export class ProductController {

  constructor(private readonly service: ProductService) { }

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
  @Post()
  save(@Body() product: Product) {
    return this.service.save(product);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(@Param() id: string, @Body() { name, price, code }: ProductDTO) {
    const product = await this.findById(id);
    name ? delete product.name : null;
    price ? delete product.price : null;
    code ? delete product.code : null;

    let productUpdated = Object.assign(product, { name, price, code });

    return this.service.save(productUpdated);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param() id: string, @Res() res: Response) {
    await this.service.delete(id);
    return res.status(200).json({ message: "The product was successfully deleted!" });
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:id/photo")
  @UseInterceptors(FileInterceptor('file'))
  async uploadedFile(@Param() id: string, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {

    const fileHash = crypto.randomBytes(10).toString('hex');
    const fileName = `${fileHash}-${file.originalname}`;

    const product = await this.findById(id);
    console.log(file)

    product.photo = fileName;

    this.service.update(id, product);

    return res.status(204).json();
  }

}
