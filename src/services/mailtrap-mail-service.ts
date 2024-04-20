import { env } from "../config/env";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

import { IMailService, IMessage } from "./mail-service";


export class MailrapMailService implements IMailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS
      }
    });
  }

  async sendMessage({ to, from, subject, html }: IMessage): Promise<void> {
    await this.transporter.sendMail({
      to: {
        name: to.name,
        address: to.address
      },
      from: {
        name: from.name,
        address: from.address
      },
      subject,
      html
    });
  }
}
