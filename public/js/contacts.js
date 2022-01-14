const search = document.querySelector('#search');
const contactSection = document.querySelector('.ul-container');
const username = document.querySelector('.username');
let userId = '61e09b32bf6bb4bfb62ac750';
const chat = io();

/* function getData(){
  fetch(`../admin/users/${userId}`,{
    method: 'POST',
    headers: {"Content-Type":"application/json"},
  })
  .then(res => res.json())
  .then(res => {
    let {result} = res;
    localStorage.setItem('data',JSON.stringify(result));
    username.innerHTML = result.name;
  })
} */

//getData();


const body = document.querySelector('body');
const contacts = JSON.parse(localStorage.getItem('data')).contacts
search.addEventListener('input', (e)=>{
  contactSection.innerHTML= "";
  let searched = e.target.value;
  chat.emit('search:value',{value:searched})
})

chat.on('search:result',(data)=>{
  if(data.results.length === 0) {
    contactSection.innerHTML= "Not matches";
  }

  if(data.results.length > 0) {
    data.results.forEach(user => {
      let buttonClass = "button-add";
      let buttonValue = "Add"
      if(contacts.includes(user._id)) {
        buttonClass = "button-remove";
        buttonValue = "Remove"
      }

      contactSection.innerHTML+= `
        <section class="contacts-ul">
          <div class="contacts-li">
            <div class="li-name">${user.name}</div>
            <button class=${buttonClass} keyValue=${user._id}>${buttonValue}</button>
          </div>
        </section>`
    })
  }
})