const menuCards = document.querySelector('.menu-cards'); // контейнер меню
const cart = [];
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// ===================== CART =====================
function addCartButtons() {
  document.querySelectorAll('.card button').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.dataset.item;
      const price = Number(btn.dataset.price);
      const existing = cart.find(i => i.item === item);
      if (existing) existing.quantity++;
      else cart.push({ item, price, quantity: 1 });
      renderCart();
    });
  });
}

function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(i => {
    const li = document.createElement('li');
    li.textContent = `${i.item} — ${i.price} ₽ x${i.quantity}`;
    cartItems.appendChild(li);
    total += i.price * i.quantity;
  });
  cartTotal.textContent = total;
}

// ===================== MENU =====================
async function fetchMenuFromAPI() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    const meals = data.meals || [];
    menuCards.innerHTML = '';

    meals.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${item.strMealThumb}" alt="${item.strMeal}" class="menu-img">
        <h3>${item.strMeal}</h3>
        <p>${item.strCategory || ''}</p>
        <button data-item="${item.strMeal}" data-price="250">В корзину</button>
      `;
      menuCards.appendChild(card);
    });

    addCartButtons(); // подключаем кнопки корзины к новым карточкам
  } catch (err) {
    console.error('Ошибка загрузки меню:', err);
  }
}

fetchMenuFromAPI(); // вызываем сразу при загрузкеeset();

