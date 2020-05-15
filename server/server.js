// @ts-ignore
require('./config/config');
// Using Node.js `require()`
const mongoose = require('mongoose');

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// .use ==> middleware ==> se ejecuta cada vez que lo hace el código
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

// Mongoose
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) => {
    if (err) throw err;

    console.log("Base de datos ONLINE");
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
})