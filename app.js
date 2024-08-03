const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const route = require('./route');
const categoryApi = require('./public/api/category');
const foodApi = require('./public/api/food');
const cartApi = require('./public/api/cart');
const orderApi = require('./public/api/order');

const app = express();
const port = process.env.PORT || 5000;

// 引入定时任务
require('./task');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// 使用从 route.js 导入的路由
app.use('/', route);

// 使用从 public/api/category.js 导入的 API 路由
app.use('/api', categoryApi);

// 使用从 public/api/food.js 导入的 API 路由
app.use('/api', foodApi);

// 使用从 public/api/cart.js 导入的 API 路由
app.use('/api', cartApi);

// 使用从 public/api/order.js 导入的 API 路由
app.use('/api', orderApi);

// 其他 API 端点...

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
