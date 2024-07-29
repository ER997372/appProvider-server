var txtUsername = document.getElementById("username");
var txtPassword = document.getElementById("password");
var loginBtn = document.getElementById("loginBtn");
var labelError = document.getElementById("errorLabel");

spinner = '<span class="spinner"></span>';


function callLogin() {
    disableElements(true);
    console.log("callLogin")
    var loginRequest = {"username": txtUsername.value, "password": txtPassword.value}
    fetch("/users/login", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      
        //make sure to serialize your JSON body
        body: JSON.stringify(loginRequest)
      })
      .then( async (res) => { 
        var response = await res.json();
        if(response.code === 0) {
            labelError.innerHTML = "";
            var token = response.token;
            localStorage.setItem("token", token);

        } else {
            disableElements(false);
            labelError.innerHTML = response.message;
        }
      }).catch((err) => {
        disableElements(false);
        labelError.innerHTML = err;
        console.log(err);
      });
}

function disableElements(isDisabled) {
    txtUsername.disabled = isDisabled;
    txtPassword.disabled = isDisabled;
    if(isDisabled) {
        loginBtn.classList.toggle('loading');
        loginBtn.innerHTML = spinner;
	} else {
        loginBtn.classList.toggle('loading');
        loginBtn.innerHTML = "Ingresar";
    }
    loginBtn.disabled = isDisabled;
}