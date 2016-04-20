"use strict";

const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

app.set('port', (process.env.PORT || 5000));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));

const calculate = require('./models/calculate');

app.get('/', (request, response) => {
  response.render('index', { title: 'Analizador CSV' });
});

app.get('/csv', (request, response) => {
  response.send({ "rows": calculate(request.query.input) });
});

app.param('entrada', function (req, res, next, entrada) {  
  if (entrada.match(/^[a-z_]\w*\.csv$/i)) { 
      req.entrada = entrada;
  } else { 
      next(new Error(`<${entrada}> no casa con los requisitos de 'entrada'`));
   }
  next();
});

app.get('/mongo/:entrada', function(req, res) { 
  console.log(req.entrada);
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
