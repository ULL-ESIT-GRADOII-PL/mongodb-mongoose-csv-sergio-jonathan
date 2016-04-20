// See http://en.wikipedia.org/wiki/Comma-separated_values
(() => {
    "use strict"; // Use ECMAScript 5 strict mode in browsers that support it

    const resultTemplate = `
<div class="contenido">
      <table id="result">
          <% _.each(rows, (row) => { %>
          <tr class="<%=row.type%>">
              <% _.each(row.items, (name) =>{ %>
              <td><%= name %></td>
              <% }); %>
          </tr>
          <% }); %>
      </table>
  </p>
</div>
`;

    /* Volcar la tabla con el resultado en el HTML */
    const fillTable = (data) => {
        $("#finaltable").html(_.template(resultTemplate, {
            rows: data.rows
        }));
    };

    const handleFileSelect = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.target.files;

        var reader = new FileReader();
        reader.onload = (e) => {

            $("#original").val(e.target.result);
        };
        reader.readAsText(files[0])
    }

    /* Drag and drop: el fichero arrastrado se vuelca en la textarea de entrada */
    const handleDragFileSelect = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files; // FileList object.

        var reader = new FileReader();
        reader.onload = (e) => {

            $("#original").val(e.target.result);
            evt.target.style.background = "white";
        };
        reader.readAsText(files[0])
    }

    const handleDragOver = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.target.style.background = "yellow";
    }

    $(document).ready(() => {
        let original = document.getElementById("original");
        if (window.localStorage && localStorage.original) {
            original.value = localStorage.original;
        }

        /* Request AJAX para que se calcule la tabla */
        $("#parse").click(() => {
            if (window.localStorage) localStorage.original = original.value;
            $.get("/csv", /* Request AJAX para que se calcule la tabla */ {
                    input: original.value
                },
                fillTable,
                'json'
            );
        });
        /* botones para rellenar el textarea */
        $('button.example').each((_, y) => {
            $(y).click(() => {
                $.get("/findByName", {
                        name: $(y).text()
                    },
                    (data) => {
                        $("#original").val(data[0].content);
                    });
            });
        });

        $.get("/find", {}, (data) => {
            for (var i = 0; i < 4; i++) {
                if (data[i]) {
                    $('button.example').get(i).className = "example";
                    $('button.example').get(i).textContent = data[i].name;
                }
            }
        });

        $("#guardar").click(() => {
          if (window.localStorage) localStorage.original = original.value;
          $.get("/mongo/" + $("#titulo").val(), {
            content: $("#original").val()
          });
        });

        // Setup the drag and drop listeners.
        //var dropZone = document.getElementsByClassName('drop_zone')[0];
        let dropZone = $('.drop_zone')[0];
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleDragFileSelect, false);
        let inputFile = $('.inputfile')[0];
        inputFile.addEventListener('change', handleFileSelect, false);
    });
})();
