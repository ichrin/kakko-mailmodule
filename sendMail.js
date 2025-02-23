const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // 从请求体中提取表单数据
  const { name, email, recipient, message } = JSON.parse(event.body);

  // 配置 mail.ru 的 SMTP 服务
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: 'mail', // 替换为您的 mail.ru 邮箱
      pass: 'pass',      // 替换为您的 mail.ru 密码
    },
  });

  // 配置邮件选项
  const mailOptions = {
    from: 'mail',   // 替换为您的 mail.ru 邮箱
    to: recipient,                       // 使用表单中的收件人地址
    subject: `新邮件来自 ${name}`,
    text: `发件人: ${email}\n\n内容: ${message}`,
  };

  try {
    // 发送邮件
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: '邮件发送成功' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '邮件发送失败', error: error.message }),
    };
  }
};