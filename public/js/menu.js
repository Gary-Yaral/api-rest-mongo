const menuButton = document.querySelector('#menu');
const menu = document.querySelector('.modal')
menuButton.addEventListener('click', (e) => {
  e.preventDefault()
  menu.classList.toggle('modal-hidden');
})