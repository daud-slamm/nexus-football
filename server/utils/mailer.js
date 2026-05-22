const fetch = require('node-fetch');

async function sendVerificationEmail(toEmail, username, token) {
  const verifyUrl = `${process.env.CLIENT_URL}/verify?token=${token}`;

  const html = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"></head>
  <body style="margin:0;padding:0;background:#0a0d16;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0d16;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="520" cellpadding="0" cellspacing="0" style="background:#13162a;border-radius:16px;border:1px solid #1e2640;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(135deg,#7c3aed,#06b6d4);padding:32px;text-align:center;">
                <span style="color:white;font-size:24px;font-weight:800;letter-spacing:2px;">⚽ NEXUS Football</span>
                <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Football Intelligence</p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 36px;">
                <h2 style="color:white;margin:0 0 8px;font-size:22px;">¡Hola, ${username}! 👋</h2>
                <p style="color:#94a3b8;margin:0 0 28px;font-size:15px;line-height:1.6;">
                  Gracias por unirte a <strong style="color:white;">NEXUS Football</strong>. Solo falta un paso — verifica tu email para activar tu cuenta.
                </p>
                <div style="text-align:center;margin:32px 0;">
                  <a href="${verifyUrl}"
                     style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:white;text-decoration:none;font-weight:700;font-size:16px;padding:14px 40px;border-radius:12px;">
                    ✅ Verificar mi cuenta
                  </a>
                </div>
                <p style="color:#64748b;font-size:13px;margin:24px 0 0;line-height:1.6;">
                  Si no creaste esta cuenta, ignora este email.<br>
                  El enlace expira en <strong style="color:#94a3b8;">24 horas</strong>.
                </p>
                <hr style="border:none;border-top:1px solid #1e2640;margin:28px 0;">
                <p style="color:#475569;font-size:12px;margin:0;">
                  Si el botón no funciona, copia este enlace:<br>
                  <a href="${verifyUrl}" style="color:#7c3aed;word-break:break-all;">${verifyUrl}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#0d1020;padding:20px 36px;text-align:center;">
                <p style="color:#334155;font-size:12px;margin:0;">NEXUS Football · Powered by Groq & LLaMA 3.3 70B</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'NEXUS Football', email: process.env.EMAIL_USER },
      to: [{ email: toEmail, name: username }],
      subject: '⚽ Verifica tu cuenta en NEXUS Football',
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Brevo error: ${err}`);
  }
}

module.exports = { sendVerificationEmail };
