const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// const productsUrl = "https://api.escuelajs.co/api/v1/products";
// const productsUrl = "https://fakestoreapi.com/products";
const productsUrl = "https://dummyjson.com/products";
const unsplashAPIKey = "JAYn5vNnZA-k-VFGUb-rVtipEVQQgYXW3dxiM1C-syM";
const unsplashURL = `https://api.unsplash.com/search/photos?query=electronics&client_id=${unsplashAPIKey}`;

let productsArray = [];

const fetchedCarousellImages = async () => {
  try {
    const data = await fetch(unsplashURL);
    const fetchedCImages = await data.json();
    console.log("Unsplash Response:", fetchedCImages);
    carouselImages(fetchedCImages);
  } catch (error) {
    console.log("Error" + error);
  }
};
fetchedCarousellImages();

function carouselImages(images) {
  const carouselImgArray = Array.from(
    document.querySelectorAll(".d-block.w-100")
  );
  const imgLimit = Math.min(images.results.length, carouselImgArray.length);

  for (let i = 0; i < imgLimit; i++) {
    let randomImageInt = Math.floor(Math.random() * images.results.length);
    let currentImage = images.results[randomImageInt].urls.regular;
    let currentImageTitle = images.results[randomImageInt].description;
    let currentCarouselImage = carouselImgArray[i];
    //  console.log(currentImage);

    currentCarouselImage.setAttribute("src", `${currentImage}`);
    currentCarouselImage.setAttribute("alt", `${currentImageTitle}`);
  }
}

const fetchedProducts = async () => {
  try {
    const data = await fetch(productsUrl);
    const fetchedProducts = await data.json();

    productsArray = fetchedProducts.products;
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
      `<img src="${items[i].thumbnail}" alt="Image of ${items[i].title}">` +
      `<h3>${items[i].title}</h3>` +
      `<p> <span>${items[i].price}$</span></p>` +
      `<p>Rating: ${items[i].rating}</p>`;

    articleContainer.appendChild(article);

    article.setAttribute("data-title", items[i].title);
    article.setAttribute("data-description", items[i].description);
    article.setAttribute("data-price", items[i].price);
    article.setAttribute("data-id", items[i].id);
    article.setAttribute("data-rating", items[i].rating);
    article.setAttribute("data-img", items[i].thumbnail);
    article.setAttribute("class", "article");

    article.setAttribute("data-bs-toggle", "modal");
    article.setAttribute("data-bs-target", "#productModal");
  }
  articleEventListener();
  // console.log(productsArray);
}

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
        `<p>${currentArticle.description}</p>` +
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
    // console.log(currentArticle);
  });
}

class ShoppingCart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    this.cartQuantity = parseInt(localStorage.getItem("cartQuantity")) || 0;
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
      // console.log(cartProducts);
      let article = document.createElement("article");
      let sum = cartProducts.price * cartProducts.quantity;
      let removeQuantityBtn = `<button id="remove-quantity-btn${i} " class="button1">-</button>`;
      let addQuantityBtn = `<button id="add-quantity-btn${i} " class="button2">+</button>`;

      article.innerHTML =
        `<img src="${cartProducts.img}" alt="Image of ${cartProducts.name}">` +
        `<h3 class="cart-product-title">${cartProducts.name}</h3>` +
        `<p><span class="cart-product-price">Price:\u00A0</span> ${cartProducts.price}$</p>` +
        `<div class="button-div"> ${removeQuantityBtn} 
        <p class="quantity-button">  ${cartProducts.quantity}</p> ${addQuantityBtn}</div>` +
        `<span class="sum">$${sum}</span>`;

      article.setAttribute("class", "cart-article");

      shoppingCartBody.appendChild(article);

      const quantityBtncMinus = article.querySelector(".button1");
      const quantityBtncPlus = article.querySelector(".button2");

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
        //   console.log(cartProducts);
      });
    }
    this.cartItemsQuantity();
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  saveCartQuantity() {
    localStorage.setItem("cartQuantity", JSON.stringify(this.cartQuantity));
  }

  cartItemsQuantity() {
    let cartItemsQuantityInt = 0;
    for (let i = 0; i < this.cart.length; i++) {
      cartItemsQuantityInt += this.cart[i].quantity;
    }
    // console.log(cartItemsQuantityInt);
    this.cartQuantity = cartItemsQuantityInt;
    this.saveCartQuantity();

    let numberOfItems = document.getElementById("number-of-items");
    if (this.cartQuantity > 0 && this.cartQuantity <= 9) {
      numberOfItems.innerHTML = `\u00A0\u00A0\u00A0${this.cartQuantity}`;
      openShoppingCartBtn.setAttribute("style", "display: block");
    } else if (this.cartQuantity > 9) {
      numberOfItems.innerHTML = `\u00A0\u00A0${this.cartQuantity}`;
      openShoppingCartBtn.setAttribute("style", "display: block");
    } else {
      numberOfItems.innerHTML = "";
      openShoppingCartBtn.setAttribute("style", "display: none");
    }
    openShoppingCartBtn.appendChild(numberOfItems);
    // console.log(this.cartQuantity);
  }

  clearCart() {
    this.cart = [];
    localStorage.removeItem("cartQuantity");
    localStorage.removeItem("cart");
    localStorage.clear();
    this.showCart();
    this.cartItemsQuantity();
  }
}

let myCart = new ShoppingCart();

let clearCart = document.getElementById("clearLocalStorage");

clearCart.addEventListener("click", function () {
  // console.log("Clear cart-knappen klickades på");
  myCart.clearCart();
});

let openShoppingCartBtn = document.getElementById("openShoppingCartBtn");

openShoppingCartBtn.addEventListener("click", function () {
  myCart.showCart();
});

myCart.cartItemsQuantity();

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function () {
  filterProducts(searchInput.value.toLowerCase());
});

function filterProducts(input) {
  const articles = Array.from(document.querySelectorAll(".article"));

  const matchingTitle = articles.filter((article) => {
    const title = article.getAttribute("data-title").toLowerCase();
    return title.includes(input);
  });

  articles.forEach((article) => {
    article.style.display = "none";
  });

  matchingTitle.forEach((matchingArticle) => {
    matchingArticle.style.display = "block";
  });
}

function sortProductsByPrice(order) {
  if (order === "rising") {
    productsArray.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    // console.log("rising", productsArray);
  } else if (order === "falling") {
    productsArray.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    // console.log("falling", productsArray);
  }
  let articleContainer = document.getElementById("article-container");
  articleContainer.innerHTML = "";

  productsArrayRender(productsArray);
}

document.getElementById("sort-options").addEventListener("change", function () {
  const value = this.value;
  if (value === "price-rising") {
    sortProductsByPrice("rising");
  } else {
    sortProductsByPrice("falling");
  }
});
