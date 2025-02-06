export function storeInfo(product) {
  let savedProduct = JSON.parse(localStorage.getItem('savedProducts')) || [];
  if (savedProduct[product.title]) {
    savedProduct[product.title].quantity += 1;
  }
  savedProduct[product.title] = {
    id: product.id,
    quantity: 1,
    price: product.price,
  };
  localStorage.setItem('savedProducts', JSON.stringify(savedProduct));
  console.log('produto salvo:', product);
  alert(`Você quer comprar o item: ${product.title} - R$ ${product.price}`);
}

function addToCart(product) {
  storeInfo(product);
}

function removeFromCart(productId) {
  storeInfo();
  if (removeProduct) {
    savedProduct -= productId;
  }
}
