let products = [];
const displayProducts = document.getElementById("display-products");
const modal = document.querySelector("#modal");
const modalDescription = document.querySelector("#modal-description");
const closeModalBtn = document.querySelector("#close-modal-btn");
const searchDiv = document.querySelector("#search-div");
const search = document.querySelector("#search");

async function fetchProducts() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        products = await response.json();
        renderProduct(products);
    } catch (error) {
        console.error(`Ocorreu um erro ${error}`);
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
                price: product.price
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
        search.addEventListener("keydown", searchProduct);
    });
}
// Descrição

const searchProduct = (event) => {
    if (event.key === "Enter") {
        const filterCard = document.querySelectorAll("article");
        let found = false;
        filterCard.forEach(card => {
            const title = card.querySelector("h3").textContent;
            const category = card.querySelector(".category").textContent;
            if (search.value === title) {
                card.classList.remove("hidden");
                found = true;

            } else if (search.value === category) {
                card.classList.remove("hidden");
                found = true;
            }
            else {
                card.classList.add("hidden")
            }
        });
        if (!found) {
            filterCard.forEach(card => card.classList.remove("hidden"));
        }
    }
}

function storeInfo(product) {
    let savedProduct = JSON.parse(localStorage.getItem('savedProducts')) || [];
    savedProduct.push(product);
    localStorage.setItem("savedProducts", JSON.stringify(savedProduct));
    console.log("produto salvo:", product);
    alert(`Você quer comprar s item: ${product.title} - R$ ${product.price}`);
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