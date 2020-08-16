// data.js

var data = {
  tables: {},
  onLoad: function() {
  },
  onFail: function() {
  },
  load: function(appKey) {
    data.read(appKey,
      function(ts) {
        for (var tableName in ts) {
          if (tableName.startsWith('app.')) {
            app[tableName.substring(4)] = ts[tableName];
          } else {
            data.tables[tableName] = data.newTable(ts[tableName]);
          }
        }
        data.onLoad();
      },
      data.onFail
    );
  },
  newTable: function(t) {
    var n = {
      key: t.key,
      records: {},
      onUpdateSucceed: function(record) {
        n.records[record.key] = record;
      },
      onUpdateFail: function () {},
      update: function(record) {
        if ('key' in record) {
          data.update(record, n.onUpdateSucceed, n.onUpdateFail);
        } else {
          data.insert(n.key, record, n.onUpdateSucceed, n.onUpdateFail);
        }
      }
    };

    for (var i = 0; i < t.data.length; ++i) {
      var record = t.data[i];
      n.records[record.key] = record;
    }

    return n;
  },
  read: function(appKey, success, failure) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          try {
            var o = JSON.parse(xhttp.responseText);
            if ('result' in o && o.result != 1000) {
              failure(o.result);
            } else {
              success(o);
            }
          } catch (error) {
            failure(3003);
          }
        } else {
          failure(this.status);
        }
      }
    };
    xhttp.open("GET", "data.php?app=" + appKey, true);
    xhttp.send();
  },
  update: function(record, success, failure) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          try {
            var o = JSON.parse(xhttp.responseText);
            if ('result' in o && o.result != 1000) {
              failure(o.result);
            } else {
              success(record);
            }
          } catch (error) {
            failure(3004);
          }
        } else {
          failure(this.status);
        }
      }
    };
    xhttp.open("POST", "update.php", true);
    xhttp.send(JSON.stringify(record));
  },
  insert: function(tableKey, record, success, failure) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          try {
            var o = JSON.parse(xhttp.responseText);
            if ('result' in o && o.result != 1000) {
              failure(o.result);
            } else {
              record.key = o.key;
              success(record);
            }
          } catch (error) {
            failure(3005);
          }
        } else {
          failure(this.status);
        }
      }
    };
    xhttp.open("POST", "insert.php?coll=" + tableKey, true);
    xhttp.send(JSON.stringify(record));
  }
};

