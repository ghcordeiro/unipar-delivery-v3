import { Injectable } from '@nestjs/common';
import { Repository, QueryRunner, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import nodemailer from 'nodemailer';
import { Order } from 'src/order/order.entity';
import { addHours } from 'date-fns';

interface IMailType {
  sum: string;
  name: string;
}

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly repository: Repository<Report>) {
  }

  private async findMailByStatusFalse(): Promise<Report[]> {
    return await this.repository.find({
      where: {
        status: false
      },
      order: {
        updatedAt: "ASC"
      }
    })
  }

  private returnDate() {
    const newDate = new Date(addHours(new Date().getTime(), 3));
    const year = newDate.getFullYear();
    const month = ('0' + (newDate.getMonth() + 1)).slice(-2);
    const day = ('0' + newDate.getDate()).slice(-2);

    const dateStr = `${year}/${month}/${day}`;

    return dateStr;
  }

  private async insertMail(): Promise<void> {
    const mails: IMailType[] = await getConnection()
      .getRepository(Order)
      .createQueryBuilder('order')
      .select('SUM(total), franchiseeTable.name')
      .innerJoin('order.franchisee', 'franchiseeTable')
      .where('"order"."order_date" = :date', { date: this.returnDate() })
      .groupBy('franchiseeTable.name')
      .execute();

    let mailBody = '';
    mails.forEach(mail => {
      mailBody = `${mailBody}\n Filial: ${mail.name} = R$ ${mail.sum}`
    });

    const mail = this.repository.create({
      from: 'mail@mail.com',
      to: 'adm@mail.com',
      body: mailBody,
      subject: 'Relatório diário',
      attemps: 0,
      status: false
    });

    await this.repository.save(mail);
  }

  async sendMail() {
    await this.insertMail();

    const pendingMails = await this.findMailByStatusFalse();

    if (pendingMails.length === 0) {
      return;
    }

    const mailSender = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "cc34e3a6a12c6e",
        pass: "17175edecddd5b"
      }
    });

    for (let i = 0; i < pendingMails.length; i++) {
      if (!pendingMails[i].status) {
        console.info("SendMail initialize {}", new Date().toLocaleString());

        try {
          console.log(pendingMails[i])
          await mailSender.sendMail({
            from: `"Notification Report" ${pendingMails[i].from}`,
            to: `${pendingMails[i].to}`,
            subject: `${pendingMails[i].subject}`,
            text: `${pendingMails[i].body}`,
          });
          pendingMails[i].status = true;
          pendingMails[i].updatedAt = new Date();

          console.info("SendMail finalize {}", new Date().toLocaleString());
          this.repository.save(pendingMails[i]);
        } catch (e) {
          pendingMails[i].updatedAt = new Date();
          console.log(e)
          console.info("SendMail error {}", new Date().toLocaleString());
          this.repository.save(pendingMails[i]);
        }
      }
    }
  }
}
