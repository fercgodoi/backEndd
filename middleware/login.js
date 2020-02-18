const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.obrigatorio = (req, res, next)=> {

    try{
        const token = req.headers.authorization.split(' ')[1];
        //const decode = jwt.verify(req.body.token, process.env.JWT_KEY);
        //const token = req.headers.jwt;
        const decode = jwt.verify(token, process.env.JWT_KEY); 
        req.cliente = decode;
        next();
    } catch (error) {
        return res.status(401).send({mensagem: 'falha na autenticação do token', erroou: error.message})
    }
}

exports.opcional = (req, res, next)=> {

    try{
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.cliente = decode;
        next();
    } catch (error) {
        next();
    }
}
    /*let token = req.body.token;
    if (!token) return res.status(401).send({ message: 'No token provided.' });
    
    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.user = decoded;
      next();
    }); */
   

    /*try{
        const decode = jwt.verify(req.body.token, process.env.JWT_KEY);
        req.cliente = decode;
        next();
    } catch (error) {
        return res.status(401).send({mensagem: 'falha na autenticação do token', error: error})
    } */
