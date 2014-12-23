'use strict';

/*
  state 0 === initial state
  state 1 === invalid id/password state
*/

(function () {
  sessionStorage.clear();
  
  var
    state = 0,
    form = document.getElementById('login-form');
  form.onsubmit = submit;
  var
    invalidLogin = document.getElementById('invalid-login'),
    emptyLogin = document.getElementById('empty-login');
  
  function submit(event) {
    event.preventDefault();
    var
      username = document.getElementById('first-ele').value,
      password = document.getElementById('second-ele').value;
    
    var loginRequest = new XMLHttpRequest();
    var data= {};
    data.username = username;
    data.password = password;
    loginRequest.open("POST", "/login", true);
    loginRequest.setRequestHeader("Content-Type", "application/json");
    loginRequest.onload = function() {
      var res = JSON.parse(this.response);
      if (res.error) {
        if (state === 1) {
          switchAni(invalidLogin);
          return;
        }
        invalidLogin.style.display = 'block';
        state = 1;
      }
      else if (!res.error) {
        window.location.href = 'dashboard';
      }
    };
    loginRequest.send(JSON.stringify(data));
    return;
  }
  
  function switchAni(el) {
    el.style.display = 'none';
    setTimeout(function() {
      el.style.display = 'block';
    }, 50);
  }
})();