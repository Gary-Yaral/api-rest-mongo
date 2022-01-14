const form = document.querySelector('form');
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const usernameError = document.querySelector('#username-error');
const emailError = document.querySelector('#email-error');
const passwordError = document.querySelector('#password-error');

function cleanErrors() {
  usernameError.innerHTML = "";
  emailError.innerHTML = "";
  passwordError.innerHTML = "";
}


form.addEventListener('submit', (evt) => {
  evt.preventDefault()
  cleanErrors();
  fetch('/sign-in',{
    method:'POST',
    headers: {"Content-Type":"application/json"},
    body:JSON.stringify({
      "name": username.value,
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
          case 'name':
            usernameError.innerHTML =`Your ${context.key} must be more than ${context.limit} characters.`;
            break;
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
          case 'name':
            usernameError.innerHTML =`Insert your name`;
            break;
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
      window.location = '/log-in'
    };

  })
  .catch(err => console.log(err))
})
