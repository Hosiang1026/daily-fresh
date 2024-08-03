document.addEventListener('DOMContentLoaded', () => {
  // 页面初始化时，默认显示食材列表
  showModule('home');

  //新鲜食材展示
  document.getElementById('show-home').addEventListener('click', () => {
    document.getElementById('home').style.display = 'block';
    document.getElementById('food-section').style.display = 'block';
    document.getElementById('order').style.display = 'none';
    document.getElementById('order-section').style.display = 'none';
    document.getElementById('my').style.display = 'none';
    document.getElementById('my-section').style.display = 'none';
  });

  //购物订单展示
  document.getElementById('show-order').addEventListener('click', () => {
    document.getElementById('home').style.display = 'none';
    document.getElementById('food-section').style.display = 'none';
    document.getElementById('order').style.display = 'block';
    document.getElementById('order-section').style.display = 'block';
    document.getElementById('my').style.display = 'none';
    document.getElementById('my-section').style.display = 'none';
  });

  //个人中心展示
  document.getElementById('show-my').addEventListener('click', () => {
    document.getElementById('home').style.display = 'none';
    document.getElementById('food-section').style.display = 'none';
    document.getElementById('order').style.display = 'none';
    document.getElementById('order-section').style.display = 'none';
    document.getElementById('my').style.display = 'block';
    document.getElementById('my-section').style.display = 'block';
  });

});

// 显示指定的模块
function showModule(moduleId) {
  const modules = document.querySelectorAll('.module');
  modules.forEach(module => {
    if(module.id === moduleId){
      module.style.display = 'block';
      return;
    }else{
      module.style.display = 'none';
    }
    
  });

  if (moduleId === 'home') {
    queryFood(1); // 默认加载分类 ID 为 1 的菜品
  }

  if (moduleId === 'cart') {
    loadCart(1); // 只有点击购物清单时才加载购物车数据
  }

  if (moduleId === 'my') {
    loadmy(1); // 只有点击个人中心时才加载个人数据
  }
}


// function fetchCategories() {
//   fetch('http://localhost:3000/api/categories')
//     .then(response => response.json())
//     .then(data => {
//       const categoriesList = document.getElementById('menu');
//       categoriesList.innerHTML = '';

//       data.categories.forEach(category => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//         <td>${category.id}</td>
//         <td>${category.name}</td>
//         <td>
//         <button onclick="deleteDish(${category.id})">删除</button>
//         <button onclick="showUpdateDishForm(${category.id}, '${category.name}')">更新</button>
//         </td>`;
//         categoriesList.appendChild(row);
//       });
//     })
//     .catch(error => console.error('Error loading categories:', error));
// }

// 加载食材数据
function queryFood(categoryId) {
  fetch(`/api/food/${categoryId}`)
    .then(response => response.json())
    .then(data => {
      const foodList = document.getElementById('food-list');
      foodList.innerHTML = ''; // 清空现有菜品

      data.food.forEach(dish => {
        const dishElement = document.createElement('div');
        dishElement.className = 'food-item';
        dishElement.innerHTML = `
          <img src="${dish.image}" alt="${dish.name}">
          <h3>${dish.name}</h3>
          <p>¥${dish.price}</p>
          <button onclick="addCart(1, ${categoryId}, '${dish.name}', '${dish.price}', '${dish.image}')">加入购物车</button>
        `;
        foodList.appendChild(dishElement);
      });
    })
    .catch(error => console.error('Error loading dishes:', error));
}

// 获取购物车数据
async function loadCart(userId) {
      //添加表头
      const foodHead = document.getElementById('order-head');
      foodHead.innerHTML = `
          <thead>
          <tr>
            <th>ID</th>
            <th>名称</th>
            <th>图片</th>
            <th>单价</th>
            <th>数量</th>
            <th>金额</th>
            <th>操作</th>
          </tr>
        </thead>
        `;
        //添加操作功能
        const foodFunction = document.getElementById('order-function');
        foodFunction.innerHTML = `
        <a>合计金额: ¥<span id="total-amount">0</span></a>
        <button onclick="addOrder(1)">结算</button>
        `;

    fetch(`/api/queryCart/${userId}`)
    .then(response => response.json())
    .then(data => {
    const cartItems = data.cart;
    
    // 获取购物车容器
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = ''; // 清空购物车内容
    
    // 遍历购物车数据并创建表格行
    cartItems.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td><img src="${item.image}" alt="${item.name}" style="max-width: 100%; height: 60px; border-radius: 4px;"></td>
        <td>¥${item.price}</td>
        <td>${item.count}</td>
        <td>¥${item.price * item.count}</td>
        <td>
        <button onclick="deleteCart(${userId}, ${item.id})">删除</button>
        </td>`;
      orderList.appendChild(row);
    });
    
  }).catch(error => console.error('Error loading cart:', error));

  // 更新合计金额
  updateTotalAmount();
}

// 更新合计金额
function updateTotalAmount() {
  const orderList = document.getElementById('order-list');
  const totalAmountElement = document.getElementById('total-amount');
  let totalAmount = 0;
  orderList.querySelectorAll('tr').forEach(row => {
    const totalPriceElement = row.children[4];
    if (totalPriceElement) {
      const totalPrice = parseFloat(totalPriceElement.textContent.replace('¥', ''));
      totalAmount += totalPrice;
    }
  });

  totalAmountElement.textContent = totalAmount.toFixed(2);
}

// 添加购物车里的记录数据
function addCart(userId, categoryId, name, price, image) {
  fetch(`/api/addCart/${userId}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: userId,
    category_id: categoryId,
    name: name,
    price: price,
    count: 1,
    image: image,
    amount: 6
  })
})
.then(response => response.json())
.then(data => {
  console.log(data);
  if (data.message) {
    Swal.fire({
      text: '操作成功',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      customClass: {
        popup: 'small-popup'
      }
    });
    loadCart(userId);
  } else {
    Swal.fire({
      text: '操作成功',
      icon: 'error',
      timer: 1500,
      showConfirmButton: false,
      customClass: {
        popup: 'small-popup'
      }
    });
  }
})
.catch(error => console.error('Error add cart:', error));
}

// 删除购物车里的记录数据
function deleteCart(userId, itemId) {
  fetch(`/api/deleteCart/${userId}/${itemId}`, {
  method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    loadCart(userId)
    console.log(data)
  })
  .catch(error => console.error('Error delete cart:', error));
}

function deleteCartByUserId(userId) {
  fetch(`/api/deleteCartByUserId/${userId}`, {
  method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    loadCart(userId)
    console.log(data)
  })
  .catch(error => console.error('Error delete cart:', error));
}

// 购物车结算生成订单
function addOrder(userId) {
    const data = [];
    const rowData = {
      amount: 12,
      user_id: userId,
    };
    data.push(rowData);

  fetch(`/api/addOrder`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
  console.log(data);
  if (data.message) {
    Swal.fire({
      text: '操作成功',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      customClass: {
        popup: 'small-popup'
      }
    });
    //生成订单明细
    addOrderDetail(userId)
  } else {
    Swal.fire({
      text: '操作成功',
      icon: 'error',
      timer: 1500,
      showConfirmButton: false,
      customClass: {
        popup: 'small-popup'
      }
    });
  }
})
.catch(error => console.error('Error add cart:', error));
}


// 购物车结算订单明细
function addOrderDetail(userId) {
  const table = document.getElementById('order-list');
  const rows = table.querySelectorAll('tbody tr');
  const data = [];

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const rowData = {
      id: cells[0].value,
      name: cells[1].value,
      price: parseFloat(cells[2].value),
      count: cells[3].value,
      amount: cells[4].value
    };
    data.push(rowData);
  });

  fetch(`/api/addOrderDetail`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
  console.log(data);
  if (data.message) {
    Swal.fire({
      text: '操作成功',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      customClass: {
        popup: 'small-popup'
      }
    });
    //清空购物车
    deleteCartByUserId(userId);
  } else {
    Swal.fire({
      text: '操作成功',
      icon: 'error',
      timer: 1500,
      showConfirmButton: false,
      customClass: {
        popup: 'small-popup'
      }
    });
  }
})
.catch(error => console.error('Error add cart:', error));
}


// 根据用户id获取订单数据
async function queryOrderByUser(userId) {
  //添加表头
  const foodHead = document.getElementById('order-head');
  foodHead.innerHTML = `
      <thead>
      <tr>
        <th>ID</th>
        <th>订单编号</th>
        <th>金额</th>
        <th>用户</th>
        <th>操作</th>
      </tr>
    </thead>
    `;
    //添加操作功能
    const foodFunction = document.getElementById('order-function');
    foodFunction.innerHTML = `
    <a>合计金额: ¥<span id="total-amount">0</span></a>
    `;

fetch(`/api/queryOrderByUser/${userId}`)
.then(response => response.json())
.then(data => {
const cartItems = data.order;

// 获取订单容器
const orderList = document.getElementById('order-list');
orderList.innerHTML = ''; 

// 遍历订单数据并创建表格行
cartItems.forEach(item => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${item.id}</td>
    <td>${item.order_no}</td>
    <td>¥${item.amount}</td>
    <td>${item.user_id}</td>
    <td>
    <button onclick="orderDetail(${userId}, ${item.id})">详细</button>
    </td>`;
  orderList.appendChild(row);
});

}).catch(error => console.error('Error loading cart:', error));

// 更新合计金额
//updateOrderTotalAmount();
}

function showUpdateDishForm(id, name, price, image) {
  // Here you would implement a form to update the dish
  console.log('Update dish:', id, name, price, image);
}
