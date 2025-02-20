import { getProducts } from "./api.js";
import { renderProduct } from "./product-service.js";

//Funtion: Search by product or category
const search = document.querySelector("#search");
export const searchProduct = () => {
  const products = getProducts();
  const searchTerm = search.value.toLowerCase();
  const filtered = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm),
  );
  if (filtered.length > 0) {
    renderProduct(filtered);
  } else {
    alert("Produto não encontrado. Tente novamente");
    renderProduct(products);
  }
};
