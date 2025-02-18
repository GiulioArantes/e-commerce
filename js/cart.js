// Basics
import { getProducts } from './api.js';
import { createElement } from './dom-helpers.js';
import { createProductElements } from './product-service.js';
import formatCurrency from './main.js';

const cartDisplay = document.querySelector('.cart-content');
//function: load cart model
export function loadCart() {
  const cart = JSON.parse(localStorage.getItem('carts')) || {};
  cartDisplay.innerHTML = '';
  Object.keys(cart).forEach((key) => {
    const item = cart[key];
    const product = getProducts().find((p) => p.id === Number(key));
    if (!product) {
      console.warn(`Produto "${key}" não encontrado! Removendo do carrinho...`);
      delete cart[key];
      return;
    }
    const elements = createProductElements(product);
    elements.img.classList.add('cart-product-img');
    const unitItem = createElement('div', 'unit-item');
    unitItem.dataset.productTitle = key;
    const price = formatCurrency(item.price * item.quantity);
    unitItem.append(
      elements.img,
      elements.h3,
      createElement('p', 'price', `Preço: ${price}`),
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
    `Total: ${formatCurrency(total)}`
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
  cart[product.id] = {
    quantity: cart[product.id] ? cart[product.id].quantity + 1 : 1,
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
  const productId = unitItem.dataset.productTitle;

  if (target.classList.contains('less-btn')) {
    if (cart[productId].quantity > 1) {
      cart[productId].quantity--;
    } else {
      delete cart[productId];
    }
  } else if (target.classList.contains('more-btn')) {
    cart[productId].quantity++;
  }

  localStorage.setItem('carts', JSON.stringify(cart));
  loadCart();
}
