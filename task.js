// tasks.js
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// 购物车数据文件路径
const dataFilePath = path.join(__dirname, '..', 'db', 'cart.json');

// 每天凌晨 12 点执行清空购物车的任务
cron.schedule('0 0 * * *', () => {
  console.log('Running daily cart cleanup task');

  if (fs.existsSync(dataFilePath)) {
    const data = { cart: [] }; // 清空购物车，设置为空数组

    // 写入空的购物车数据
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    console.log('Cart has been cleared');
  } else {
    console.error('Cart data file not found');
  }
});