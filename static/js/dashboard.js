(function() {
  var data = {};
  
  if (sessionStorage.getItem('userInfo') === null) {
    getData(function(err) {
      if (err) console.error(err);
      data = JSON.parse(sessionStorage.getItem('userInfo'));
      loadData(function(err) {
        if (err) console.error(err);
      });
    });
  }
  else {
    data = JSON.parse(sessionStorage.getItem('userInfo'));
    loadData(function(err) {
      if (err) console.error(err);
    });
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
    };
    ajaxReq.send();
  }
  
  function loadData(cb) {
    var user = document.getElementById('user');
    user.href = "users/" + data.username;
    user.text = data.username;
    if (data.isAdmin) {
      var adminTab = document.createElement('li');
      adminTab.innerHTML = '<a href="/admin">管理中心</a>';
      document.getElementById('navoptions').appendChild(adminTab);
    }
    cb(null);
  }
})();