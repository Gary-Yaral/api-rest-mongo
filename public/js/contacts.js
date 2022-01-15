const contact = io();
const _id = '61e09b32bf6bb4bfb62ac750';
const ul = document.querySelector('.contact-container')
contact.emit('get:contacts', { _id })
contact.on('post:contacts', ({results}) => {
  
  if(results.length === 0){
    ul.innerHTML = `You don't have contacts added`;
    return;
  }

  results.forEach(contact => {
    let li = document.createElement('a');
    let contactName = document.createElement('div');
    let contactEmail = document.createElement('div');
    contactName.innerHTML = contact.name;
    contactEmail.innerHTML = contact.email;
    li.classList.add('li-contact');
    contactName.classList.add('contact-name')
    contactEmail.classList.add('contact-email')
    li.setAttribute('keyValue', contact._id)
    li.setAttribute('href', '#')
    li.append(contactName)
    li.append(contactEmail)
    ul.appendChild(li);
  })
  
})