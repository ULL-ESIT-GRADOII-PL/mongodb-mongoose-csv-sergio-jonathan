(function(exports) {
  "use strict";

  var regexp = /"((?:[^"\\]|\\.)*)"|([^,\s]+)|,\s*(?=,|$)|^\s*,/g;
  var calculate = function(original) {
    var lineas = original.split(/\n+\s*/);

    for(var i in lineas)
      if(lineas[i].match(regexp)) {
        var commonLength = lineas[i].match(regexp).length;
        break;
      }

    var r = [];
    var removeQuotes = function(field) {
      return field.replace(/,\s*$/, '').
      replace(/^\s*"/, '').
      replace(/"\s*$/, '').
      replace(/\\"/, '"');
    };

    for (var t in lineas) {
      var temp = lineas[t];
      var m = temp.match(regexp);
      var result = [];
      var error = false;

      // skip empty lineas and comments
      if (temp.match(/(^\s*$)|(^#.*)/)) continue;
      if (m) {
        result = m.map(removeQuotes);
        error = (commonLength != m.length);
        var rowclass = error ? 'error' : 'legal';
        r.push({
          items: result,
          type: rowclass
        });
      } else {
        var errmsg = 'La fila "' + temp + '" no es un valor de CSV permitido.';
        r.push({
          items: errmsg.split("").splice(commonLength),
          type: 'error'
        });
      }
    }
    return r;
  };

  exports.calculate = calculate;
})(this);
