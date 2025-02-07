export function storeInfo(product) {
  let savedProduct = JSON.parse(localStorage.getItem('savedProducts')) || {};
  if (savedProduct[product.title]) {
    savedProduct[product.title].quantity += 1;
  } else {
    savedProduct[product.title] = {
      quantity: 1,
      price: product.price,
    };
  }
  localStorage.setItem('savedProducts', JSON.stringify(savedProduct));
  alert(`Você quer comprar o item: ${product.title} - R$ ${product.price}`);
}
