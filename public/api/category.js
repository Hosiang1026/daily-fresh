// public/api/category.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'db', 'category.json');

const router = express.Router();

// 获取分类数据
router.get('/categories', (req, res) => {
  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    res.json({ categories: data.category });
  } else {
    res.status(500).json({ error: 'Data file not found' });
  }
});

module.exports = router;
