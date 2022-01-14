const form = document.querySelector('form');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const emailError = document.querySelector('#email-error');
const passwordError = document.querySelector('#password-error');

function cleanErrors() {
  emailError.innerHTML = "";
  passwordError.innerHTML = "";
}

form.addEventListener('submit', (evt) => {
  evt.preventDefault()
  cleanErrors();
  fetch('/log-in',{
    method:'POST',
    headers: {"Content-Type":"application/json"},
    body:JSON.stringify({
      "email": email.value,
      "password": password.value
    })
  })
  .then(res => res.json())
  .then(res => {
 
    console.log(res)
    if(res.error){
      let { context } = res.error.details[0]
      if(context.limit) {
        switch(context.key) {
          case 'email':
            emailError.innerHTML =`Your ${context.key} must be more than ${context.limit} characters.`;
            break;
          case 'password':
            passwordError.innerHTML =`Your ${context.key} must be more than ${context.limit} characters.`;
            break;
        }

        return;
      }

      if(!context.limit) {
        switch(context.key) {
          case 'email':
            emailError.innerHTML =`Insert your email`;
            break;
          case 'password':
            passwordError.innerHTML =`Insert your password`;
            break;
        }

        return;
      }

      return;
    }

    if(res.result){
      window.location = '/0/chat'
    };

  })
  .catch(err => console.log(err))
})