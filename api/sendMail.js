const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  const { name, email, recipient, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILRU_USER, // 从环境变量读取邮箱
      pass: process.env.MAILRU_PASSWORD, // 从环境变量读取密码
    },
  });

  const mailOptions = {
    from: process.env.MAILRU_USER,
    to: recipient,
    subject: `新邮件来自 ${name}`,
    text: `发件人: ${email}\n\n内容: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: '邮件发送成功' });
  } catch (error) {
    res.status(500).json({ message: '邮件发送失败', error: error.message });
  }
}