export type EmailLang = 'en' | 'zh';

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const looksLikeHtml = (s: string): boolean => /<\/?[a-z][\s\S]*>/i.test(s);

/** Bungkus teks polos menjadi paragraf sederhana jika bukan HTML */
export const ensureHtml = (body: string): string => {
  if (!body) return '';
  if (looksLikeHtml(body)) return body;
  const lines = body.split(/\r?\n/).map((l) => escapeHtml(l));
  return `<p>${lines.join('<br/>')}</p>`;
};

function makeOtpBlock(otp: string): string {
  return `
<table role="presentation" width="100%" style="margin-top:16px;">
  <tr>
    <td align="center">
      <div style="
        display:inline-block;
        padding:10px 0px;
        border-radius:12px;
        background:#ffffff;
        font-family:'Inter Display','Inter',Segoe UI,Arial,sans-serif;
        font-weight:600;
        font-style:normal;
        font-size:18px;
        line-height:150%;
        letter-spacing:0.005em;
        text-align:center;
        color:#0f172a;
      " data-otp-block="true">${escapeHtml(otp.trim())}</div>
    </td>
  </tr>
</table>`.trim();
}

function rxEscape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function injectOtpBlock(bodyHtml: string, otpCode?: string): string {
  if (!otpCode || !otpCode.trim()) return bodyHtml;

  const otp = otpCode.trim();
  const otpEsc = rxEscape(otp);

  const anyToken = `(?::otp_code|\\{\\{\\s*otp_code\\s*\\}\\}|${otpEsc})`;

  const fullPara = new RegExp(
    `<p[^>]*>\\s*(?:<strong[^>]*>\\s*${anyToken}\\s*<\\/strong>|${anyToken})\\s*<\\/p>`,
    'i'
  );
  if (fullPara.test(bodyHtml)) {
    return bodyHtml.replace(fullPara, makeOtpBlock(otp));
  }

  const inlineStrong = new RegExp(
    `<strong[^>]*>\\s*${anyToken}\\s*<\\/strong>`,
    'i'
  );
  if (inlineStrong.test(bodyHtml)) {
    return bodyHtml.replace(inlineStrong, makeOtpBlock(otp));
  }

  const bareToken = new RegExp(anyToken, 'i');
  if (bareToken.test(bodyHtml)) {
    return bodyHtml.replace(bareToken, makeOtpBlock(otp));
  }

  return bodyHtml + makeOtpBlock(otp);
}

export function buildEmailHtml(params: {
  title: string;
  bodyHtml: string;
  lang: EmailLang;
  brandName?: string;
  otpCode?: string;
  assetsBaseUrl?: string;
}): string {
  const year = new Date().getFullYear();
  const brand = params.brandName || 'EmployeeManagement';
  const safeTitle = params.title || brand;

  // ---- URL gambar (PNG) ----
  const heroDesktopUrl = `https://ibb.co.com/RTB3gWxr`;
  const heroMobileUrl = `https://ibb.co.com/HLGghnSs`;
  const logoUrl = `https://ibb.co.com/4ZVKc2Ch`;

  const css = `
    @media (prefers-color-scheme: dark) {
      .bg { background:#0b0b0b !important; color:#e5e7eb !important; }
      .card { background:#0b0b0b !important; border-color:rgba(255,255,255,0.1) !important; }
      .muted { color:#9ca3af !important; }
      .foot { background:#111315 !important; }
    }
    @media only screen and (max-width:480px) {
      .wrap { padding:12px !important; }
      .hero-desktop { display:none !important; }
      .hero-mobile { display:block !important; }
    }
  `;

  const htmlBody = injectOtpBlock(ensureHtml(params.bodyHtml), params.otpCode);

  return `<!DOCTYPE html>
<html lang="${params.lang}">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${escapeHtml(safeTitle)}</title>
<!-- Google Fonts: Inter -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
<style type="text/css">${css}</style>
</head>
<body class="bg" style="margin:0;padding:0;background:#ffffff;color:#0f172a;font-family:'Inter Display','Inter',Segoe UI,Arial,sans-serif;">
  <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
    <tr>
      <td align="center">
        <div class="wrap" style="max-width:600px;margin:0 auto;padding:24px 0px;">
          <table role="presentation" width="100%" class="card" style="border-radius:24px;overflow:hidden;background:#ffffff;">
            <tr>
              <td style="line-height:0;font-size:0;">
                <div class="hero-desktop" style="display:block;width:100%;height:auto;">
                  <img src="https://www.shutterstock.com/image-photo/ai-hr-analytics-kpi-performance-260nw-2759433945.jpg" alt="EmployeeManagement hero" width="600" style="display:block;width:100%;height:auto;border:0;outline:none;text-decoration:none;" />
                </div>
                <div class="hero-mobile" style="display:none;width:100%;height:auto;">
                  <img src="https://www.shutterstock.com/image-photo/ai-hr-analytics-kpi-performance-260nw-2759433945.jpg" alt="EmployeeManagement hero mobile" width="600" style="display:block;width:100%;height:auto;border:0;outline:none;text-decoration:none;" />
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 0px;">
                <h1 style="
                  margin:0 0 10px;
                  font-family:'Inter Display','Inter',Segoe UI,Arial,sans-serif;
                  font-weight:600;
                  font-style:normal;
                  font-size:22px;
                  line-height:100%;
                  letter-spacing:0;
                  color:#0f172a;
                ">${escapeHtml(safeTitle)}</h1>

                <div style="
                  font-family:'Inter Display','Inter',Segoe UI,Arial,sans-serif;
                  font-weight:500;
                  font-style:normal;
                  font-size:16px;
                  line-height:143%;
                  letter-spacing:0.01em;
                  color:#0f172a;
                ">${htmlBody}</div>
              </td>
            </tr>
          </table>

          <div style="height:24px;"></div>

          <!-- Footer -->
          <table role="presentation" width="100%" class="foot" style="background:#f4f4f5;border-radius:16px;">
            <tr>
              <td align="center" style="padding:14px 12px;">
                <span class="muted" style="
                  display:inline-block;
                  font-family:'Inter Display','Inter',Segoe UI,Arial,sans-serif;
                  font-style:normal;
                  font-weight:600;
                  font-size:14px;
                ">© ${year}, </span>
                <span style="
                  display:inline-flex;
                  align-items:center;
                  gap:8px;
                  vertical-align:middle;
                  color:#0f172a;
                ">
                  <img src="https://cdn-icons-png.flaticon.com/512/3090/3090108.png" width="18" height="18" alt="" aria-hidden="true" style="display:inline-block;border:0;outline:none;" />
                  <span style="
                    font-family:'Inter Display','Inter',Segoe UI,Arial,sans-serif;
                    font-weight:600;
                    font-style:normal;
                    font-size:16px;
                    line-height:125%;
                    letter-spacing:0;
                  ">${escapeHtml(brand)}</span>
                </span>
              </td>
            </tr>
          </table>

        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
