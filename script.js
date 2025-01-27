const displayProducts = document.getElementById("display-products");

async function searchProduct() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
            throw new Error(`Erro na requisição ${response.status}`);
        }
        const products = await response.json();
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
            h3.textContent = product.title;

            //Descrição
            const pDescription = document.createElement("p");
            pDescription.textContent = product.description;

            //Categoria
            const pCategory = document.createElement("p");
            pCategory.textContent = product.category;

            //Preço
            const pPrice = document.createElement("p");
            pPrice.textContent = product.price;

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
            const btnProduct = document.createElement("button");
            btnProduct.textContent = "Detalhes";

            const btnCart = document.createElement("button");
            const card = document.createElement("article");
            card.classList.add("card");

            //Agrupamento
            card.appendChild(figure);
            card.appendChild(h3);
            card.appendChild(pDescription);
            card.appendChild(pCategory);
            card.appendChild(pPrice);
            card.appendChild(btnProduct);
            card.appendChild(btnCart);
            displayProducts.appendChild(card);
        })
    } catch (error) {
        console.error(`Ocorreu um erro ${error}`);
    }
}

searchProduct();