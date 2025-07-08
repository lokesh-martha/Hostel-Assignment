// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: 'marthalokesh2003@gmail.com',
      pass: 'vwno prci otwg twor', 
    },
  });

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'your-email@gmail.com',
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
