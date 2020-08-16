// app.js

var app = {
  name: 'Spork',
  key: '',
  initialize: function() {
    if (window.location.search.length > 0) {
      app.key = window.location.search.substr(1);

      data.onLoad = ui.initialize;
      data.onFail = ui.alert;
      data.load(app.key);
    } else {
      ui.alert('No app key specified');
    }
  }
};


