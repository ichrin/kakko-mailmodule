
const imaplib = require('imap');
const { inspect } = require('util');

module.exports = async (req, res) => {
  const imap = new imaplib({
    user: process.env.MAILRU_USER, // 从环境变量读取邮箱
    password: process.env.MAILRU_PASSWORD, // 从环境变量读取密码
    host: 'imap.mail.ru',
    port: 993,
    tls: true,
  });

  const openInbox = (cb) => {
    imap.openBox('INBOX', true, cb);
  };

  const fetchEmails = () => {
    return new Promise((resolve, reject) => {
      imap.search(['UNSEEN'], (err, results) => {
        if (err) reject(err);

        const fetch = imap.fetch(results, { bodies: '' });
        const emails = [];

        fetch.on('message', (msg) => {
          let email = '';
          msg.on('body', (stream) => {
            stream.on('data', (chunk) => {
              email += chunk.toString('utf8');
            });
            stream.on('end', () => {
              emails.push(email);
            });
          });
        });

        fetch.on('end', () => {
          resolve(emails);
        });
      });
    });
  };

  try {
    await new Promise((resolve, reject) => {
      imap.once('ready', resolve);
      imap.once('error', reject);
      imap.connect();
    });

    await new Promise((resolve, reject) => {
      openInbox((err) => {
        if (err) reject(err);
        resolve();
      });
    });

    const emails = await fetchEmails();
    imap.end();

    res.status(200).json({ emails });
  } catch (error) {
    res.status(500).json({ message: '邮件接收失败', error: error.message });
  }
}