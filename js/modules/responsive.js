export const Responsive = (_ => {
    //BURGER-MENU FOR MOBILE DEVICES
    const burgerMenu = _ => {
        const burgerMenu = document.querySelector(".burger-menu");
        const burgerEl = document.querySelector(".hamburger");
        const leftSideBarEl = document.querySelector(".left-sidebar");
        const burgerButton = document.querySelector(".hamburger--slider");


        const triggerBurger = () => {
            burgerEl.classList.toggle("is-active");
            burgerMenu.classList.toggle("dark-background");
            leftSideBarEl.classList.toggle("display-flex");
        }
        burgerMenu.addEventListener('click', triggerBurger);
    };

    //fix the issue with the responsive viewport
    const setWindowHeight = _ => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    const init = _ => {
        burgerMenu();
        setWindowHeight();
    }

    return {
        init
    }
})();
