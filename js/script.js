// Basic variables/ constants
export let products = [];
const displayProducts = document.getElementById('display-products');
const body = document.querySelector('#body');

const toggleElement = (element, displayStyle) => {
  element.style.display = displayStyle;
};

// Function: API call
async function fetchProducts() {
  const loading = document.getElementById('loading');
  const errorMessage = document.getElementById('error-message');

  toggleElement(loading, 'block');
  toggleElement(errorMessage, 'none');

  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error(
        `Erro ao carregar os produtos. Status: ${response.status}`
      );
    }

    products = await response.json();
  } catch (error) {
    errorMessage.textContent = `Ocorreu um erro ${error.message}`;
    toggleElement(errorMessage, 'block');
  } finally {
    toggleElement(loading, 'none');
  }
}

// Function: Simplified element creation
export const createElement = (tag, className, content, attributes = {}) => {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (content) element.textContent = content;
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  return element;
};

// function: basic product information gathered
export function createProductElements(product) {
  const img = createElement('img', 'product-img', '', {
    src: product.image,
    alt: product.title,
  });
  const figure = document.createElement('figure');
  figure.appendChild(img); // images
  const h3 = createElement('h3', '', product.title, {
    title: product.title,
  }); // titles
  const pCategory = createElement('p', 'category', product.category); //categories
  const pPrice = createElement('p', 'price', `R$ ${product.price}`, ''); //prices
  return {
    figure,
    h3,
    pCategory,
    pPrice,
    img,
  };
}

// Function: main product arrangement
function renderProduct(products) {
  displayProducts.innerHTML = '';

  products.forEach((product) => {
    const elements = createProductElements(product);

    const openModalBtn = createElement('button', 'btn-product', 'Detalhes', ''); //Detalhes

    const divCart = createElement('div', 'div-cart', '', { id: product.id });
    const imgCart = createElement('img', 'img-cart', '', {
      src: 'assets/cart.svg',
      alt: 'Adicionar ao carrinho',
    }); //Carrinho
    divCart.appendChild(imgCart);

    const cardBtns = createElement('div', 'card-btns', '', '');
    cardBtns.append(divCart, openModalBtn); // Agrupamento de elementos para estilização

    const card = createElement('article', 'card', '', { id: product.id });
    card.append(
      elements.figure,
      elements.h3,
      elements.pCategory,
      elements.pPrice,
      cardBtns
    );
    displayProducts.appendChild(card); // Agrupamento de todos os elementos
  });
}
//Functions: cart related
import { addToCart, loadCart, cartAction, totalPrice } from './cart.js';

fetchProducts().then(() => {
  renderProduct(products);
  loadCart();
});

//Event: Add to Cart
displayProducts.addEventListener('click', (event) => {
  const target = event.target.closest('img.img-cart');
  if (target) {
    const productId = target.closest('.card').id;
    const product = products.find((p) => p.id == productId);
    addToCart(product);
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

//Funtion: Search by product or category
const search = document.querySelector('#search');
const searchProduct = () => {
  const searchTerm = search.value.toLowerCase();
  const filtered = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
  );
  if (filtered.length > 0) {
    renderProduct(filtered);
  } else {
    alert(`Produto não encontrado. Tente novamente`);
    renderProduct(products);
  }
};

// Event: Search by product or category
const searchBtn = document.querySelector('.search-button');
searchBtn.addEventListener('click', searchProduct);
search.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchProduct();
  }
});

// close or open models
const modals = document.querySelectorAll('.modal');
let activeModal = null;
const modalActions = {
  open: (modalType) => {
    const modal = [...modals].find((m) => m.dataset.modalType === modalType);
    if (modal) {
      activeModal = modal;
      modal.style.display = 'flex';
    }
  },

  close: () => {
    if (activeModal) {
      activeModal.style.display = 'none';
      activeModal = null;
    }
  },
};

// Event: close modal
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('close-modal-btn')) {
    modalActions.close();
  }

  if (e.target.classList.contains('modal')) {
    modalActions.close();
  }
});

// Funtion: Open description
const modalDescription = document.querySelector('#modal-description');
function openProductModal(product) {
  modalDescription.textContent = product.description;
  modalActions.open('product');
}

// Event: Open modal
body.addEventListener('click', (event) => {
  const target = event.target;

  if (target.closest('.btn-product')) {
    const productId = target.closest('.card').id;
    const product = products.find((p) => p.id == productId);
    openProductModal(product);
  }

  if (target.closest('#header-cart')) {
    modalActions.open('cart');
  }
});
