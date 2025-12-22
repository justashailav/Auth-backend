import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",          // ✅ use ONLY service
    port: 587,                 // ✅ TLS port
    secure: false,             // ✅ MUST be false for 587
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // ✅ avoids Render TLS issues
    },
  });

  await transporter.verify();   // ✅ catches errors early

  await transporter.sendMail({
    from: `"Auth App" <${process.env.SMTP_MAIL}>`,
    to: email,
    subject,
    html: message,
  });
};

export default sendEmail;
