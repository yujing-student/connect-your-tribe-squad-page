const click = () => {
    const burger = document.querySelector(".hamburger");
    const menu = document.querySelector(".menu");

    burger.addEventListener("click", () => {
        menu.classList.toggle('show-menu');
    });
}
click();