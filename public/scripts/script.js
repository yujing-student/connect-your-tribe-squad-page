click();

function click() {
    let button = document.querySelector('.button-show-filters');
    let hideElements = document.querySelectorAll('.hide');
    button.addEventListener("click", () => {
        hideElements.forEach(element => {
            element.classList.toggle('hide-open');
        });
        console.log(hideElements + 'er is geklikt')
    });
}
