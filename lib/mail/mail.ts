import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOTP = async (email: string, otp: string) => {
    const mailOptions = {
        from: `"NOS Collective" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'NOS Security Protocol: Verification Code',
        html: `
      <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border-radius: 20px;">
        <h1 style="font-style: italic; text-transform: uppercase; letter-spacing: -2px; font-weight: 900; font-size: 40px; color: #00f0ff; margin-bottom: 30px;">NOS Collective</h1>
        <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 12px; color: #666; font-weight: bold; margin-bottom: 40px;">Security Verification Protocol Initiated</p>
        
        <div style="background-color: #111; border: 1px solid #333; padding: 30px; border-radius: 20px; text-align: center;">
          <p style="text-transform: uppercase; letter-spacing: 1px; font-size: 14px; margin-bottom: 20px;">Your access code is:</p>
          <div style="font-size: 48px; font-weight: 900; color: #fff; letter-spacing: 10px; margin-bottom: 20px; font-family: monospace;">${otp}</div>
          <p style="color: #444; font-size: 10px; text-transform: uppercase; font-weight: bold;">Expires in 10 minutes</p>
        </div>

        <p style="margin-top: 40px; color: #444; font-size: 10px; text-transform: uppercase; line-height: 1.6;">
          If you did not initiate this request, your transmission is being monitored. Disregard this message immediately.
        </p>
      </div>
    `,
    };

    return transporter.sendMail(mailOptions);
};
