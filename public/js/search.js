const search = document.querySelector('#search');
const contactSection = document.querySelector('.ul-container');
const username = document.querySelector('.username');
let userId = '61e09b32bf6bb4bfb62ac750';
let userData = null;
const body = document.querySelector('body');
const chat = io();

function searchContact(_id) {
  chat.emit('contact:get',{_id})
}

chat.on('contact:post', (data) => {
  userData = data;
  username.innerHTML = userData.results.name;
})

searchContact(userId);



function searchUser() {
  contactSection.innerHTML=""; 
  let searched = search.value;
  chat.emit('search:value',{value:searched})
}

chat.on('search:result',async (data)=>{
  searchContact(userId);
  if(search.value === "") return; 
  renderContacts(data);
})

function renderContacts(data) {
  
  while(contactSection.firstChild) {
    contactSection.removeChild(contactSection.firstChild)
  }

  let { contacts } = userData.results;

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

      if(user.name.length > 15) {
        user.name = user.name.substring(0, 15) + '...';
      }

      let li = document.createElement('div');
      let liName = document.createElement('div');
      let liButton = document.createElement('button');
      li.classList.add('contacts-li');
      liName.classList.add('li-name');
      liButton.classList.add(buttonClass);
      liName.innerHTML = user.name;
      liButton.innerHTML = buttonValue;
      liButton.setAttribute('keyValue', user._id);

      li.appendChild(liName);
      li.appendChild(liButton);

      contactSection.appendChild(li);
    })
  }
}

function addContact(_id, contactID) {
  chat.emit('contact:add',{_id, contactID})
}

chat.on('contact:added',(data)=>{
  if(data.results.acknowledged) {
    let removeButtons = contactSection.querySelectorAll('.button-add')
    removeButtons.forEach(element => {
      let id = element.getAttribute('keyValue');
      if(id === data.addedID) {
        element.innerHTML = "Remove";
        element.classList.remove('button-add');
        element.classList.add('button-remove');
      }
    })
  }
})

function removeContact(_id, contactID) {
  chat.emit('contact:remove',{_id,contactID})
}

chat.on('contact:removed',(data)=>{
  if(data.results.acknowledged) {
    let removeButtons = contactSection.querySelectorAll('.button-remove')
    removeButtons.forEach(element => {
      let id = element.getAttribute('keyValue');
      if(id === data.removedID) {
        element.innerHTML = "Add";
        element.classList.remove('button-remove');
        element.classList.add('button-add');
      }
    })
  }

  searchContact(userId);
})

search.addEventListener('input', (e)=>{
  contactSection.innerHTML = "";
  if(e.target.value === "") return;
  searchUser();
})

contactSection.addEventListener('click', (e) => {
  const isContact = e.target.classList.contains('button-remove');
  let contactID = e.target.getAttribute('keyValue');
  if(!isContact) {
    addContact(userId, contactID)
    return;
  }

  removeContact(userId, contactID)
})

