// templates.compiler.js

templates.compiler = {
  compileURL: function(namespace, url, success, failure) {
    templates.compiler.read(
      url,
      function(content) {
        success(templates.compiler.compile(namespace, content));
      },
      failure);
  },

  read: function(url, success, failure) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          try {
            success(xhttp.responseText);
          } catch (error) {
            if (failure == null) {
              console.log('4001: Failed to process retrieved document');
            } else {
              failure('4001');
            }
          }
        } else {
          if (failure == null) {
            console.log('4002: ' + this.status);
          } else {
            failure('4002: ' + this.status);
          }
        }
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  },

  newBinding: function() {
    var binding = {
      element: null,
      original: null,
      _collection: null,
      model: {},
      bind: function(collection, key) {
        binding._collection = collection;
        if (key != null) {
          binding.setValue(collection[key]);
        } else {
          binding.setValue(collection.new());
        }
      },
      setValue: function(v) {
        binding.original = v;
        binding.write(v);
      },
      getValue: function() {
        var v = binding.read();
        binding._merge(v);
        return binding.original;
      },
      write: function(v) {
      },
      read: function() {
        return null;
      },
      rewrite: function() {
        binding.write(binding.original);
      },
      _merge: function(v) {
        if (binding.original == null) {
          binding.original = v;
        } else if (typeof(v) != 'object') {
          binding.original = v;
        } else if (v != null) {
          for (var name in v) {
            binding.original[name] = v[name];
          }
        }
      },
      save: function() {
        if (binding._collection != null) {
          var v = binding.getValue();
          binding._collection.update(v);
        } else {
          binding._saveMembers(binding.model);
        }
      },
      _saveMembers: function(model) {
        if (('isBinding' in model) && model.isBinding == true) {
          model.save();
        } else {
          for (var name in model) {
            binding._saveMembers(model[name]);
          }
        }
      }
    };

    return binding;
  },

  newNamespace: function (parentNamespace) {
    var ns = {
      parent: parentNamespace,
      values: {},
      add: function(n, v) {
        ns.values[n] = v;
      },
      find: function(n) {
        if (n in ns.values) {
          return ns.values[n];
        }
        if (ns.parent != null) {
          return ns.parent.find(n);
        }
        return null;
      },
      newChild: function() {
        return templates.compiler.newNamespace(ns);
      }
    };
    return ns;
  },

  nativeTags: {
    INPUT: function(node) {
      return function() {
        var binding = templates.compiler.newBinding();

        binding.element = node;
        binding.read = function() {
          return binding.element.value;
        };
        binding.write = function(v) {
          binding.element.value = binding.original;
        };

        return binding;
      };
    },
    SELECT: function(node) {
      return function() {
        var binding = templates.compiler.newBinding();

        binding.element = node;
        binding.read = function() {
          return binding.element.value;
        };
        binding.write = function(v) {
          binding.element.value = binding.original;
        };

        return binding;
      };
    }
  },

  settings: {
    classTag: 'CLASS',
    objectTag: 'OBJECT',
    scriptTag: 'SCRIPT',
    usingTag: 'USING'
  },

  assocArrayFromAttributes: function(node) {
    var result = {};

    for (var name in node.attributes) {
      result[name] = node.attributes[name].nodeValue;
    }

    return result;
  },

  compile: function(namespace, markup) {
    return function(attributes, content) {
      return function() {
        var top = document.createElement('SPAN');
        top.innerHTML = markup;

        var binding = templates.compiler.newBinding();

        binding.element = top;
        binding.write = function(v) {
          binding.original = v;
          templates.compiler.setValue(binding.model, v);
        };
        binding.read = function() {
          return templates.compiler.getValue(binding.model);
        };

        // Recurse down the binding element and replace spork tags with binding
        // elements
        templates.compiler.transform(
          namespace,
          binding,
          binding.model,
          binding.element,
          attributes,
          content);

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

  transform: function(namespace, parentBinding, model, root, attributes, content) {
    for (var i = 0; i < root.childElementCount; ++i) {
      var node = root.children[i];

      var factory = namespace.find(node.tagName);
      if (factory != null) {
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
          templates.compiler.transform(
            namespace.newChild(),
            parentBinding,
            model[name],
            span,
            attributes,
            content);
        } else {
          console.log('Warning: ' + node.tagName + ' does not have a name');
          templates.compiler.transform(
            namespace.newChild,
            parentBinding,
            model,
            node,
            attributes,
            content);
        }
      } else if (node.tagName == templates.compiler.settings.contentTag) {
        var span = document.createElement('SPAN');
        span.innerHTML = content;
        root.insertBefore(span, node);
        root.removeChild(node);
      } else if (node.tagName == templates.compiler.settings.classTag) {
        if ('name' in node.attributes) {
          var name = node.attributes.name.nodeValue.toUpperCase();
          namespace.add(name, templates.compiler.compile(
            namespace.newChild(),
            node.innerHTML));
        } else {
          console.log('Warning: class defined without a name');
        }
        root.removeChild(node);
      } else if (node.tagName == templates.compiler.settings.scriptTag) {
        templates.compiler.executeScript(
          namespace,
          parentBinding,
          node.innerText);
      } else if (node.tagName == templates.compiler.settings.usingTag) {
        // If we find a "using" tag, we'll treat the document referenced
        // by that tag as belonging at this point in our current document,
        // and the content of the tag as being parallel to the content
        // of the referenced document
        if ('src' in node.attributes) {
          var url = node.attributes.src.nodeValue;

          // Replace the "using" node with a span
          var span = document.createElement('SPAN');
          root.insertBefore(span, node);
          root.removeChild(node);

          templates.compiler.read(
            url,
            function(remoteContent) {
              span.innerHTML = remoteContent + node.innerHTML;
              templates.compiler.transform(
                namespace.newChild(),
                parentBinding,
                model,
                span,
                attributes,
                content);
            },
            function(error) {
              console.log('Error reading remote content: ' + url);
            });
        } else {
          console.log('Error: ' + node.tagName + ' without src');
        }
      } else {
        templates.compiler.transform(
          namespace.newChild(),
          parentBinding,
          model,
          node,
          attributes,
          content);
      }
    }
  },

  executeScript: function(namespace, binding, script) {
    eval('var f = function(namespace, binding) {' + script + '}');
    return f(namespace, binding);
  },

  test001: function() {
    var ns = templates.compiler.newNamespace(null);
    var success = function(factory) {
      templates.compiler.test001_factory = factory;
      templates.compiler.test001_template = factory();
      templates.compiler.test001_binding = templates.compiler.test001_template();
      document.body.innerHTML = '';
      document.body.appendChild(templates.compiler.test001_binding.element);
      console.log('Success');
    };
    var failure = function(error) {
      console.log('Error: ' + error.toString());
    };
    templates.compiler.compileURL(ns, 'forms.test.html', success, failure);
  }
};

