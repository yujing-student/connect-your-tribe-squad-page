let button = document.querySelector('.button-show-filters');
let showfirn = document.querySelector('.hide');
button.addEventListener("click", () => {
    showfirn.classList.toggle('hide-open');
    console.log(showfirn+ 'er is geklikt')
});