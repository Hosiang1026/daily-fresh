// public/api/food.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'db', 'food.json');

const router = express.Router();

// 获取食材数据
router.get('/food', (req, res) => {
  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    res.json({ food: data.food });
  } else {
    res.status(500).json({ error: 'Data file not found' });
  }
});

// 根据分类id获取食材数据(已上架的)
router.get('/food/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const dishes = data.food.filter(dish => dish.category_id === parseInt(categoryId)&& dish.show === 1);
    res.json({ food: dishes });
  } else {
    res.status(500).json({ error: 'Data file not found' });
  }
});

// 添加食材数据记录
router.post('/addFood', (req, res) => {
  const newFoodItem = req.body;

  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    // 自动生成新ID
    const newItem = {
      id: data.food.length ? Math.max(...data.food.map(item => item.id)) + 1 : 1,
      ...newFoodItem
    };

    data.food.push(newItem);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.status(201).json({ message: 'Food item added', foodItem: newItem });
  } else {
    res.status(500).json({ error: 'Data file not found' });
  }
});

// 删除食材数据记录
router.delete('/deleteFood/:id', (req, res) => {
  const { id } = req.params;

  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const updatedFood = data.food.filter(food => food.id !== parseInt(id));

    if (updatedFood.length === data.food.length) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    data.food = updatedFood;
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.status(200).json({ message: 'Food item deleted' });
  } else {
    res.status(500).json({ error: 'Data file not found' });
  }
});

// 修改食材数据记录
router.put('/updateFood/:id', (req, res) => {
  const { id } = req.params;
  const updatedFoodItem = req.body;

  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const index = data.food.findIndex(food => food.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    data.food[index] = { ...data.food[index], ...updatedFoodItem };
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.status(200).json({ message: 'Food item updated', foodItem: data.food[index] });
  } else {
    res.status(500).json({ error: 'Data file not found' });
  }
});

module.exports = router;
