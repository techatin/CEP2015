(function() {
  var data = {}, state = [0, 0], usersList = [];
  
  if (sessionStorage.getItem('userInfo') === null) {
    getAllData(function(err) {
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
    getUsersList(function(err) {
      if (err) console.error(err);
      loadData(function(err) {
        if (err) console.error(err);
        onDataLoad();
      });
    });
  }
  
  function onDataLoad() {
    
    // state 00 === initial state
    // state 10 === (initial) add user state
       // state 11 === (passwords do not match) add user state
       // state 12 === (username already exists) add user state
       // state 13 === (invalid username) add user state
       // state 14 === (invalid password) add user state
    // state 2 === view user state
    
    var
      // Signup Form Elements/variables
      addUser = document.getElementById('addUser'),
      signUpForm = document.getElementById('signUpForm'),
      unmatchedPassword = document.getElementById('unmatched-passwords'),
      userAlreadyExists = document.getElementById('username-exists'),
      invalidUsername = document.getElementById('invalid-username'),
      invalidPassword = document.getElementById('invalid-password'),
        
      // Edit User Info Form Elements/variables
      editUserForm = document.getElementById('editUserForm'),
      editUserFormUsername = document.getElementById('editUserFormUsername'),
      editUserFormPermission = document.getElementById('editUserFormPermission'),
      updateUserInfoButton = document.getElementById('updateUserInfoButton'),
      removeUserButton = document.getElementById('removeUserButton'),
      userPrivilege,
      
      // User List Elements/variables
      ListOfUsers = document.getElementById('usersList');
    
    addUser.addEventListener('click', function() {
      if (state[0] === 1) {
        clearSignUpForm();
        state[1] = 0;
      }
      else if (state[0] === 2) {
        editUserForm.style.display = 'none';
      }
      signUpForm.style.display = 'block';
      state = [1, 0];
    });
    
    removeUserButton.addEventListener('click', function() {
      var removeUserReq = new XMLHttpRequest();
      removeUserReq.open('POST', '/admin/removeuser', true);
      removeUserReq.setRequestHeader('Content-Type', 'application/json');
      removeUserReq.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          if (JSON.parse(this.response).error) {
            console.error(JSON.parse(this.response).error);
          }
          else {
            editUserForm.style.display = 'none';
            state = [0, 0];
          }
        }
        else {
          console.error(this.status);
        }
      };
      removeUserReq.onerror = function() {
        console.error('connection error');
      }
      removeUserReq.send(JSON.stringify({
        username: usersList[state[1]].value.username
      }));
    });
    
    updateUserInfoButton.addEventListener('click', function() {
      var updateUserInfoReq = new XMLHttpRequest();
      updateUserInfoReq.open('POST', '/admin/edituser', true);
      updateUserInfoReq.setRequestHeader('Content-Type', 'application/json');
      updateUserInfoReq.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          if (JSON.parse(this.response).error) {
            console.error(JSON.parse(this.response).error);
          }
          else {
            editUserForm.style.display = 'none';
            state = [0, 0];
          }
        }
        else {
          console.error(this.status);
        }
      };
      updateUserInfoReq.onerror = function() {
        console.error('connection error');
      }
      updateUserInfoReq.send(JSON.stringify({
        username: usersList[state[1]].value.username,
        fields: [
          {
            updatekey: 'isAdmin',
            updatevalue: editUserFormPermission.value === '管理员'? true : false
          }
        ]
      }));
    });
    
    editUserFormPermission.addEventListener('change', function() {
      if (this.value === userPrivilege) {
        updateUserInfoButton.disabled = 'disabled';
        return;
      }
      updateUserInfoButton.disabled = '';
    });
    
    ListOfUsers.addEventListener('click', function(e) {
      if (e.target.id === 'usersList') return;
      if (state[0] === 1) {
        clearSignUpForm();
        signUpForm.style.display = 'none';
      }
      state = [2, e.target.id];
      editUserFormUsername.value = usersList[state[1]].value.username;
      userPrivilege = usersList[state[1]].value.isAdmin? '管理员' : '普通用户';
      editUserFormPermission.value = userPrivilege;
      editUserForm.style.display = 'block';
    });
    
    signUpForm.onsubmit = function(event) {
      event.preventDefault();
      if (!validateSignUpForm()) return;
      var signUpRequest = new XMLHttpRequest();
      var signUpData = {
        username: signUpForm.children[4].value,
        password: signUpForm.children[5].value,
        isAdmin: signUpForm.children[7].value === '普通用户'? false : true
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
          else if (state[1] === 3) {
            invalidUsername.style.display = 'none';
          }
          else if (state[1] === 4) {
            invalidPassword.style.display = 'none';
          }
          userAlreadyExists.style.display = 'block';
          state[1] = 2;
          return;
        }
        clearSignUpForm();
        signUpForm.style.display = 'none';
        state = [0, 0];
        return;
      };
      signUpRequest.send(JSON.stringify(signUpData));
    }
    
    function clearSignUpForm() {
      signUpForm.children[4].value
      = signUpForm.children[5].value
      = signUpForm.children[6].value
      = '';
      signUpForm.children[7].value = '普通用户';
      unmatchedPassword.style.display = 'none';
      userAlreadyExists.style.display = 'none';
    }
    
    function validateSignUpForm() {
      if (signUpForm.children[5].value !== signUpForm.children[6].value) {
        if (state[1] === 1) {
          switchAni(unmatchedPassword);
          return false;
        }
        else if (state[1] === 2) {
          userAlreadyExists.style.display = 'none';
        }
        else if (state[1] === 3) {
          invalidUsername.style.display = 'none';
        }
        else if (state[1] === 4) {
          invalidPassword.style.display = 'none';
        }
        unmatchedPassword.style.display = 'block';
        state[1] = 1;
        return false;
      }
      if (!/^[a-z0-9]{3,16}$/i.test(signUpForm.children[4].value)) {
        if (state[1] === 3) {
          switchAni(invalidUsername);
          return false;
        }
        else if (state[1] === 1) {
          unmatchedPassword.style.display = 'none';
        }
        else if (state[1] === 2) {
          userAlreadyExists.style.display = 'none';
        }
        else if (state[1] === 4) {
          invalidPassword.style.display = 'none';
        }
        invalidUsername.style.display = 'block';
        state[1] = 3;
        return false;
      }
      if (!/^[\S]{8,24}$/i.test(signUpForm.children[5].value)) {
        if (state[1] === 4) {
          switchAni(invalidPassword);
          return false;
        }
        else if (state[1] === 1) {
          unmatchedPassword.style.display = 'none';
        }
        else if (state[1] === 2) {
          userAlreadyExists.style.display = 'none';
        }
        else if (state[1] === 3) {
          invalidUsername.style.display = 'none';
        }
        invalidPassword.style.display = 'block';
        state[1] = 4;
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
  
  function getAllData(cb) {
    var ajaxReq = new XMLHttpRequest();
    ajaxReq.open('GET', '/loadFullAdminPanel', true);
    ajaxReq.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        sessionStorage.setItem('userInfo', this.response.user);
        usersList = JSON.parse(this.response).usersList;
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
  
  function getUsersList(cb) {
    var ajaxReq = new XMLHttpRequest();
    ajaxReq.open('GET', '/loadUsersList', true);
    ajaxReq.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        usersList = JSON.parse(this.response).usersList;
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
    var ListOfUsers = document.getElementById('usersList');
    user.href = "users/" + data.username;
    user.text = data.username;
    var colors = true, bgcolor = ['#FFE4B2', '#FFF'];
    for (var i=0; i<usersList.length; ++i) {
      var userDiv = document.createElement('div');
      userDiv.classList.add('userDiv');
      userDiv.style.backgroundColor = colors? bgcolor[0] : bgcolor[1];
      userDiv.innerHTML = usersList[i].value.username;
      userDiv.id = i.toString();
      ListOfUsers.appendChild(userDiv);
      colors = !colors;
    }
    cb(null);
  }
})();