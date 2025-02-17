fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(json => console.log(json))
import {
  getProducts,
  fetchProducts,
  applyDiscount,
  setProducts,
} from './api.js';
import { renderProduct, showHundredProducts, showMensProducts, showWomensProducts, showJeweleryProducts, showEletronicsProducts } from './product-service.js';
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
const sidebarCategory = document.querySelector('#sidebar-category-btn');
const inputMensCategory = document.querySelector('#menscategory');
const menscategoryLabel = document.querySelector('#menscategory-label');
const inputWomensCategory = document.querySelector('#womenscategory');
const womenscategoryLabel = document.querySelector('#womenscategory-label');
const inputJeweleryCategory = document.querySelector('#jewelerycategory');
const jewelerycategoryLabel = document.querySelector('#jewelerycategory-label');
const inputEletronicsCategory = document.querySelector('#eletronicscategory');
const eletronicscategoryLabel = document.querySelector('#eletronicscategory-label');

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
//sidebarCategory...
sidebarCategory.addEventListener('click', () => {
  if (inputMensCategory.classList.contains('hidden')) {
    inputMensCategory.classList.remove('hidden');
    menscategoryLabel.classList.remove('hidden');
  } else {
    inputMensCategory.classList.add('hidden');
    menscategoryLabel.classList.add('hidden');
  }
});

inputMensCategory.addEventListener('change', () => {
  if (inputMensCategory.checked) {
    const filtered = showMensProducts(getProducts());
    renderProduct(filtered);
  } else {
    renderProduct(getProducts());
  }
});

sidebarCategory.addEventListener('click', () => {
  if (inputWomensCategory.classList.contains('hidden')) {
    inputWomensCategory.classList.remove('hidden');
    womenscategoryLabel.classList.remove('hidden');
  } else {
    inputWomensCategory.classList.add('hidden');
    womenscategoryLabel.classList.add('hidden');
  }
});

inputWomensCategory.addEventListener('change', () => {
  if (inputWomensCategory.checked) {
    const filtered = showWomensProducts(getProducts());
    renderProduct(filtered);
  } else {
    renderProduct(getProducts());
  }
});

sidebarCategory.addEventListener('click', () => {
  if (inputJeweleryCategory.classList.contains('hidden')) {
    inputJeweleryCategory.classList.remove('hidden');
    jewelerycategoryLabel.classList.remove('hidden');
  } else {
    inputJeweleryCategory.classList.add('hidden');
    jewelerycategoryLabel.classList.add('hidden');
  }
});

inputJeweleryCategory.addEventListener('change', () => {
  if (inputJeweleryCategory.checked) {
    const filtered = showJeweleryProducts(getProducts());
    renderProduct(filtered);
  } else {
    renderProduct(getProducts());
  }
});

sidebarCategory.addEventListener('click', () => {
  if (inputEletronicsCategory.classList.contains('hidden')) {
    inputEletronicsCategory.classList.remove('hidden');
    eletronicscategoryLabel.classList.remove('hidden');
  } else {
    inputEletronicsCategory.classList.add('hidden');
    eletronicscategoryLabel.classList.add('hidden');
  }
});

inputEletronicsCategory.addEventListener('change', () => {
  if (inputEletronicsCategory.checked) {
    const filtered = showEletronicsProducts(getProducts());
    renderProduct(filtered);
  } else {
    renderProduct(getProducts());
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


// format price to BRL

export default function formatCurrency(value) {
  const newValue = value.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  })
  return newValue
}
