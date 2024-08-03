// public/api/order.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'db', 'order.json');

const router = express.Router();

// 获取订单数据
router.get('/queryOrder', (req, res) => {
  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    res.json({ order: data.order });
  } else {
    res.status(500).json({ error: 'Data file not found' });
  }
});

// 根据用户id获取获取订单数据
router.get('/queryOrderByUser/:userId', (req, res) => {
  const { userId } = req.params;
  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const order = data.order.filter(order => order.user_id === parseInt(userId));
    res.json({ order: order });
  } else {
    res.status(500).json({ error: 'Data file not found' });
  }
});

// 根据订单id获取订单明细数据
router.get('/queryOrderDetail/:orderId', (req, res) => {
  const { orderId } = req.params;
  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const orderDetail = data.detail.filter(dish => dish.order_id === parseInt(orderId));
    res.json({ orderDetail: orderDetail });
  } else {
    res.status(500).json({ error: 'Data file not found' });
  }
});

// 添加订单数据记录
router.post('/addOrder', (req, res) => {
  const newOrder = req.body;

  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    // 自动生成新ID
    const newId = data.order.length ? Math.max(...data.order.map(item => item.id)) + 1 : 1;

    // 生成订单编号：YYYYMMDDHHMMSS + 订单ID
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
    const orderNumber = `${formattedDate}${newId}`;
    
    debugger;
    // 创建新订单项
    const newItem = {
      id: newId,
      order_no: orderNumber,
      amount: newOrder[0].amount,
      user_id: newOrder[0].user_id
    };

    data.order.push(newItem);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.status(201).json({ message: 'Food item added', orderItem: newItem });
  } else {
    res.status(500).json({ error: 'Data file not found' });
  }
});


// 添加订单明细数据记录
router.post('/addOrderDetail', (req, res) => {
  const newOrder = req.body;

  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    // 自动生成新ID
    const newItem = {
      id: data.detail.length ? Math.max(...data.detail.map(item => item.id)) + 1 : 1,
      ...newOrder
    };

    data.detail.push(newItem);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.status(201).json({ message: 'Food item added', orderItem: newItem });
  } else {
    res.status(500).json({ error: 'Data file not found' });
  }
});

module.exports = router;
