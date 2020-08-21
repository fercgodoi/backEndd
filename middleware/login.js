const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.obrigatorio = (req, res, next)=> {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_KEY); 
        req.funcionario = decode;
        next();
    } catch (error) {
        return res.json({error: 'falha na autenticação do token'})
    }
}

exports.inicio = (req, res, next)=> {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_KEY); 
        req.prestadores = decode;
        next();
    } catch (error) {
        return res.json({error: 'falha na autenticação do token',err :error})
    }
}
