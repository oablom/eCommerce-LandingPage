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

//<navbar>
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
//</navbar>

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
      `<h3>${items[i].title}</h3>` +
      `<p>Price: ${items[i].price}$</p>` +
      `<p>Rating: ${items[i].rating}</p>` +
      `<img src="${items[i].thumbnail}" alt="Image of ${items[i].title}">`;

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
    article.setAttribute("data-bs-toggle", "modal");
    article.setAttribute("data-bs-target", "#productModal");
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
        `<p>Description: ${currentArticle.description}</p>` +
        `<p>Price: ${currentArticle.price}$</p>` +
        `<p>Rating: ${currentArticle.rating}</p>` +
        `<img src="${currentArticle.img}" alt="Image of ${currentArticle.name}">`;
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

/* ShoppingCart */
class ShoppingCart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    this.cartQuantity = parseInt(localStorage.getItem("cartQuantity")) || 0;
    // this.cartQuantity= JSON.parse(localStorage.getItem("cartQuantity")) || [];
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
        img: productImg,
        quantity: 1,
      });
    }
    this.saveCart();
    this.cartItemsQuantity();
  }

  removeItemFromCart(productId) {
    let productInCartIndex = this.cart.findIndex(
      (item) => item.id === productId
    );

    if (this.cart[productInCartIndex].quantity > 1) {
      this.cart[productInCartIndex].quantity--;
    } else {
      let updatedCart = this.cart.filter((item) => item.id !== productId);
      this.cart = updatedCart;
    }
  }

  showCart() {
    let shoppingCartBody = document.getElementById("modal-body-item1");

    shoppingCartBody.innerHTML = "";

    for (let i = 0; i < this.cart.length; i++) {
      let cartProducts = this.cart[i];
      console.log(cartProducts);
      let article = document.createElement("article");

      let removeQuantityBtn = `<button id="remove-quantity-btn${i} " class="button1">-</button>`;
      let addQuantityBtn = `<button id="add-quantity-btn${i} " class="button2">+</button>`;

      article.innerHTML =
        `<img src="${cartProducts.img}" alt="Image of ${cartProducts.name}">` +
        `<h3>${cartProducts.name}</h3>` +
        `<p>Price: ${cartProducts.price}$</p>` +
        `<div class="button-div"> ${removeQuantityBtn} 
        <p>  ${cartProducts.quantity}</p> ${addQuantityBtn}</div>`;

      article.setAttribute("class", "cart-article");

      shoppingCartBody.appendChild(article);
      //<Gör om till en funktion>
      const quantityBtncMinus = article.querySelector(".button1");
      const quantityBtncPlus = article.querySelector(".button2");
      //loopa igenom till rätt produkt och lägg till fler av den produkten, det blir att anropa addToCart!

      quantityBtncPlus.addEventListener("click", () => {
        this.addToCart(
          cartProducts.id,
          cartProducts.name,
          cartProducts.price,
          cartProducts.img
        );
        this.saveCart();
        this.showCart();
      });
      quantityBtncMinus.addEventListener("click", () => {
        this.removeItemFromCart(cartProducts.id);
        this.saveCartQuantity();
        this.saveCart();
        this.showCart();
        console.log(cartProducts);
        // let productInCart = this.cart.find(
        //   (item) => item.id === cartProducts.id
        // );
        // if (productInCart) {
        //   removeItem(cartProducts);
        // }
      });
      //</Gör om till en funktion>
    }
    this.cartItemsQuantity();
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  saveCartQuantity() {
    localStorage.setItem("cartQuantity", JSON.stringify(this.cartQuantity));
  }

  // removeItem() {
  //   this.cart;
  //   this.cartItemsQuantity();
  // }
  cartItemsQuantity() {
    let cartItemsQuantityInt = 0;
    for (let i = 0; i < this.cart.length; i++) {
      cartItemsQuantityInt += this.cart[i].quantity;
    }
    console.log(cartItemsQuantityInt);
    this.cartQuantity = cartItemsQuantityInt;
    this.saveCartQuantity();

    let numberOfItems = document.getElementById("number-of-items");
    if (this.cartQuantity > 0) {
      numberOfItems.innerHTML = this.cartQuantity;
    } else {
      numberOfItems.innerHTML = "";
    }
    openShoppingCartBtn.appendChild(numberOfItems);
    console.log(this.cartQuantity);
  }

  clearCart() {
    this.cart = [];
    localStorage.removeItem("cartQuantity");
    localStorage.removeItem("cart");
    localStorage.clear();
    this.showCart();
    this.cartItemsQuantity();

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

// const nav = document.querySelector("nav");
myCart.cartItemsQuantity();
