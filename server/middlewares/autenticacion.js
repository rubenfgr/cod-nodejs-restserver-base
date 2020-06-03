

const jwt = require('jsonwebtoken');

// =========================================
//      Verificar Token 
// =========================================
let verificaToken = (req, res, next) => { // next continua la ejecución del programa

    let token = req.get('token'); // Authorization | token

    jwt.verify( token, process.env.SEED, (err, decoded) => { // decoded = payload (cuerpo del token)

        if(err) {
            return res.status(401).json({ // 401 --> No autorizado
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });

}

// =========================================
//      Verificar AdminRole
// =========================================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if(usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({ // 401 --> No autorizado
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

    next();

}

// =========================================
//      Verificar token para imagen
// =========================================
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify( token, process.env.SEED, (err, decoded) => { // decoded = payload (cuerpo del token)

        if(err) {
            return res.status(401).json({ // 401 --> No autorizado
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });

}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}