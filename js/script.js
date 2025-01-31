let products = [];
const displayProducts = document.getElementById("display-products");
const modal = document.querySelector("#modal");
const modalDescription = document.querySelector("#modal-description");
const closeModalBtn = document.querySelector("#close-modal-btn");
const searchDiv = document.querySelector("#search-div");
const search = document.querySelector("#search");
const searchBtn = document.querySelector(".search-button");
const cartDiv = document.querySelector("#cart-div");
const modalCart = document.querySelector("#cart-modal");

async function fetchProducts() {
    const loading = document.getElementById("loading");
    const errorMessage = document.getElementById("error-message");

    loading.style.display = "block";
    errorMessage.style.display = "none";

    try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
            throw new Error(`Erro ao carregar os produtos. Status: ${response.status}`);
        }

        products = await response.json();
        renderProduct(products);
    } catch (error) {
        errorMessage.textContent = `Ocorreu um erro ${error.message}`;
        errorMessage.style.display = "block";
    } finally {
        loading.style.display = "none";
    }
}

function renderProduct(products) {
    displayProducts.innerHTML = "";
    products.forEach(product => {
        //Imagem 
        const img = document.createElement("img");
        img.classList.add("product-img");
        img.setAttribute("src", product.image);
        img.setAttribute("alt", product.title);
        const figure = document.createElement("figure");
        figure.appendChild(img);

        //Título
        const h3 = document.createElement("h3");
        h3.setAttribute("title", product.title);
        h3.textContent = product.title;

        //Categoria
        const pCategory = document.createElement("p");
        pCategory.classList.add("category");
        pCategory.textContent = product.category;

        //Preço
        const pPrice = document.createElement("p");
        pPrice.classList.add("price");
        pPrice.textContent = `R$ ${product.price}`;

        // Avaliação
        // for(let i = 1; 1 <= 5; i++) {
        //     const star = document.createElement("span");
        //     if (i <= product.rating.rate) {
        //         star.classList.add("star");
        //         star.textContent = "★";
        //     } else {
        //         star.classList.add("star", "empty");
        //         star.textContent = "☆"
        //     }
        // };

        //Botões detalhe - carrinho
        const openModalBtn = document.createElement("button");
        openModalBtn.classList.add("btn-product");
        openModalBtn.textContent = "Detalhes";

        openModalBtn.addEventListener("click", () => {
            openModal(product.description);
        })

        const divCart = document.createElement("div");
        divCart.classList.add("div-cart");
        const imgCart = document.createElement("img");
        imgCart.classList.add("img-cart");
        imgCart.src = "assets/cart.svg"
        imgCart.alt = "Adicionar ao carrinho"
        divCart.appendChild(imgCart);
        divCart.addEventListener("click", () => {
            const productInfo = {
                title: product.title,
                price: product.price,
            };
            storeInfo(productInfo);
        });

        // Container para os botões 
        const cardBtns = document.createElement("div");
        cardBtns.classList.add("card-btns");
        cardBtns.append(divCart, openModalBtn)

        const card = document.createElement("article");
        card.id = product.id;
        card.classList.add("card");

        //Agrupamento
        card.append(figure, h3, pCategory, pPrice, cardBtns);
        // card.appendChild(pDescription);
        displayProducts.appendChild(card);
    });
}
// Descrição

const searchProduct = () => {
    const searchTerm = search.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    let found = false;

    cards.forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        const category = card.querySelector(".category").textContent.toLowerCase();

        if (title.includes(searchTerm) || category.includes(searchTerm)) {
            card.classList.remove("hidden");
            found = true;
        } else {
            card.classList.add("hidden");
        }
    })

    if (!found) {
        cards.forEach(card => card.classList.remove("hidden"));
        alert(`Produto não encontrado. Tente novamente`)
    }
};

searchBtn.addEventListener("click", searchProduct);
search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchProduct();
    }
});

function storeInfo(product) {
    let savedProduct = JSON.parse(localStorage.getItem('savedProducts')) || [];
    if (savedProduct[product.title]) {
        savedProduct[product.title].quantity += 1;
    }
    savedProduct[product.title] = {
        quantity: 1,
        price: product.price
    }
    localStorage.setItem("savedProducts", JSON.stringify(savedProduct));
    console.log("produto salvo:", product);
    alert(`Você quer comprar o item: ${product.title} - R$ ${product.price}`);
}

function showCart(product) {
    let cart = JSON.parse(localStorage.getItem("savedProducts")) || {};
    let totalItems = 0;
    let totalPrice = 0;

    for (let item in cart) {
        totalItems += cart[item].quantity;
        totalPrice += cart[item].quantity * cart[item].price
    }
}

function openCart() {
    modalCart.style.display = "flex";
}

function openModal(description) {
    modalDescription.textContent = description;
    modal.style.display = "flex";
}

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
})

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
})

fetchProducts();