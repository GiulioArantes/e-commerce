let products = [];
const displayProducts = document.getElementById('display-products');
const modal = document.querySelector('#modal');
const modalDescription = document.querySelector('#modal-description');
const closeModalBtn = document.querySelector('#close-modal-btn');
const closeCartBtn = document.querySelector('#close-cart-btn');
const searchDiv = document.querySelector('#search-div');
const search = document.querySelector('#search');
const searchBtn = document.querySelector('.search-button');
const cartDiv = document.querySelector('#cart-div');
const modalCart = document.querySelector('#cart-modal');
const cartDisplay = document.querySelector('.cart-content');

const toggleElement = (element, displayStyle) => {
  element.style.display = displayStyle;
};

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

const createElement = (tag, className, content, attributes = {}) => {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (content) element.textContent = content;
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  return element;
};

function renderProduct(products) {
  displayProducts.innerHTML = '';

  products.forEach((product) => {
    const img = createElement('img', 'product-img', '', {
      src: product.image,
      alt: product.title,
    });
    const figure = document.createElement('figure');
    figure.appendChild(img); // Imagens

    const h3 = createElement('h3', '', product.title, {
      title: product.title,
    }); // Títulos

    const pCategory = createElement('p', 'category', product.category); //Categorias

    const pPrice = createElement('p', 'price', `R$ ${product.price}`, ''); //Preços

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
    card.append(figure, h3, pCategory, pPrice, cardBtns);
    displayProducts.appendChild(card); // Agrupamento de todos os elementos
  });
}

fetchProducts().then(() => {
  renderProduct(products);
});

displayProducts.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (target && target.classList.contains('btn-product')) {
    const productId = target.closest('.card').id;
    const product = products.find((p) => p.id == productId);
    if (product) {
      openModal(product.description);
    }
  }
});

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
searchBtn.addEventListener('click', searchProduct);
search.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchProduct();
  }
});

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('carts')) || {};
  if (cart[product.title]) {
    cart[product.title].quantity += 1;
  } else {
    cart[product.title] = {
      quantity: 1,
      price: product.price,
    };
  }
  localStorage.setItem('carts', JSON.stringify(cart));
  alert(`Você quer comprar o item: ${product.title} - R$ ${product.price}`);
  const h3 = createElement('h3', '', product.title, {
    title: product.title,
  }); // Títulos
  const price = createElement(
    'p',
    'price',
    `R$ ${cart[product.title].quantity * cart[product.title].price}`,
    ''
  ); //Preços
  const quantity = createElement(
    'p',
    'quantity',
    `${cart[product.title].quantity}`,
    ''
  ); //Preços

  cartDisplay.append(h3, price, quantity);
}

function loadCart() {
  const cart = JSON.parse(localStorage.getItem('carts')) || {};
  Object.keys(cart).forEach((title) => {
    const item = cart[title];
    cartDisplay.append(
      createElement('h3', '', title),
      createElement('p', 'price', `Preço: R$ ${item.price}`),
      createElement('p', 'quantity', `Quantidade: ${item.quantity}`)
    );
    cartDisplay.appendChild(div);
  });
}
window.addEventListener('load', loadCart);

displayProducts.addEventListener('click', (event) => {
  const target = event.target.closest('img.img-cart');
  if (target) {
    const productId = target.closest('.card').id;
    const product = products.find((p) => p.id == productId);
    addToCart(product);
  }
});

function removeFromCart(productId) {
  addToCart();
}

let cart = [];
function showCart() {
  localStorage.setItem('cart', JSONN.stringify(cart));

  alert(`${product.title} adicionado ao carrinho!`);
}

function openCart() {
  toggleElement(modalCart, 'flex');
  cartDisplay;
}

cartDiv.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);

function openModal(description) {
  modalDescription.textContent = description;
  toggleElement(modal, 'flex');
}

closeModalBtn.addEventListener('click', () => {
  toggleElement(modal, 'none');
});

function closeCart() {
  toggleElement(modalCart, 'none');
}

window.addEventListener('click', (event) => {
  if (event.target === modal || event.target === modalCart) {
    toggleElement(modal, 'none');
    toggleElement(modalCart, 'none');
  }
});
