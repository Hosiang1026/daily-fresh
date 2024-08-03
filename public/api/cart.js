// public/api/cart.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'db', 'cart.json');

const router = express.Router();

// 根据用户id获取购物车数据
router.get('/queryCart/:userId', (req, res) => {
  const { userId } = req.params;
  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const carts = data.cart.filter(cart => cart.user_id === parseInt(userId));
    res.json({ cart: carts });
  } else {
    res.status(500).json({ error: 'Data file not found' });
  }
});

// 添加购物车里的记录数据
router.post('/addCart/:userId', (req, res) => {
  const { userId } = req.params;
  const newCartItem = req.body;

  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    const newItem = {
      id: data.cart.length ? Math.max(...data.cart.map(item => item.id)) + 1 : 1, // 自动生成ID
      user_id: parseInt(userId),
      ...newCartItem
    };

    data.cart.push(newItem);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.status(201).json({ message: 'Item added to cart', cartItem: newItem });
  } else {
    res.status(500).json({ error: 'Data file not found' });
  }
});

// 删除购物车里的记录数据
router.delete('/deleteCart/:userId/:itemId', (req, res) => {
  const { userId, itemId } = req.params;

  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const updatedCart = data.cart.filter(cart => !(cart.user_id === parseInt(userId) && cart.id === parseInt(itemId)));
    
    if (updatedCart.length === data.cart.length) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    data.cart = updatedCart;
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.status(200).json({ message: 'Item removed from cart' });
  } else {
    res.status(500).json({ error: 'Data file not found' });
  }
});


// 根据用户ID删除购物车里的记录数据
router.delete('/deleteCartByUserId/:userId', (req, res) => {
  const { userId, itemId } = req.params;

  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const updatedCart = data.cart.filter(cart => !(cart.user_id === parseInt(userId)));
    
    if (updatedCart.length === data.cart.length) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    data.cart = updatedCart;
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.status(200).json({ message: 'Item removed from cart' });
  } else {
    res.status(500).json({ error: 'Data file not found' });
  }
});

module.exports = router;
