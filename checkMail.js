const imaplib = require('imap');
const { inspect } = require('util');

exports.handler = async () => {
  const imap = new imaplib({
    user: 'mail', // 替换为您的 mail.ru 邮箱
    password: 'pass',  // 替换为您的 mail.ru 密码
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

    return {
      statusCode: 200,
      body: JSON.stringify({ emails }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '邮件接收失败', error: error.message }),
    };
  }
};