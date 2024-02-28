const burger = document.querySelector("header a")
const menu = document.querySelector(".menu")

burger.addEventListener("click", function() {
    menu.classList.toggle('show-menu');
});