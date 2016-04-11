(function(exports) => {
  "use strict";

  const regexp = /"((?:[^"\\]|\\.)*)"|([^,\s]+)|,\s*(?=,|$)|^\s*,/g;
  const calculate = (original) => {
    let lines = original.split(/\n+\s*/);
    let commonLength = lines[0].match(regexp).length;

    for (var i in lines)
      if (lines[i].match(regexp)) {
        firstLine = i;
        var commonLength = lines[i].match(regexp).length;
        break;
      }

    let r = [];
    const removeQuotes = (field) => {
      return field.replace(/,\s*$/, '').
      replace(/^\s*"/, '').
      replace(/"\s*$/, '').
      replace(/\\"/, '"');
    };

    for (let t in lines) {
      let temp = lines[t];
      let m = temp.match(regexp);
      let result = [];
      let error = false;
      let first = false;

      // skip empty lines and comments
      if (temp.match(/(^\s*$)|(^#.*)/)) continue;
      if (m) {
        result = m.map(removeQuotes);
        error = (commonLength != m.length);
        first = (firstLine == t);
        let rowclass = error ? 'error' : 'legal';
        rowclass = first ? 'first' : rowclass;
        r.push({
          items: result,
          type: rowclass
        });
      } else {
        let errmsg = 'La fila "' + temp + '" no es un valor de CSV permitido.';
        r.push({
          items: errmsg.split("").splice(commonLength),
          type: 'error'
        });
      }
    }
    return r;
  };

  module.exports = calculate;
})(this);
