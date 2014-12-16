'use strict';

/*
  state 0 === initial state
  state 1 === empty id/password state
  state 2 === invalid id/password state
*/

(function () {
  var state = 0;
  var form = document.forms[0];
  form.onsubmit = submit;
  function submit(){
    var id = form.username.value,
        password = form.password.value;
    if (id === '' || password === '') {
      if (state === 1) return false;
      if (state === 2) {
        $('.login-error[name="invalid"]').toggleClass('show');
      }
      $('.login-error[name="empty"]').addClass('show');
      state = 1;
      return false;
    }
    if (state === 1) {
      $('.login-error[name="empty"]').toggleClass('show');
      state = 0;
    }
    if (state === 2) {
      $('.login-error[name="invalid"]').toggleClass('show');
      state = 0;
    }
    var loginRequest = new XMLHttpRequest();
    loginRequest.onreadystatechange = function() {
      if (this.readyState === 4){
        var res = JSON.parse(this.responseText);
        if (this.status === 200 && res.error) {
          if (state === 2) return false;
          if (state === 1){
            $('.login-error[name="empty"]').toggleClass('show');
          }
          $('.login-error[name="invalid"]').addClass('show');
          state = 2;
        }
        else if (this.status === 200 && !res.error) {
          window.location.href = 'dashboard.html';
        }
      }
    }
    var data= {};
    data.id = id;
    data.password = password;
    loginRequest.open("POST", "/login.html");
    loginRequest.setRequestHeader("Content-Type", "application/json");
    loginRequest.send(JSON.stringify(data));
    return false;
  }
})();