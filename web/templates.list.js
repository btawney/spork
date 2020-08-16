// templates.list.js

templates.list = function(itemTemplate) {
  return function() {
    var binding = {
      type: 'list',
      element: document.createElement('SPAN'),
      listContainer: document.createElement('SPAN'),
      addButton: document.createElement('BUTTON'),
      model: [],
      setValue: function(array) {
        binding.model = [];
        binding.listContainer.innerHTML = '';
        for (var i = 0; i < array.length; ++i) {
          var itemBinding = templates.listItemBinding(itemTemplate);
          itemBinding.setValue(array[i]);
          itemBinding.onDelete = binding.onItemDelete;
          binding.listContainer.appendChild(itemBinding.element);
          binding.model.push(itemBinding);
        }
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
      },
      focus: function() {
        if (binding.model.length > 0 && ('focus' in binding.model[0])) {
          binding.model[0].focus();
        }
      }
    };

    binding.addButton.innerText = '+';
    binding.addButton.addEventListener('click', function() {
      var itemBinding = templates.listItemBinding(itemTemplate);
      itemBinding.onDelete = binding.onItemDelete;
      binding.listContainer.appendChild(itemBinding.element);
      binding.model.push(itemBinding);

      itemBinding.focus();
    });

    binding.element.appendChild(binding.listContainer);
    binding.element.appendChild(binding.addButton);

    return binding;
  };
};

templates.listItemBinding = function(itemTemplate) {
  var binding = {
    type: 'listItem',
    element: document.createElement('SPAN'),
    inputBinding: itemTemplate(),
    deleteButton: document.createElement('BUTTON'),
    setValue: function(v) {
      binding.inputBinding.setValue(v);
    },
    getValue: function() {
      return binding.inputBinding.getValue();
    },
    onDelete: function(b) {
    },
    focus: function() {
      if ('focus' in binding.inputBinding) {
        binding.inputBinding.focus();
      } else {
        binding.inputBinding.element.focus();
      }
    }
  };

  binding.deleteButton.innerText = 'X';
  binding.deleteButton.addEventListener('click', function(evt) {
    binding.onDelete(binding);
  });

  binding.element.appendChild(binding.inputBinding.element);
  binding.element.appendChild(binding.deleteButton);

  return binding;
};

templates.listReadOnly = function(itemTemplate, delimiter, prefix, suffix) {
  return function() {
    var binding = {
      type: 'listReadOnly',
      element: document.createElement('SPAN'),
      original: null,
      setValue: function(array) {
        binding.original = array;
        binding.element.innerHTML = '';

        if (prefix != null && delimiter != 'NUMBERED') {
          var span = document.createElement('SPAN');
          span.innerText = prefix;
          binding.element.appendChild(span);
        }

        for (var i = 0; i < array.length; ++i) {
          if (i > 0 && delimiter != null && delimiter != 'NUMBERED') {
            var comma = document.createElement('SPAN');
            comma.innerText = delimiter;
            binding.element.appendChild(comma);
          }

          if (delimiter == 'NUMBERED') {
            var number = document.createElement('SPAN');
            number.innerText
              = (prefix != null ? prefix : '')
              + (i + 1).toString()
              + (suffix != null ? suffix : '');
            binding.element.appendChild(number);
          }

          if (itemTemplate != null) {
            var item = itemTemplate();
          } else {
            var item = templates.textReadOnly();
          }
          item.setValue(array[i]);
          binding.element.appendChild(item.element);
        }

        if (suffix != null && delimiter != 'NUMBERED') {
          var span = document.createElement('SPAN');
          span.innerText = suffix;
          binding.element.appendChild(span);
        }
      },
      getValue: function() {
        return original;
      },
      focus: function() {
      }
    };

    return binding;
  };
};

