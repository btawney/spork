// templates.table.js

templates.table = function(columns) {
  return function() {
    var binding = {
      type: 'table',
      element: document.createElement('SPAN'),
      addButton: document.createElement('BUTTON'),
      model: [],
      setValue: function(array) {
        binding.model = [];
        binding.element.innerHTML = '';

        binding.table = document.createElement('TABLE');

        var row = binding.table.insertRow();
        for (var c = 0; c < columns.length; ++c) {
          var column = columns[c];
          row.insertCell().innerHTML = '<b><i>' + column.label + '</i></b>';
        }

        for (var i = 0; i < array.length; ++i) {
          var itemBinding = templates.tableRowBinding(binding.table, columns, 0);
          itemBinding.setValue(array[i]);
          itemBinding.onDelete = binding.onItemDelete;
          binding.model.push(itemBinding);
        }

        row = binding.table.insertRow();
        var cell = row.insertCell();
        cell.colSpan = 100;
        cell.style.textAlign = 'center';
        cell.appendChild(binding.addButton);

        binding.element.appendChild(binding.table);
      },
      onItemDelete: function(itemBinding) {
        var idx = binding.model.indexOf(itemBinding);
        if (idx >= 0) {
          binding.model.splice(idx, 1);
        }
        itemBinding.element.parentElement.removeChild(itemBinding.element);
      },
      getValue: function() {
        var r = [];
        for (var i = 0; i < binding.model.length; ++i) {
          r.push(binding.model[i].getValue());
        }
        return r;
      }
    };

    binding.addButton.innerText = 'Add';
    binding.addButton.addEventListener('click', function() {
      var itemBinding = templates.tableRowBinding(binding.table, columns, -1);
      itemBinding.setValue({});
      itemBinding.onDelete = binding.onItemDelete;
      binding.model.push(itemBinding);

      // Focus in the first cell of the new row
      if (columns[0].name in itemBinding.model) {
        itemBinding.model[columns[0].name].element.focus();
      }
    });

    binding.setValue([]);

    return binding;
  };
};

templates.tableRowBinding = function(table, columns, offset) {
  var binding = {
    type: 'tableRow',
    element: table.insertRow(table.rows.length + offset),
    deleteButton: document.createElement('BUTTON'),
    model: {},
    setValue: function(row) {
      binding.model = {};
      for (var i = 0; i < columns.length; ++i) {
        var column = columns[i];
        var cell = binding.element.insertCell();
        if ('template' in column && typeof(column.template) == 'function') {
          var itemBinding = column.template();
        } else {
          var itemBinding = templates.tableCellBinding();
        }

        binding.model[column.name] = itemBinding;

        if (column.name in row) {
          itemBinding.setValue(row[column.name]);
        }

        cell.appendChild(itemBinding.element);
      }

      var deleteCell = binding.element.insertCell();
      deleteCell.appendChild(binding.deleteButton);
    },
    getValue: function() {
      var r = {};
      for (var c = 0; c < columns.length; ++c) {
        var column = columns[c];
        r[column.name] = binding.model[column.name].getValue();
      }
      return r;
    },
    onDelete: function(b) {
    }
  };

  binding.deleteButton.innerText = 'X';
  binding.deleteButton.addEventListener('click', function(evt) {
    binding.onDelete(binding);
  });

  return binding;
};

templates.tableCellBinding = function() {
  var binding = {
    type: 'tableCell',
    element: document.createElement('INPUT'),
    setValue: function(v) {
      binding.element.value = v;
    },
    getValue: function() {
      return binding.element.value;
    }
  };

  return binding;
};
