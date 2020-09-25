import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { ScheduleModule } from '@nestjs/schedule';

import uploadConfig from './upload';

import { Franchisee } from './franchisee/franchisee.entity';
import { FranchiseeService } from './franchisee/franchisee.service';
import { FranchiseeController } from './franchisee/franchisee.contoller';

import { Product } from './product/product.entity';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.contoller';

import { Order } from './order/order.entity';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.contoller';

import { Stock } from './stock/stock.entity';
import { OrderItem } from './orderItem/orderItem.entity';

import { AuthService } from './auth/auth.service';
import { jwtConstants } from './auth/constants';
import { AppController } from './app.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { ReportService } from './report/report.service';
import { ReportController } from './report/report.controller';
import { Report } from './report/report.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'docker',
      database: 'unipar-delivery',
      entities: [
        Franchisee,
        Product,
        Order,
        OrderItem,
        Stock,
        Report
      ],
      synchronize: true,
      logging: true
    }),
    TypeOrmModule.forFeature([
      Franchisee,
      Product,
      Order,
      OrderItem,
      Stock,
      Report
    ]),
    MulterModule.register({
      dest: uploadConfig.directory,
      storage: uploadConfig.storage
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: uploadConfig.directory,
    //   serveRoot: '/files'
    // }),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [
    FranchiseeController,
    ProductController,
    OrderController,
    AppController,
    ReportController
  ],
  providers: [
    FranchiseeService,
    ProductService,
    OrderService,
    AuthService,
    ReportService,
    JwtStrategy
  ],
  exports: [AuthService]
})

export class AppModule { }
