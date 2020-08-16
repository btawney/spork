// data.settings.js

data.setting = {
  record: function(settingName) {
    if ('settings' in data.tables) {
      for (var key in data.tables.settings.records) {
        var setting = data.tables.settings.records[key];
        if (setting.name == settingName) {
          return setting;
        }
      }
    }
    return null;
  },
  value: function(settingName, defaultValue) {
    var record = data.setting.record(settingName);

    if (record != null) {
      return record.value;
    }

    return defaultValue;
  },
  update: function(settingName, settingValue) {
    var record = data.setting.record(settingName);

    if (record == null) {
      record = {name: settingName, value: settingValue};
    } else {
      record.value = settingValue;
    }

    data.tables.settings.update(record);
  },
};
