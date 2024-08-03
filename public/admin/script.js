document.addEventListener('DOMContentLoaded', () => {
  // 页面初始化时，默认显示食材列表
  showModule('home');
  
  //食材管理展示
  document.getElementById('show-food').addEventListener('click', () => {
    document.getElementById('home').style.display = 'block';
    document.getElementById('food-section').style.display = 'block';
    document.getElementById('order').style.display = 'none';
    document.getElementById('order-section').style.display = 'none';
    document.getElementById('user').style.display = 'none';
    document.getElementById('user-section').style.display = 'none';
  });

  //订单管理展示
  document.getElementById('show-order').addEventListener('click', () => {
    document.getElementById('home').style.display = 'none';
    document.getElementById('food-section').style.display = 'none';
    document.getElementById('order').style.display = 'block';
    document.getElementById('order-section').style.display = 'block';
    document.getElementById('user').style.display = 'none';
    document.getElementById('user-section').style.display = 'none';
  });

  //用户管理展示
  document.getElementById('show-user').addEventListener('click', () => {
    document.getElementById('home').style.display = 'none';
    document.getElementById('food-section').style.display = 'none';
    document.getElementById('order').style.display = 'none';
    document.getElementById('order-section').style.display = 'none';
    document.getElementById('user').style.display = 'block';
    document.getElementById('user-section').style.display = 'block';
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
    queryFood(); // 默认加载食材管理
  }

  if (moduleId === 'order') {
    queryOrder(); // 只有点击订单管理时才加载订单数据
  }

  if (moduleId === 'user') {
    queryUser(); // 只有点击用户管理时才加载用户数据
  }
}


//查询食材数据记录
function queryFood() {
  const foodHead = document.getElementById('food-head');
  foodHead.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>名称</th>
        <th>价格</th>
        <th>图片</th>
        <th>操作</th>
      </tr>
    </thead>
    `;
    //添加操作功能
    const foodFunction = document.getElementById('food-function');
    foodFunction.innerHTML = `
    <button onclick="addFood()">添加</button>
    `;

  fetch('/api/food')
    .then(response => response.json())
    .then(data => {
      const dishesList = document.getElementById('food-list');
      dishesList.innerHTML = '';

      data.food.forEach(dish => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${dish.id}</td>
          <td>${dish.name}</td>
          <td>¥${dish.price}</td>
          <td><img src="${dish.image}" alt="${dish.name}" style="width: 50px; height: auto;"></td>
          <td>
          ${dish.show === 0 ? `<button onclick="updateShow(${dish.id}, 1)">上架</button>` : `<button onclick="updateShow(${dish.id}, 0)">下架</button>`}
          <button onclick="deleteFood(${dish.id})">删除</button>
          <button onclick="updateFood(${dish.id}, '${dish.name}', ${dish.price}, '${dish.image}')">更新</button>
          </td>
        `;
        dishesList.appendChild(row);
      });
    })
    .catch(error => console.error('Error loading dishes:', error));
}

// 查询食材分类数据记录
function queryCategory() {
  //添加表头
  const foodHead = document.getElementById('food-head');
  foodHead.innerHTML = `
    <thead>
      <tr>
      <th>ID</th>
      <th>名称</th>
      <th>操作</th>
      </tr>
    </thead>
    `;
    //添加操作功能
    const foodFunction = document.getElementById('food-function');
    foodFunction.innerHTML = `
    <button onclick="addCategory()">添加</button>
    `;
    
  fetch('/api/categories')
    .then(response => response.json())
    .then(data => {
      const categoriesList = document.getElementById('food-list');
      categoriesList.innerHTML = '';

      data.categories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${category.id}</td>
        <td>${category.name}</td>
        <td>
        <button onclick="deleteCategory(${category.id})">删除</button>
        <button onclick="updateCategory(${category.id}, '${category.name}')">更新</button>
        </td>`;
        categoriesList.appendChild(row);
      });
    })
    .catch(error => console.error('Error loading categories:', error));
}

// 添加食材数据记录
function addFood() {
  Swal.fire({
    title: '添加食材',
    html: `
      <input id="swal-input1" class="swal2-input" placeholder="食材名称">
      <input id="swal-input2" class="swal2-input" placeholder="食材价格" type="number">
      <input id="swal-input3" class="swal2-input" placeholder="食材图片">
      <input id="swal-input4" class="swal2-input" placeholder="食材分类id" type="number">
      <button id="custom-close-btn" class="swal2-confirm swal2-styled" style="margin-top: 10px;">Close</button>
    `,
    focusConfirm: false,
    preConfirm: () => {
      const name = Swal.getPopup().querySelector('#swal-input1').value;
      const price = Swal.getPopup().querySelector('#swal-input2').value;
      //const image = Swal.getPopup().querySelector('#swal-input3').value;
      const image = "/images/cucumber.jpg";
      const categoryId = Swal.getPopup().querySelector('#swal-input4').value;
      //const show = Swal.getPopup().querySelector('#swal-input5').value;
      const show = 1;
      if (!name || !price || !image || !categoryId || show === '') {
        Swal.showValidationMessage('Please fill all fields');
      }
      return { name, price, image, category_id: parseInt(categoryId), show: parseInt(show) };
    },
    willOpen: () => {
      // 添加自定义关闭按钮的点击事件
      document.getElementById('custom-close-btn').addEventListener('click', () => {
        Swal.close();
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const foodItem = result.value;

      // 发送 POST 请求添加食材数据
      fetch('/api/addFood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(foodItem)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Food item added:', data);
        if (data.message) {
          Swal.fire({
            text: 'Food item added successfully',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          // 重新加载食材数据
          queryFood();
        }
      })
      .catch(error => {
        console.error('Error adding food item:', error);
        Swal.fire({
          text: 'Error adding food item',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false
        });
      });
    }
  });
}


// 更新食材数据记录
function updateFood(id, currentName, currentPrice, currentImage) {
  // 显示一个弹框，允许用户输入新的食材信息
  Swal.fire({
    title: '更新食材',
    html: `
      <input id="swal-input1" class="swal2-input" placeholder="Name" value="${currentName}">
      <input id="swal-input2" class="swal2-input" placeholder="Price" type="number" value="${currentPrice}">
    `,

    // <input id="swal-input3" class="swal2-input" placeholder="Image URL" value="${currentImage}">
    focusConfirm: false,
    preConfirm: () => {
      const updatedName = Swal.getPopup().querySelector('#swal-input1').value;
      const updatedPrice = Swal.getPopup().querySelector('#swal-input2').value;
      // const updatedImage = Swal.getPopup().querySelector('#swal-input3').value;
      const updatedImage = currentImage;
      return { name: updatedName, price: updatedPrice, image: updatedImage };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedFoodItem = result.value;
      // 发送 PUT 请求更新食材数据
      fetch(`/api/updateFood/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFoodItem)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Food item updated:', data);
        if (data.message) {
          Swal.fire({
            text: '操作成功',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          // 重新加载食材数据
          queryFood();
        }
      })
      .catch(error => {
        console.error('Error updating food item:', error);
        Swal.fire({
          text: 'Error updating food item',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false
        });
      });
    }
  });
}

function deleteFood(id) {
  fetch(`/api/deleteFood/${id}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    console.log('Food item deleted:', data);
    if (data.message) {
      Swal.fire({
        text: 'Food item deleted successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      // 重新加载食材数据
      queryFood();
    }
  })
  .catch(error => {
    console.error('Error deleting food item:', error);
    Swal.fire({
      text: 'Error deleting food item',
      icon: 'error',
      timer: 1500,
      showConfirmButton: false
    });
  });
}


// 根据用户id获取订单数据
async function queryOrder() {
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

fetch(`/api/queryOrder`)
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
    <button onclick="orderDetail(${item.id})">详细</button>
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
