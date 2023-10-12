//Footer, header, cards och en cart

// //varje card ska innehålla •	title
// •	description
// •	image
// •	price
// •	rating

//en modal som pop-up for varje produkt

/* Cart 
Köpknapp som lägger till produkt i Cart
Remove item-knapp i Cart
Använd localstorage for att lägga till och ta bort
*/

//filter som filtrerar kategorier

// const productsUrl = "https://fakestoreapi.com/products";
// const productsUrl =
const productsUrl = "https://dummyjson.com/products";
// const productsUrl = "https://api.escuelajs.co/api/v1/products";

let productsArray = [];

const fetchedProducts = async () => {
  try {
    const data = await fetch(productsUrl);
    const fetchedProducts = await data.json();
    // console.log(fetchedProducts);

    productsArrayRender(fetchedProducts.products);
  } catch (error) {
    console.log("Error" + error);
  }
};
fetchedProducts();

function productsArrayRender(items) {
  //
  let articleContainer = document.getElementById("article-container");

  for (let i = 0; i < items.length; i++) {
    //
    let article = document.createElement("article");
    article.innerHTML =
      `<h3>Title: ${items[i].title}</h3>` +
      `<h3>Price: ${items[i].price}$</h3>` +
      `<h3>Rating: ${items[i].rating}</h3>` +
      `<img src="${items[i].thumbnail}" alt="">`;

    articleContainer.appendChild(article);
    //
    article.setAttribute("data-title", items[i].title);
    article.setAttribute("data-description", items[i].description);
    article.setAttribute("data-price", items[i].price);
    article.setAttribute("data-id", items[i].id);
    article.setAttribute("data-rating", items[i].rating);
    article.setAttribute("data-img", items[i].thumbnail);
    article.setAttribute("class", "article");

    //Event listener för modal:
    article.setAttribute("data-toggle", "modal");
    article.setAttribute("data-target", "#productModal");
  }
  articleEventListener();
  console.log(productsArray);
}

//Lägg till article i modal:
function articleEventListener() {
  let articles = document.getElementsByClassName("article");
  const addToCartBtn = document.getElementById("addToCartBtn");

  let currentArticle = {};

  for (let i = 0; i < articles.length; i++) {
    articles[i].addEventListener("click", function () {
      currentArticle.price = this.getAttribute("data-price");
      currentArticle.id = this.getAttribute("data-id");
      currentArticle.description = this.getAttribute("data-description");
      currentArticle.name = this.getAttribute("data-title");
      currentArticle.rating = this.getAttribute("data-rating");
      currentArticle.img = this.getAttribute("data-img");

      document.getElementById("productModalLabel").textContent =
        currentArticle.name;
      document.querySelector("#productModal .modal-body").innerHTML =
        `<h3>Description: ${currentArticle.description}</h3>` +
        `<h3>Price: ${currentArticle.price}$</h3>` +
        `<h3>Rating: ${currentArticle.rating}</h3>` +
        `<img src="${currentArticle.img}" alt="">`;
    });
  }
  addToCartBtn.addEventListener("click", function () {
    myCart.addToCart(
      currentArticle.id,
      currentArticle.name,
      currentArticle.price,
      currentArticle.img
    );
    console.clear();
    console.log(currentArticle);
  });
}

let shoppingCartBtn = document.getElementById("shoppingCartBtn");

shoppingCartBtn.addEventListener("click", function () {
  myCart.showCart();
});

/* ShoppingCart */
class ShoppingCart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
  }

  addToCart(productId, productName, productPrice, productImg) {
    let productInCart = this.cart.find((item) => item.id === productId);

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      this.cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        productImg,
        quantity: 1,
      });
    }
    this.saveCart();
  }

  showCart() {
    let shoppingCartBody = document.getElementById("modal-body-item1");

    shoppingCartBody.innerHTML = "";

    for (let i = 0; i < this.cart.length; i++) {
      let cartProducts = this.cart[i];
      console.log(cartProducts);
      let article = document.createElement("article");
      article.innerHTML =
        `<h3>Title: ${cartProducts.name}</h3>` +
        `<h3>Price: ${cartProducts.price}$</h3>` +
        `<h3>quantity: ${cartProducts.quantity}</h3>` +
        `<img src="${cartProducts.productImg}" alt="">`;

      shoppingCartBody.appendChild(article);
    }
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  removeItem() {
    this.cart;
  }

  clearCart() {
    this.cart = [];
    localStorage.removeItem("cart");
    localStorage.clear();

    //localStorage.removeItem("cart");
  }
}

let myCart = new ShoppingCart();

let clearCart = document.getElementById("clearLocalStorage");

clearCart.addEventListener("click", function () {
  console.log("Clear cart-knappen klickades på.");
  myCart.clearCart();
});

let openShoppingCartBtn = document.getElementById("openShoppingCartBtn");

openShoppingCartBtn.addEventListener("click", function () {
  myCart.showCart();
});

/* ShoppingCart */
