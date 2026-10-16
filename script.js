/* =========================================================
   BLOOM — MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   HERO SLIDER — 10 SLIDES
   ========================================================= */

let currentSlide = 0;

const slides = document.querySelectorAll(".slide");
const heroDots = document.getElementById("heroDots");
let heroTimer;


/* Create Hero Dots */
function buildHeroDots() {
    if (!heroDots || !slides.length) return;

    heroDots.innerHTML = "";

    slides.forEach((slide, index) => {
        const dot = document.createElement("button");

        dot.className = "hero-dot";
        dot.type = "button";

        if (index === 0) {
            dot.classList.add("active");
        }

        dot.setAttribute("aria-label", `Go to slide ${index + 1}`);

        dot.addEventListener("click", () => {
            showSlide(index);
            restartHeroTimer();
        });

        heroDots.appendChild(dot);
    });
}


/* Show Specific Slide */
function showSlide(index) {

    if (!slides.length) return;

    slides[currentSlide].classList.remove("active");

    currentSlide =
        (index + slides.length) % slides.length;

    slides[currentSlide].classList.add("active");


    /* Update dots */
    document
        .querySelectorAll(".hero-dot")
        .forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentSlide
            );

        });


    /* Restart progress bar */
    const progress =
        document.querySelector(".hero-progress span");

    if (progress) {

        progress.style.animation = "none";

        void progress.offsetWidth;

        progress.style.animation =
            "progress 4.5s linear infinite";
    }
}


/* Next Slide */
function nextSlide() {
    showSlide(currentSlide + 1);
}


/* Previous / Next Buttons */
function manualHero(direction) {

    showSlide(currentSlide + direction);

    restartHeroTimer();
}


/* Restart Auto Slider */
function restartHeroTimer() {

    clearInterval(heroTimer);

    heroTimer =
        setInterval(nextSlide, 4500);
}


/* Start Hero */
buildHeroDots();
restartHeroTimer();



/* =========================================================
   FAQ ACCORDION
   ========================================================= */

function toggleFaq(element) {

    /* Close other FAQ items */
    document
        .querySelectorAll(".faq-item.active")
        .forEach(item => {

            if (item !== element) {

                item.classList.remove("active");

                const icon =
                    item.querySelector(".fa-solid");

                if (icon) {

                    icon.classList.remove("fa-minus");
                    icon.classList.add("fa-plus");

                }
            }
        });


    /* Toggle selected item */
    element.classList.toggle("active");


    /* Change icon */
    const icon =
        element.querySelector(".fa-solid");

    if (!icon) return;


    if (element.classList.contains("active")) {

        icon.classList.remove("fa-plus");
        icon.classList.add("fa-minus");

    } else {

        icon.classList.remove("fa-minus");
        icon.classList.add("fa-plus");

    }
}



/* =========================================================
   LANGUAGE SWITCHER — ENGLISH / ARABIC
   ========================================================= */

const htmlRoot =
    document.getElementById("htmlRoot");

const langText =
    document.getElementById("langText");


function applyLanguage(language) {

    if (!htmlRoot) return;


    /* Direction */
    htmlRoot.setAttribute(
        "dir",
        language === "ar" ? "rtl" : "ltr"
    );


    /* HTML language */
    htmlRoot.setAttribute(
        "lang",
        language
    );


    /* Button text */
    if (langText) {

        langText.textContent =
            language === "ar"
                ? "English"
                : "عربي";

    }


    /* Change all bilingual elements */
    document
        .querySelectorAll("[data-en][data-ar]")
        .forEach(element => {

            element.innerHTML =
                language === "ar"
                    ? element.dataset.ar
                    : element.dataset.en;

        });


    /* Save language */
    localStorage.setItem(
        "bloomLanguage",
        language
    );
}


/* Toggle Language */
function toggleLanguage() {

    const isArabic =
        htmlRoot &&
        htmlRoot.getAttribute("dir") === "rtl";

    applyLanguage(
        isArabic ? "en" : "ar"
    );
}


/* Load Saved Language */
const savedLanguage =
    localStorage.getItem("bloomLanguage");

applyLanguage(
    savedLanguage === "ar"
        ? "ar"
        : "en"
);



/* =========================================================
   SHOPPING CART
   ========================================================= */

let cart = [];

const phone = "96170550334";

const deliveryFee = 5;



/* Open / Close Cart */
function toggleCart() {

    const cartDrawer =
        document.getElementById("cartDrawer");

    if (!cartDrawer) return;

    cartDrawer.classList.toggle("open");
}



/* Add Product To Cart */
function addToCart(name, price) {

    const existingProduct =
        cart.find(product =>
            product.name === name
        );


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });

    }


    updateCartUI();


    /* Open cart automatically */
    const cartDrawer =
        document.getElementById("cartDrawer");

    if (cartDrawer) {
        cartDrawer.classList.add("open");
    }
}



/* Remove Product */
function removeFromCart(index) {

    if (
        index < 0 ||
        index >= cart.length
    ) {
        return;
    }


    cart.splice(index, 1);

    updateCartUI();
}



/* Update Cart */
function updateCartUI() {

    const container =
        document.getElementById(
            "cartItemsContainer"
        );

    const count =
        document.getElementById(
            "cartCount"
        );

    const total =
        document.getElementById(
            "cartTotalPrice"
        );


    const isArabic =
        htmlRoot &&
        htmlRoot.getAttribute("dir") === "rtl";


    /* Cart count */
    if (count) {

        count.textContent =
            cart.reduce(
                (sum, item) =>
                    sum + item.quantity,
                0
            );

    }


    if (!container || !total) {
        return;
    }


    /* Empty cart */
    if (!cart.length) {

        container.innerHTML = `
            <p style="
                text-align:center;
                color:#888;
                margin-top:40px;
            ">
                ${
                    isArabic
                        ? "سلة التسوق فارغة"
                        : "Your cart is empty"
                }
            </p>
        `;

        total.textContent = "$5.00";

        return;
    }


    /* Products */
    let subtotal = 0;

    container.innerHTML = "";


    cart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;

        subtotal += itemTotal;


        const row =
            document.createElement("div");

        row.className =
            "cart-item-row";


        row.innerHTML = `

            <div>

                <strong>
                    ${item.name}
                </strong>

                <div style="
                    color:#888;
                    font-size:.85rem;
                    margin-top:4px;
                ">

                    ${item.quantity}
                    ×
                    $${item.price.toFixed(2)}

                </div>

            </div>


            <div style="
                display:flex;
                align-items:center;
                gap:10px;
            ">

                <strong>
                    $${itemTotal.toFixed(2)}
                </strong>


                <button
                    onclick="removeFromCart(${index})"
                    style="
                        border:0;
                        background:none;
                        color:#a56f6d;
                        cursor:pointer;
                        font-size:1.2rem;
                    "
                    aria-label="Remove item"
                >
                    &times;
                </button>

            </div>
        `;


        container.appendChild(row);

    });


    /* Final total */
    const finalTotal =
        subtotal + deliveryFee;

    total.textContent =
        `$${finalTotal.toFixed(2)}`;
}



/* =========================================================
   WHATSAPP CHECKOUT
   ========================================================= */

function checkoutWhatsApp() {

    if (!cart.length) {

        const isArabic =
            htmlRoot &&
            htmlRoot.getAttribute("dir") === "rtl";

        alert(
            isArabic
                ? "السلة فارغة."
                : "Your cart is empty."
        );

        return;
    }


    const isArabic =
        htmlRoot &&
        htmlRoot.getAttribute("dir") === "rtl";


    let message =
        isArabic
            ? "مرحباً BLOOM! أريد إتمام هذا الطلب:\n"
            : "Hello BLOOM! I want to place this order:\n";


    let subtotal = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        subtotal += itemTotal;


        message +=
            `- ${item.name} × ${item.quantity} = $${itemTotal.toFixed(2)}\n`;

    });


    const finalTotal =
        subtotal + deliveryFee;


    if (isArabic) {

        message +=
            `\nالمجموع قبل التوصيل: $${subtotal.toFixed(2)}`;

        message +=
            `\nالتوصيل: $${deliveryFee.toFixed(2)}`;

        message +=
            `\nالمجموع: $${finalTotal.toFixed(2)}`;

    } else {

        message +=
            `\nSubtotal: $${subtotal.toFixed(2)}`;

        message +=
            `\nDelivery: $${deliveryFee.toFixed(2)}`;

        message +=
            `\nTotal: $${finalTotal.toFixed(2)}`;

    }


    const whatsappURL =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;


    window.open(
        whatsappURL,
        "_blank"
    );
}



/* =========================================================
   NEWSLETTER
   ========================================================= */

function subscribeNewsletter() {

    const input =
        document.getElementById("subEmail");


    if (!input) return;


    const email =
        input.value.trim();


    const isArabic =
        htmlRoot &&
        htmlRoot.getAttribute("dir") === "rtl";


    if (
        !email ||
        !email.includes("@")
    ) {

        alert(
            isArabic
                ? "يرجى إدخال بريد إلكتروني صحيح."
                : "Please enter a valid email address."
        );

        return;
    }


    alert(
        isArabic
            ? "تم الاشتراك بنجاح! 🌸"
            : "Subscribed successfully! 🌸"
    );


    input.value = "";
}



/* =========================================================
   GIFTS BACKGROUND SLIDER — 15 IMAGES
   ========================================================= */

let currentGiftBg = 0;

const giftBgSlides =
    document.querySelectorAll(
        ".gift-bg-slide"
    );


function showGiftBg(index) {

    if (!giftBgSlides.length) {
        return;
    }


    giftBgSlides[
        currentGiftBg
    ].classList.remove("active");


    currentGiftBg =
        (index + giftBgSlides.length)
        % giftBgSlides.length;


    giftBgSlides[
        currentGiftBg
    ].classList.add("active");
}


/* Automatic Background Change */
setInterval(() => {

    showGiftBg(
        currentGiftBg + 1
    );

}, 4500);



/* =========================================================
   GIFTS GALLERY — 15 IMAGES
   ========================================================= */

const giftTrack =
    document.getElementById(
        "giftsGalleryTrack"
    );


const giftCards =
    giftTrack
        ? [
            ...giftTrack.querySelectorAll(
                ".gift-gallery-card"
            )
        ]
        : [];


const giftDots =
    document.getElementById(
        "giftDots"
    );


let currentGiftCard = 0;



/* Create Gift Dots */
function buildGiftDots() {

    if (
        !giftDots ||
        !giftCards.length
    ) {
        return;
    }


    giftDots.innerHTML = "";


    const visibleCards = giftsPerView();


    const numberOfGroups =
        Math.ceil(
            giftCards.length /
            visibleCards
        );


    for (
        let i = 0;
        i < numberOfGroups;
        i++
    ) {

        const dot =
            document.createElement("button");


        dot.type = "button";

        dot.className =
            "gift-dot";


        if (i === 0) {
            dot.classList.add("active");
        }


        dot.setAttribute(
            "aria-label",
            `Show gift group ${i + 1}`
        );


        dot.addEventListener(
            "click",
            () => {

                currentGiftCard = i;

                scrollGiftGallery();

            }
        );


        giftDots.appendChild(dot);

    }
}



/* Cards visible at once (measured, so it matches the CSS layout) */
function giftsPerView() {
    if (!giftTrack || !giftCards.length) return 1;
    const step = giftCards[1]
        ? giftCards[1].offsetLeft - giftCards[0].offsetLeft
        : giftCards[0].offsetWidth;
    return Math.max(1, Math.floor((giftTrack.clientWidth + 1) / step));
}


/* Scroll Gift Gallery (track is always LTR, so this works in Arabic too) */
function scrollGiftGallery() {

    if (!giftTrack || !giftCards.length) return;

    const target = giftCards[
        Math.min(currentGiftCard * giftsPerView(), giftCards.length - 1)
    ];

    giftTrack.scrollTo({
        left: target.offsetLeft - giftCards[0].offsetLeft,
        behavior: "smooth"
    });

    document
        .querySelectorAll(".gift-dot")
        .forEach((dot, index) => {
            dot.classList.toggle("active", index === currentGiftCard);
        });
}


/* Previous / Next Gift */
function changeGiftGallery(direction) {

    const maxGroup =
        Math.max(0, Math.ceil(giftCards.length / giftsPerView()) - 1);

    currentGiftCard =
        Math.max(0, Math.min(maxGroup, currentGiftCard + direction));

    scrollGiftGallery();
}



/* Initialize Gift Gallery */
buildGiftDots();



/* Rebuild after screen resize */
window.addEventListener(
    "resize",
    () => {

        currentGiftCard = 0;
        buildGiftDots();
        scrollGiftGallery();

    }
);



/* =========================================================
   SCROLL REVEAL ANIMATION
   ========================================================= */

if (
    "IntersectionObserver"
    in window
) {

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "reveal-visible"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.08
            }

        );


    document
        .querySelectorAll(
            `
            .story-container,
            .feature-box,
            .product-card,
            .faq-item,
            .gifts-banner
            `
        )
        .forEach(element => {

            element.classList.add(
                "reveal"
            );

            observer.observe(
                element
            );

        });

}



/* =========================================================
   PAUSE HERO SLIDER WHEN MOUSE IS OVER IT
   ========================================================= */

const hero =
    document.querySelector(
        ".hero-slider"
    );


if (hero) {

    hero.addEventListener(
        "mouseenter",
        () => {
            clearInterval(heroTimer);
        }
    );


    hero.addEventListener(
        "mouseleave",
        () => {
            restartHeroTimer();
        }
    );

}



/* =========================================================
   INITIAL CART UI
   ========================================================= */

updateCartUI();