'use strict';

/*
  state 0 === initial state
  state 1 === empty id/password state
  state 2 === invalid id/password state
*/

(function () {
  var
    state = 0,
    form = document.getElementById('login-form');
  form.onsubmit = submit;
  var
    invalidLogin = document.getElementById('invalid-login'),
    emptyLogin = document.getElementById('empty-login');
  
  function submit() {
    var
      username = document.getElementById('first-ele').value,
      password = document.getElementById('second-ele').value;
    
    if (username === '' || password === '') {
      if (state === 1) {
        switchAni(emptyLogin);
        return false;
      }
      if (state === 2) {
        invalidLogin.style.display = 'none';
      }
      emptyLogin.style.display = 'block';
      state = 1;
      return false;
    }
    var loginRequest = new XMLHttpRequest();
    loginRequest.onload = function() {
      var res = JSON.parse(this.response);
      if (res.error) {
        if (state === 2) {
          switchAni(invalidLogin);
          return false;
        }
        if (state === 1) {
          emptyLogin.style.display = 'none';
        }
        invalidLogin.style.display = 'block';
        state = 2;
      }
      else if (!res.error) {
        window.location.href = 'dashboard';
      }
    };
    var data= {};
    data.username = username;
    data.password = password;
    loginRequest.open("POST", "/login");
    loginRequest.setRequestHeader("Content-Type", "application/json");
    loginRequest.send(JSON.stringify(data));
    return false;
  }
  
  function switchAni(el) {
    el.style.display = 'none';
    setTimeout(function() {
      el.style.display = 'block';
    }, 50);
  }
})();