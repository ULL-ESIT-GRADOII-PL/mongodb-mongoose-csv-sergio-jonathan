"use strict";

const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/csv');


app.set('port', (process.env.PORT || 5000));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));

const calculate = require('./models/calculate');

app.get('/', (request, response) => {
    response.render('index', {
        title: 'Analizador CSV'
    });
});

app.get('/csv', (request, response) => {
    response.send({
        "rows": calculate(request.query.input)
    });
});

app.param('entrada', function(req, res, next, entrada) {
    if (entrada.match(/^[a-z_]\w*\.csv$/i)) {
        req.entrada = entrada;
    } else {
        next(new Error(`<${entrada}> no casa con los requisitos de 'entrada'`));
    }
    next();
});

const Input = require('./models/db-structure');

app.get('/mongo/:entrada', function(req, res) {
    Input.find({}, function(err, docs) {
        if (err)
            return err;
        if (docs.length >= 4) {
            Input.find({ name: docs[3].name }).remove().exec();
        }
    });
    let input = new Input({
        "name": req.entrada,
        "content": req.query.content
    });

    input.save(function(err) {
        if (err) {
            console.log(`Hubieron errores:\n${err}`);
            return err;
        }
        console.log(`Saved: ${input}`);
    });
});

app.get('/find', function(req, res) {
    Input.find({}, function(err, docs) {
        if (err)
            return err;
        res.send(docs);
    });
});

app.get('/findByName', function(req, res) {
    Input.find({
        name: req.query.name
    }, function(err, docs) {
        res.send(docs);
    });
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}`);
});
