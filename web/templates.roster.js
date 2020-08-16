// templates.roster.js

templates.roster = function(columns) {
  return function() {
    var binding = {
      type: 'roster',
      element: document.createElement('TABLE'),
      model: {},
      setValue: function(row) {
        for (var c = 0; c < columns.length; ++c) {
          var column = columns[c];
          var itemBinding = binding.model[column.name];
          if (column.name in row) {
            itemBinding.setValue(row[column.name]);
          }
        }
      },
      getValue: function() {
        var r = {};
        for (var p in binding.model) {
          r[p] = binding.model[p].getValue();
        }
        return r;
      }
    };

    binding.model = {};

    for (var c = 0; c < columns.length; ++c) {
      var column = columns[c];
      var itemBinding = templates.rosterRowBinding(binding.element, column);
      binding.model[column.name] = itemBinding;
    }

    return binding;
  };
};

templates.rosterRowBinding = function(table, column) {
  var binding = {
    type: 'rosterRow',
    element: table.insertRow(),
    model: null,
    setValue: function(v) {
      binding.model.setValue(v);
    },
    getValue: function() {
      return binding.model.getValue();
    }
  };

  binding.element.insertCell().innerText = column.label + ': ';

  if ('template' in column && typeof(column.template) == 'function') {
    binding.model = column.template();
  } else {
    binding.model = templates.tableCell();
  }

  binding.element.insertCell().appendChild(binding.model.element);

  return binding;
};

