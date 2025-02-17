import formatCurrency from '../js/main.js';
import { toggleElement } from './dom-helpers.js';

let products = [];
export const getProducts = () => products;
export const setProducts = (newProducts) => {
  products = newProducts;
};

// Function: API call
export async function fetchProducts() {
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

//Function: apply discount
export function applyDiscount(products) {
  return products.map((product) => {
    const originalPrice = Number(product.price);
    return {
      ...product,
      price: (originalPrice * 0.9).toFixed(2),
      originalPrice,
    };
  });
}
