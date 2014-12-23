(function() {
  var data = {}, state = [0, 0];
  
  if (sessionStorage.getItem('userInfo') === null) {
    getData(function(err) {
      if (err) console.error(err);
      data = JSON.parse(sessionStorage.getItem('userInfo'));
      loadData(function(err) {
        if (err) console.error(err);
        onDataLoad();
      });
    });
  }
  else {
    data = JSON.parse(sessionStorage.getItem('userInfo'));
    loadData(function(err) {
      if (err) console.error(err);
      onDataLoad();
    });
  }
  
  function onDataLoad() {
    
    // state 00 === initial state
    // state 10 === (initial) add user state
       // state 11 === (passwords do not match) add user state
       // state 12 === (username already exists) add user state
    // state 2 === view user state
    
    var
      addUser = document.getElementById('addUser'),
      signUpForm = document.getElementById('signUpForm'),
      unmatchedPassword = document.getElementById('unmatched-passwords'),
      userAlreadyExists = document.getElementById('username-exists');
    addUser.addEventListener('click', function() {
      if (state[0] === 0) {
        signUpForm.style.display = 'block';
        state = [1, 0];
      }
      else if (state[0] === 1) {
        clearSignUpForm();
        state[1] = 0;
      }
    });
    
    signUpForm.onsubmit = function(event) {
      event.preventDefault();
      if (!validateSignUpForm()) return;
      var signUpRequest = new XMLHttpRequest();
      var signUpData = {
        username: signUpForm.children[2].value,
        password: signUpForm.children[3].value,
        isAdmin: signUpForm.children[5].value === '普通用户'? false : true
      };
      signUpRequest.open('POST', '/admin/adduser', true);
      signUpRequest.setRequestHeader('Content-Type', 'application/json');
      signUpRequest.onload = function() {
        var res = JSON.parse(this.response);
        if (res.error) {
          if (state[1] === 2) {
            switchAni(userAlreadyExists);
            return;
          }
          else if (state[1] === 1) {
            unmatchedPassword.style.display = 'none';
          }
          userAlreadyExists.style.display = 'block';
          state[1] = 2;
          return;
        }
        clearSignUpForm();
        signUpForm.style.display = 'none';
        state[0] = 0, state[1] = 0;
        return;
      };
      signUpRequest.send(JSON.stringify(signUpData));
    }
    
    function clearSignUpForm() {
      signUpForm.children[2].value
      = signUpForm.children[3].value
      = signUpForm.children[4].value
      = '';
      signUpForm.children[5].value = '普通用户';
      unmatchedPassword.style.display = 'none';
      userAlreadyExists.style.display = 'none';
    }
    
    function validateSignUpForm() {
      if (signUpForm.children[3].value !== signUpForm.children[4].value) {
        if (state[1] === 1) {
          switchAni(unmatchedPassword);
          return false;
        }
        else if (state[1] === 2) {
          userAlreadyExists.style.display = 'none';
        }
        unmatchedPassword.style.display = 'block';
        state[1] = 1;
        return false;
      }
      return true;
    }
    
    function switchAni(el) {
      el.style.display = 'none';
      setTimeout(function() {
        el.style.display = 'block';
      }, 50);
    }
  }
  
  function getData(cb) {
    var ajaxReq = new XMLHttpRequest();
    ajaxReq.open('GET', '/loadDashboard', true);
    ajaxReq.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        sessionStorage.setItem('userInfo', this.response);
        cb(null);
      }
      else {
        cb(this.status);
      }
    };
    ajaxReq.onerror = function() {
      cb('connection error');
    }
    ajaxReq.send();
  }
  
  function loadData(cb) {
    var user = document.getElementById('user');
    user.href = "users/" + data.username;
    user.text = data.username;
    cb(null);
  }
})();