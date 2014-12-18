(function() {
  var data = {};
  getData(function(err) {
    if (err) console.error(err);
  });
  
  function getData(cb) {
    var ajaxReq = new XMLHttpRequest();
    ajaxReq.open('GET', '/loadDashboard', true);
    ajaxReq.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        data = JSON.parse(this.response);
        loadData(function(err) {
          if (err) cb(err);
          else cb(null);
        });
      }
      else {
        cb(this.status);
      }
    }
    ajaxReq.onerror = function() {
      cb('connection error');
    }
    ajaxReq.send();
  }
  
  function loadData(cb) {
    document.getElementById('user').text = data.username;
    cb(null);
  }
})();