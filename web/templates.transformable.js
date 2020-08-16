// templates.transformable.js

templates.transformable = {
  triggerKeys: function() {
    var schemes = data.setting.value('inputTransformations');
    var triggerKeys = {};

    for (var i = 0; i < schemes.length; ++i) {
      var scheme = schemes[i];

      for (var j = 0; j < scheme.detail.transformations.length; ++j) {
        var transformation = scheme.detail.transformations[j];
        var inp = transformation.inputSequence;
        var outp = transformation.outputSequence;
        var last = inp.substr(inp.length - 1);

        if (!(last in triggerKeys)) {
          triggerKeys[last] = {};
        }

        if (!(scheme.detail.code in triggerKeys[last])) {
          triggerKeys[last][scheme.code] = [];
        }

        triggerKeys[last][scheme.code].push({
          inputSequence: inp,
          outputSequence: outp,
          inputLength: inp.length
        });
      }
    }

    return triggerKeys;
  },
  embeddableModifier: function (element) {
    var triggerKeys = templates.transformable.triggerKeys();

    element.onkeypress = function(evt) {
      if (evt.key in triggerKeys) {
        // Are we within square brackets?
        var prefix = element.value.substr(0, element.selectionStart) + evt.key;
        var openBracket = prefix.lastIndexOf('[');
        var closeBracket = prefix.lastIndexOf(']');
        var colon = prefix.lastIndexOf(':', prefix.length - 2);
        if (openBracket > closeBracket && colon > openBracket) {
          var schemes = triggerKeys[evt.key];
          var schemeCode = prefix.substring(openBracket + 1, colon).trim();
          var transformable = prefix.substring(colon + 1);
          var transformableLength = transformable.length;
          if (schemeCode in schemes) {
            var ts = schemes[schemeCode];

            for (var i = 0; i < ts.length; ++i) {
              var t = ts[i];

              if (t.inputLength <= transformableLength) {
                var tail = transformable.substr(transformableLength - t.inputLength);
                if (tail == t.inputSequence) {
                  var keeper = prefix.substr(0, prefix.length - t.inputLength);
                  var suffix = element.value.substr(element.selectionStart);
                  var newPrefix = keeper + t.outputSequence;
                  element.value = newPrefix + suffix;
                  element.selectionStart = newPrefix.length;
                  element.selectionEnd = element.selectionStart;
                  return false;
                }
              }
            }
          }
        }
      }

      return true;
    };
  },

  wholeFieldModifier: function (element) {
    var triggerKeys = templates.transformable.triggerKeys();
    var defaults = data.setting.value('defaults', {
      defaultTransformationScheme: 'xx'
      });

    element.value = defaults.defaultTransformationScheme + ':';

    element.onkeypress = function(evt) {
      if (evt.key in triggerKeys) {
        var prefix = element.value.substr(0, element.selectionStart) + evt.key;
        var colon = prefix.lastIndexOf(':', prefix.length - 2);
        if (colon >= 0) {
          var schemes = triggerKeys[evt.key];
          var schemeCode = prefix.substring(0, colon).trim();
          var transformable = prefix.substring(colon + 1);
          var transformableLength = transformable.length;
          if (schemeCode in schemes) {
            var ts = schemes[schemeCode];

            for (var i = 0; i < ts.length; ++i) {
              var t = ts[i];

              if (t.inputLength <= transformableLength) {
                var tail = transformable.substr(transformableLength - t.inputLength);
                if (tail == t.inputSequence) {
                  var keeper = prefix.substr(0, prefix.length - t.inputLength);
                  var suffix = element.value.substr(element.selectionStart);
                  var newPrefix = keeper + t.outputSequence;
                  element.value = newPrefix + suffix;
                  element.selectionStart = newPrefix.length;
                  element.selectionEnd = element.selectionStart;
                  return false;
                }
              }
            }
          }
        }
      }

      return true;
    };
  }
};
