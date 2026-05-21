const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#7c3aed,#06b6d4);padding:32px;text-align:center;">
                <div style="display:inline-flex;align-items:center;gap:10px;">
                  <div style="width:44px;height:44px;background:rgba(255,255,255,0.2);border-radius:12px;display:inline-block;line-height:44px;text-align:center;font-size:22px;">⚽</div>
                  <span style="color:white;font-size:24px;font-weight:800;letter-spacing:2px;">NEXUS</span>
                </div>
                <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Football Intelligence</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px 36px;">
                <h2 style="color:white;margin:0 0 8px;font-size:22px;">¡Hola, ${username}! 👋</h2>
                <p style="color:#94a3b8;margin:0 0 28px;font-size:15px;line-height:1.6;">
                  Gracias por unirte a <strong style="color:white;">NEXUS Football</strong>. Solo falta un paso — verifica tu email para activar tu cuenta.
                </p>

                <!-- Button -->
                <div style="text-align:center;margin:32px 0;">
                  <a href="${verifyUrl}"
                     style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:white;text-decoration:none;font-weight:700;font-size:16px;padding:14px 40px;border-radius:12px;letter-spacing:0.5px;">
                    ✅ Verificar mi cuenta
                  </a>
                </div>

                <p style="color:#64748b;font-size:13px;margin:24px 0 0;line-height:1.6;">
                  Si no creaste esta cuenta, puedes ignorar este email.<br>
                  El enlace expira en <strong style="color:#94a3b8;">24 horas</strong>.
                </p>

                <!-- Divider -->
                <hr style="border:none;border-top:1px solid #1e2640;margin:28px 0;">

                <p style="color:#475569;font-size:12px;margin:0;">
                  Si el botón no funciona, copia este enlace:<br>
                  <a href="${verifyUrl}" style="color:#7c3aed;word-break:break-all;">${verifyUrl}</a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#0d1020;padding:20px 36px;text-align:center;">
                <p style="color:#334155;font-size:12px;margin:0;">
                  NEXUS Football · Powered by Groq & LLaMA 3.3 70B
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"NEXUS Football" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '⚽ Verifica tu cuenta en NEXUS Football',
    html,
  });
}

module.exports = { sendVerificationEmail };
