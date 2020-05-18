

const express = require('express');
const app = express();
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria');
const { reject } = require('underscore');
const { findById } = require('../models/categoria');
const _ = require('underscore');


// =========================================
//      Mostrar todas las categorias
// =========================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        });

    });
});

// =========================================
//      Mostrar una categoria por ID
// =========================================
app.get('/categoria/:id', verificaToken, (req, res) => {
    // Categoria.findById(....);
    let id = req.params.id;
    let categoria = Categoria.findById(id, (err, categoriaBD) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        if (categoria) {

            res.json({
                ok: true,
                categoria: categoriaBD
            });

        } else {

            res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró ninguna categoría con ese ID'
                }
            });

        }

    });
});

// =========================================
//      Crear nueva categoria
// =========================================
app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        // @ts-ignore
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });

});

// =========================================
//      Actualizar una categoria
// =========================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion', 'usuario']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaBD) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });

});

// =========================================
//      Borrar una categoria
// =========================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Solo un administrador puede borrar las categorias
    // Categoria.findByIdAndRemove...

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD,
            message: 'La categoría se eliminó correctamente'
        });

    });
});


module.exports = app;