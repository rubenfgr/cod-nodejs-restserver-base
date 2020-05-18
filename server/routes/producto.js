

const express = require('express');
const app = express();

let { verificaToken } = require('../middlewares/autenticacion');
let Producto = require('../models/producto');
const producto = require('../models/producto');

// =========================================
//      Mostrar todos los productos
// =========================================
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .sort('descripcion')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (productos.length <= 0) {
                return res.json({
                    ok: true,
                    message: 'No existe ningún producto en la BD'
                });
            }

            return res.json({
                ok: true,
                productos
            });

        });
});

// =========================================
//      Mostrar un producto por su ID
// =========================================
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                message: 'No se encuentra ningún producto con ese ID'
            });
        }

        return res.json({
            ok: true,
            producto: productoBD
        });

        return res.send({

        });
    });

});

// =========================================
//      Buscar productos
// =========================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); // Insensible a minúsculas y mayúsculas

    Producto.find({nombre: regex})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        });

});


// =========================================
//      Crear un producto
// =========================================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        // @ts-ignore
        usuario: req.usuario._id
    });

    producto.save((err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no se agregó'
                }
            });
        }

        return res.json({
            ok: true,
            producto: productoBD
        });

    });

});

// =========================================
//      Actualizar un producto por su ID
// =========================================
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID del producto solicitado no existe'
                }
            })
        }

        return res.json({
            ok: true,
            producto: productoBD
        });
    });

});

// =========================================
//      Eliminar un producto por su ID
// =========================================
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe ningún producto con ese ID'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save( (err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto borrado'
            })

        });

    });

});

module.exports = app;
