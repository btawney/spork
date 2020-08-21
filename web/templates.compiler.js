// templates.compiler.js

templates.compiler = {
  sporkTags: {
  },

  nativeTags: {
    INPUT: function(node) {
      return function() {
        var binding = {
          element: node,
          getValue: function() {
            return binding.element.value;
          },
          setValue: function(v) {
            binding.element.value = v;
          }
        };
        return binding;
      }
    }
  },

  settings: {
    classTag: 'CLASS',
    objectTag: 'OBJECT'
  },

  assocArrayFromAttributes: function(node) {
    var result = {};

    for (var name in node.attributes) {
      result[name] = node.attributes[name].nodeValue;
    }

    return result;
  },

  compileTemplateFactoryDefinition: function(markup) {
    return function(attributes, content) {
      return function() {
        var container = document.createElement('SPAN');
        container.innerHTML = markup;

        if (container.childElementCount == 1) {
          var top = container.children[0];
        } else {
          var top = container;
        }

        // If the top is a spork tag, then return a binding from its existing
        // factory, don't wrap it in another
        if (top.tagName in templates.compiler.sporkTags) {
          var factory = templates.compiler.sporkTags[top.tagName];
          var attrs = templates.compiler.assocArrayFromAttributes(top);
          return factory(attrs, top.innerHTML)();
        } else if (top.tagName in templates.compiler.nativeTags) {
          var factory = templates.compiler.nativeTags[top.tagName];
          return factory(top)();
        }

        var binding = {
          element: top,
          model: {},
          setValue: function(v) {
            templates.compiler.setValue(binding.model, v);
          },
          getValue: function() {
            return templates.compiler.getValue(binding.model);
          }
        };

        // Recurse down the binding element and replace spork tags with binding
        // elements
        templates.compiler.transform(binding.model, binding.element, content);

        return binding;
      };
    };
  },

  getValue: function(model) {
    if (('isBinding' in model) && model.isBinding == true) {
      return model.binding.getValue();
    } else {
      var result = {};
      for (var name in model) {
        result[name] = templates.compiler.getValue(model[name]);
      }
      return result;
    }
  },

  setValue: function(model, v) {
    if (('isBinding' in model) && model.isBinding == true) {
      model.binding.setValue(v);
    } else if (typeof(v) == 'object') {
      for (var name in model) {
        if (name in v) {
          templates.compiler.setValue(model[name], v[name]);
        }
      }
    } else {
      console.log('Warning: Value is not the same shape as model');
    }
  },

  transform: function(model, root, content) {
    for (var i = 0; i < root.childElementCount; ++i) {
      var node = root.children[i];

      if (node.tagName in templates.compiler.sporkTags) {
        var factory = templates.compiler.sporkTags[node.tagName];
        var attrs = templates.compiler.assocArrayFromAttributes(node);
        var template = factory(attrs, node.innerHTML);

        var binding = template();

        if ('name' in node.attributes) {
          var name = node.attributes.name.nodeValue;
          if (name in model) {
            console.log('Warning: multiple definitions for ' + name);
          }
          model[name] = {isBinding: true, binding: binding};
        } else {
          console.log('Warning: ' + node.tagName + ' does not have a name');
        }

        root.insertBefore(binding.element, node);
        root.removeChild(node);
      } else if (node.tagName in templates.compiler.nativeTags) {
        var factory = templates.compiler.nativeTags[node.tagName];
        var template = factory(node);

        var binding = template();

        if ('name' in node.attributes) {
          var name = node.attributes.name.nodeValue;
          if (name in model) {
            console.log('Warning: multiple definitions for ' + name);
          }
          model[name] = {isBinding: true, binding: binding};
        } else {
          console.log('Warning: ' + node.tagName + ' does not have a name');
        }
      } else if (node.tagName == templates.compiler.settings.objectTag) {
        if ('name' in node.attributes) {
          var name = node.attributes.name.nodeValue;
          model[name] = {};
          // Replace the object node with a span
          var span = document.createElement('SPAN');
          span.innerHTML = node.innerHTML;
          root.insertBefore(span, node);
          root.removeChild(node);
          templates.compiler.transform(model[name], span, content);
        } else {
          console.log('Warning: ' + node.tagName + ' does not have a name');
          templates.compiler.transform(model, node, content);
        }
      } else if (node.tagName == templates.compiler.settings.contentTag) {
        var span = document.createElement('SPAN');
        span.innerHTML = content;
        root.insertBefore(span, node);
        root.removeChild(node);
      } else {
        templates.compiler.transform(model, node, content);
      }
    }
  }
};
