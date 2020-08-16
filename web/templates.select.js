// templates.select.js

templates.select = function(keyValuePairs) {
  return function() {
    var binding = {
      type: 'select',
      element: document.createElement('SELECT'),
      setValue: function(v) {
        binding.element.value = v;
        binding.onChange();
      },
      getValue: function() {
        return binding.element.value;
      },
      onChange: function(evt) {
      },
      focus: function() {
        binding.element.focus();
      }
    };

    binding.element.addEventListener('change', function(evt) {
      binding.onChange(evt);
    });

    for (var key in keyValuePairs) {
      var opt = document.createElement('OPTION');
      opt.value = key;
      opt.innerText = keyValuePairs[key];
      binding.element.appendChild(opt);
    }

    return binding;
  };
};

templates.selectFromTable = function(table, valueField, labelField) {
  return function() {
    var binding = {
      type: 'selectFromTable',
      element: document.createElement('SELECT'),
      setValue: function(v) {
        binding.element.value = v;
      },
      getValue: function() {
        return binding.element.value;
      },
      focus: function() {
        binding.element.focus();
      }
    };

    for (var i = 0; i < table.length; ++i) {
      var element = array[i];
      var opt = document.createElement('OPTION');
      opt.value = element[valueField];
      opt.innerText = element[labelField];
      binding.element.appendChild(opt);
    }

    return binding;
  };
};

templates.selectFromSettingTable = function(settingName) {
  var settingTable = data.setting.value(settingName, []);

  return templates.selectFromArray(settingTable, 'label', 'value');
};
