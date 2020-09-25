export {burgerMenu};

//BURGER-MENU FOR MOBILE DEVICES
const burgerMenu = _ => {
    const burgerMenu = document.querySelector(".burger-menu");
    const burgerEl = document.querySelector(".hamburger");
    const leftSideBarEl = document.querySelector(".left-sidebar");

    const triggerBurger = () => {
        burgerEl.classList.toggle("is-active");
        leftSideBarEl.classList.toggle("display-flex");
    }
    burgerMenu.addEventListener('click', triggerBurger);
};



