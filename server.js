const express = require('express');
const app = express();

app.use(express.json());

// 导入邮件发送和接收函数
const sendMail = require('./sendMail');
const checkMail = require('./checkMail');

// 邮件发送接口
app.post('/send', async (req, res) => {
 const result = await sendMail.handler(req);
 res.status(result.statusCode).json(JSON.parse(result.body));
});

// 邮件接收接口
app.get('/check', async (req, res) => {
 const result = await checkMail.handler();
 res.status(result.statusCode).json(JSON.parse(result.body));
});

const port = process.env.LEANCLOUD_APP_PORT || 3000;
app.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});