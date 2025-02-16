import {
  getProducts,
  fetchProducts,
  applyDiscount,
  setProducts,
} from './api.js';
import { renderProduct, showHundredProducts } from './product-service.js';
import { searchProduct } from './search-service.js';
import { addToCart, loadCart, cartAction } from './cart.js';
import { modalActions, openProductModal } from './modal-service.js';

const displayProducts = document.getElementById('display-products');
const body = document.querySelector('#body');

fetchProducts().then(async () => {
  const rawProducts = getProducts();
  const discountedProducts = await applyDiscount(rawProducts);
  setProducts(discountedProducts);

  renderProduct(discountedProducts);
  loadCart();
});

//Event: Add to Cart
displayProducts.addEventListener('click', (event) => {
  const target = event.target.closest('img.img-cart');
  if (target) {
    const productId = parseInt(target.closest('.card').id, 10);
    const product = getProducts().find((p) => p.id === Number(productId));
    if (product) {
      addToCart(product);
    } else {
      console.error('Produto não encontrado!');
      return;
    }
  }
});

//Event: Increase or decrease the volume of products
const cartDisplay = document.querySelector('.cart-content');
cartDisplay.addEventListener('click', (event) => {
  if (
    event.target.classList.contains('less-btn') ||
    event.target.classList.contains('more-btn')
  )
    cartAction(event);
});

//Function: show sidebar options
const sidebarPrice = document.querySelector('#sidebar-price-btn');
const inputHundred = document.querySelector('#hundred');
const hundredLabel = document.querySelector('#hundred-label');

inputHundred.addEventListener('change', () => {
  if (inputHundred.checked) {
    const filtered = showHundredProducts(getProducts());
    renderProduct(filtered);
  } else {
    renderProduct(getProducts());
  }
});

sidebarPrice.addEventListener('click', () => {
  if (inputHundred.classList.contains('hidden')) {
    inputHundred.classList.remove('hidden');
    hundredLabel.classList.remove('hidden');
  } else {
    inputHundred.classList.add('hidden');
    hundredLabel.classList.add('hidden');
  }
});

const search = document.querySelector('#search');

// Event: Search by product or category
const searchBtn = document.querySelector('.search-button');
searchBtn.addEventListener('click', searchProduct);
search.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchProduct();
  }
});

// Event: close modal
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('close-btn')) {
    modalActions.close();
  }

  if (e.target.classList.contains('modal')) {
    modalActions.close();
  }
});

// Event: Open modal
body.addEventListener('click', (event) => {
  const target = event.target;

  if (target.closest('.btn-product')) {
    const productId = parseInt(target.closest('.card').id, 10);
    const product = getProducts().find((p) => p.id === productId);
    openProductModal(product);
  }

  if (target.closest('#header-cart')) {
    modalActions.open('cart');
  }
});
