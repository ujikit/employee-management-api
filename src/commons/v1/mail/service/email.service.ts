import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { I18nService } from 'nestjs-i18n';
import * as path from 'path';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly i18n: I18nService,
  ) { }





  async sendRegisterOtpMail(
    subject: string,
    to: string,
    otp: string,
    lang: string,
  ) {
    const title = this.i18n.t('translation.EMAIL.REGISTER_OTP.TITLE', {
      lang,
    });
    const body_line_1 = this.i18n.t(
      'translation.EMAIL.REGISTER_OTP.BODY_LINE_1',
      { lang },
    );
    const body_line_2 = this.i18n.t(
      'translation.EMAIL.REGISTER_OTP.BODY_LINE_2',
      { lang },
    );
    const body_line_3 = this.i18n.t(
      'translation.EMAIL.REGISTER_OTP.BODY_LINE_3',
      { lang },
    );
    const body_line_4 = this.i18n.t(
      'translation.EMAIL.REGISTER_OTP.BODY_LINE_4',
      { lang },
    );
    const best_regards = this.i18n.t('translation.EMAIL.BEST_REGARDS', {
      lang,
    });
    const management_team = this.i18n.t('translation.EMAIL.EMPLOYEEMANAGEMENT_TEAM', { lang });

    const templatePath = path.join(
      process.cwd(),
      'src',
      'commons',
      'mail',
      'templates',
      'otp.html',
    );
    let html = fs.readFileSync(templatePath, 'utf-8');

    html = html
      .replace('{{title}}', title)
      .replace('{{otp}}', otp)
      .replace('{{body_line_1}}', body_line_1)
      .replace('{{body_line_2}}', body_line_2)
      .replace('{{body_line_3}}', body_line_3)
      .replace('{{body_line_4}}', body_line_4)
      .replace('{{best_regards}}', best_regards)
      .replace('{{management_team}}', management_team);

    try {
      await this.mailerService.sendMail({
        to,
        from: '"Employee Management" <fauzizaki15@gmail.com>', // Overrides the default title
        subject: 'OTP Code from EmployeeManagement',
        html,
      });
    } catch (error) {
      console.error('Error sending email', error);
      return { success: false, message: 'Failed to send email' };
    }
  }

}
