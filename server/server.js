require('./config/config');

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// .use ==> middleware ==> se ejecuta cada vez que lo hace el código
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Agregar registros
app.get('/usuario', function (req, res) {
    res.json('get usuario')
});

app.post('/usuario', function (req, res) {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            "persona": body
        });
    }
});

// Actualizar datos (PUT y PATCH)
app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    res.json({
        id
    });
});

// Borrar registros
app.delete('/usuario/:id', function (req, res) {
    res.json('get usuario')
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
})