import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReportService } from './report.service';


@Controller('report')
export class ReportController {

  constructor(private readonly service: ReportService) {
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  sendMail(){
    this.service.sendMail();
  }

}
