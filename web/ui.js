// ui.js

ui = {
  routes: {},
  menuItems: [],
  defaultRoute: '',
  registerRoute: function(path, method) {
    var item = {path: path, method: method};
    ui.routes[path] = item;
  },
  registerMenuItem: function(label, path) {
    var item = {label: label, path: path, isActive: false};
    ui.menuItems.push(item);
    if ('menuBar' in ui) {
      ui.createMenuItem(item);
    }
  },
  createMenuItem: function(item) {
    var a = document.createElement('A');
    a.href = '#' + item.path;
    a.innerText = item.label;
    a.style.padding = '10px';
    a.addEventListener('mouseenter', function(evt) {
      a.style.backgroundColor = 'bisque';
    });
    a.addEventListener('mouseleave', function(evt) {
      a.style.backgroundColor = (item.isActive ? 'orange' : 'aquamarine');
    });
    ui.menuBar.appendChild(a);
    item.element = a;
  },
  clear: function() {
    ui.contentArea.innerHTML = '';
  },
  add: function(element) {
    ui.contentArea.appendChild(element);
  },
  initialize: function() {
    ui.menuBar = document.createElement('DIV');
    ui.menuBar.style.padding = '10px';
    ui.menuBar.style.backgroundColor = 'Aquamarine';

    for (var i = 0; i < ui.menuItems.length; ++i) {
      ui.createMenuItem(ui.menuItems[i]);
    }

    ui.statusArea = document.createElement('DIV');

    ui.contentArea = document.createElement('DIV');

    document.body.appendChild(ui.menuBar);
    document.body.appendChild(ui.statusArea);
    document.body.appendChild(ui.contentArea);

    window.onpopstate = function(e) {
      ui.show();
    };
    ui.navigateTo(ui.defaultRoute);
  },
  navigateTo: function(route) {
    document.location.hash = '#' + route;
  },
  decodeHtmlEntity: function(str) {
    return str.replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec);
    });
  },
  show: function() {
    var target = document.location.hash.substr(1);

    var bestLength = 0;
    var bestItem = null;
    for (var i = 0; i < ui.menuItems.length; ++i) {
      var item = ui.menuItems[i];
      if (target.startsWith(item.path) && item.path.length > bestLength) {
        bestItem = item;
        bestLength = item.path.length;
      }
      item.element.style.backgroundColor = 'Aquamarine';
      item.isActive = false;
    }

    if (bestItem != null) {
      bestItem.isActive = true;
      bestItem.element.style.backgroundColor = 'orange';
    }

    bestLength = 0;
    bestRoute = null;
    for (var path in ui.routes) {
      if (target.startsWith(path) && path.length > bestLength) {
        bestRoute = ui.routes[path];
        bestLength = path.length;
      }
    }

    if (bestRoute != null) {
      var args = target.split('/');
      bestRoute.method(args);
    }
  },
  alert: function(message) {
    var mask = document.createElement('DIV');
    mask.style.position = 'fixed';
    mask.style.bottom = '0';
    mask.style.top = '0';
    mask.style.left = '0';
    mask.style.right = '0';
    mask.style.backgroundColor = 'gray';
    mask.style.opacity = '0.5';
    mask.style.zIndex = '999';

    var box = document.createElement('DIV');
    box.style.position = 'absolute';
    box.style.left = '50%';
    box.style.top = '50%';
    box.style.zIndex = '1000';
    box.style.backgroundColor = 'white';
    box.style.padding = '10px 10px 10px 10px';
    box.style.borderRadius = '10px';

    var messageDiv = document.createElement('DIV');
    messageDiv.style.width = '100%';
    messageDiv.style.textAlign = 'center';
    messageDiv.innerText = message;
    box.appendChild(messageDiv);

    var buttonDiv = document.createElement('DIV');
    buttonDiv.style.width = '100%';
    buttonDiv.style.textAlign = 'center';
    var button = document.createElement('BUTTON');
    button.innerText = 'OK';
    buttonDiv.appendChild(button);
    box.appendChild(buttonDiv);

    button.addEventListener('click', function(evt) {
      document.body.removeChild(box);
      document.body.removeChild(mask);
    });

    document.body.appendChild(mask);
    document.body.appendChild(box);
  },
  status: function(m) {
    ui.statusArea.innerText = m;
  }
};
