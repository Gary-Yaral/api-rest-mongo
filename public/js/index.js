const btn = document.querySelector('.btn');
btn.addEventListener('click',() => {
  fetch('../0/chat',{
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({view: 'contacts'})
  })
  .then(res => res.json())
  .then(res => console.log(res))
})