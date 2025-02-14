// Basics
import {
  products,
  createElement,
  createProductElements,
  applyDiscount,
} from './script.js';
const cartDisplay = document.querySelector('.cart-content');
//function: load cart model
export function loadCart() {
  const cart = JSON.parse(localStorage.getItem('carts')) || {};
  cartDisplay.innerHTML = '';
  Object.keys(cart).forEach((title) => {
    const item = cart[title];
    const product = products.find((p) => p.title === title);
    const elements = createProductElements(product);
    elements.img.classList.add('cart-product-img');
    const unitItem = createElement('div', 'unit-item');
    unitItem.dataset.productTitle = title;
    const price = (item.price * item.quantity).toFixed(2);
    unitItem.append(
      elements.img,
      elements.h3,
      createElement('p', 'price', `Preço: R$ ${price}`),
      createElement('button', 'less-btn', '-'),
      createElement('p', 'quantity', `Qtd: ${item.quantity}`),
      createElement('button', 'more-btn', '+')
    );
    cartDisplay.appendChild(unitItem);
  });
  totalPrice();
}

export function totalPrice() {
  const cart = JSON.parse(localStorage.getItem('carts')) || {};

  const total = Object.values(cart).reduce((acc, value) => {
    const totalValue = value.price * value.quantity;
    return (acc += totalValue);
  }, 0);
  const quantityLet = Object.values(cart).reduce((acc, qtd) => {
    return (acc += qtd.quantity);
  }, 0);

  const resume = createElement('h3', 'resume', 'Resumo');
  const span = createElement(
    'span',
    'total-span',
    `Total: R$ ${total.toFixed(2)}`
  );
  const totalPrice = createElement('p', 'total-value');
  totalPrice.appendChild(span);
  const totalQuantity = createElement(
    'p',
    'total-quantity',
    `${quantityLet} item(s) no carrinho`
  );
  const divTotalPrice = createElement('div', 'div-total-prices');
  divTotalPrice.append(totalPrice, totalQuantity);
  cartDisplay.appendChild(divTotalPrice);
}

//function: add new products to cart
export function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('carts')) || {};
  cart[product.title] = {
    quantity: cart[product.title] ? cart[product.title].quantity + 1 : 1,
    price: product.price,
  };
  localStorage.setItem('carts', JSON.stringify(cart));
  loadCart();
  alert('Produto adicionado ao carrinho!');
}

//function: possible actions in the cart
export function cartAction(event) {
  const cart = JSON.parse(localStorage.getItem('carts')) || {};
  const target = event.target;

  const unitItem = target.closest('.unit-item');
  const productTitle = unitItem.querySelector('h3').textContent;

  if (target.classList.contains('less-btn')) {
    if (cart[productTitle].quantity > 1) {
      cart[productTitle].quantity--;
    } else {
      delete cart[productTitle];
    }
  } else if (target.classList.contains('more-btn')) {
    cart[productTitle].quantity++;
  }

  localStorage.setItem('carts', JSON.stringify(cart));
  loadCart();
}
