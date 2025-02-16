import { createElement } from './dom-helpers.js';

// function: basic product information gathered
export function createProductElements(product) {
  if (!product) {
    console.error('Produto é indefined!');
    return null;
  }
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
  const pPrice = createElement(
    'p',
    'price',
    `De: R$ ${product.originalPrice} | Por: R$ ${product.price}`,
    ''
  ); //prices
  return {
    figure,
    h3,
    pCategory,
    pPrice,
    img,
  };
}

// Function: main product arrangement
export function renderProduct(products) {
  const displayProducts = document.getElementById('display-products');
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

//Function: show products above $100
export function showHundredProducts(products) {
  return products.filter((product) => product.price >= 100);
}
