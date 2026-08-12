import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { buildEmailHtml, EmailLang, ensureHtml } from './email-template.helper';

export type Lang = 'en' | 'zh';
type InterpValue = string | number | boolean | Date | null | undefined;
type CustomerContact = {
  id: number;
  full_name: string | null;
  email: string | null;
  phone_code: string | null;
  phone_number: string | null;
  language: string | null;
  is_registered?: boolean | number | null;
};

@Injectable()
export class NotifyEngineService {
  private readonly logger = new Logger(NotifyEngineService.name);
  private readonly brandName = process.env.EMAIL_BRAND_NAME || 'EmployeeManagement';
  private readonly defaultFrom = process.env.EMAIL_FROM || 'support@test.app';

  constructor(
    private readonly db: DatabaseService,
    private readonly mailer: MailerService,
  ) { }

  /**
   * Returns true when the given store is registered under
   * IS_ALLOWED_SMS_EMAIL_NOTIFICATION_STORES. Stores on this list bypass the
   * global IS_ALLOWED_SMS / IS_ALLOWED_EMAIL / IS_ALLOWED_NOTIFICATION toggles
   * and always receive SMS, email, and push notifications.
   */

  public async isEmailEnabled(storeId?: number | null): Promise<boolean> {
    return true;
  }

  /* ---------------- EMAIL ---------------- */

  async sendEmailByTemplate(params: {
    section: string;
    name: string;
    to: string;
    lang?: Lang;
    vars?: Record<string, string | number | boolean>;
    storeId?: number | null;
  }) {
    const lang = this.normalizeLocale(params.lang) as EmailLang;

    let subject = '';
    let rawContent = '';

    subject = this.interpolate('OTP Code from EmployeeManagement', params.vars);
    rawContent = this.interpolate('here the otp code:', params.vars);
    const otpCode = typeof params.vars?.otp_code === 'string' ? String(params.vars!.otp_code) : undefined;

    const contentHtml = ensureHtml(rawContent);
    const html = buildEmailHtml({
      title: subject,
      bodyHtml: contentHtml,
      lang,
      brandName: this.brandName,
      otpCode,
    });

    const emailEnabled = await this.isEmailEnabled(params.storeId);

    if (!emailEnabled && params.section !== 'Internal') {
      return;
    }

    await this.mailer.sendMail({
      to: params.to,
      from: '"Employee Management" <fauzizaki15@gmail.com>', // Overrides the default title
      subject: 'OTP Code from EmployeeManagement',
      html,
    }).catch(err =>
      this.logger.error('sendMail failed', err),
    );
  }

  /* ---------------- Utils ---------------- */

  private normalizeLocale(lang?: string): Lang {
    const v = (lang ?? '').toLowerCase();
    return v.startsWith('zh') ? 'zh' : 'en';
  }

  private interpolate(
    template: string,
    variables: Readonly<Record<string, InterpValue>> = {},
  ): string {
    if (!template) return template;

    const valueToString = (value: InterpValue): string => {
      if (value == null) return '';
      if (value instanceof Date) return value.toISOString();
      return String(value);
    };

    const replaceWithVariable = (_match: string, token: string): string =>
      valueToString(variables[token]);

    const CURLY = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
    const COLON = /:([a-zA-Z0-9_]+)/g;

    return template.replace(CURLY, replaceWithVariable).replace(COLON, replaceWithVariable);
  }

  private fallback(section: string, name: string, lang: EmailLang) {
    if (section === 'Staff' && name === 'Login') {
      return lang === 'zh'
        ? { subject: 'EmployeeManagement 登入驗證碼', content: '歡迎回到 EmployeeManagement！請使用以下一次性驗證碼完成登入。' }
        : { subject: 'EmployeeManagement Sign In OTP Code', content: 'Welcome back to EmployeeManagement! Please use the OTP below to sign in.' };
    }
    if (section === 'Customer' && name === 'Reset Password Proposal') {
      return lang === 'zh'
        ? { subject: 'EmployeeManagement 重設密碼驗證碼', content: '要完成重設密碼，請使用以下一次性驗證碼。此代碼有效 15 分鐘。' }
        : { subject: 'EmployeeManagement Reset Password OTP Code', content: 'To complete your password reset, please use the OTP below. This code is valid for 15 minutes.' };
    }
    return { subject: `${section}/${name}`, content: '<p>{{message}}</p>' };
  }

  private stripHtml(s: string): string {
    return (s ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }


}
