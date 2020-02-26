const express= require('express');
const app = express();                               //Router: para poder pegar as rotas, fica mais performance
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')

const rotaCliente = require('./routes/cliente/crudClientes')
const rotaCadastroUser = require('./routes/cliente/cliente') 
const rotaPet = require('./routes/pet/pet') 
const rotaVacina = require('./routes/vacinas/vacina')
const rotaPrestador = require('./routes/prestadores/prestador')
const rotaFuncionario = require ('./routes/funcionarios/funcionario')


app.use(cors());                                        //libera o acesso para determinados dominios
app.use(morgan('dev'));                                 //da uma informação no console sobre a requisição(callback)//s
app.use(bodyParser.urlencoded({extended: false}));      //Aceitar apenas dados simples//
app.use(bodyParser.json());                             //so iremos aceita formato json//

app.use((req, res, next) => {                           //implemetando o cors//
    res.header('Access-Control-Allow-Origin', '*')      //permissao de controle de acesso para todos* (poderia passar algum http) //
    res.header('Access-Control-Allow-Header',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');        //informação a ser passada no header//
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET')     //tipos de metodos rest que aceita//
        return res.status(200).send({});
    }
    next();                                             //para poder passar a baixo quando vir o request//
});

app.use('/cliente', rotaCliente);
app.use('/cadastro', rotaCadastroUser);
app.use('/pet', rotaPet);
app.use('/vacina', rotaVacina);
app.use('/prestador', rotaPrestador);
app.use('/funcionario', rotaFuncionario);
app.use('/uploads', express.static('uploads'));         //deixando o diretorio uploads disponivel publicamente, p poder ser visualizado no navegador//

 //quando nao encontra rota cai aqui//
app.use((req, res, next)=> {                        //tratamento de erro//
    const erro = new Error('Não encontrado');
    erro.status = 404 ;
    next(erro);
});

app.use((error, req, res, next)=> {                 //tratamento de erro//
    res.status(error.status || 500)
    return res.send({
        erro:{
            mensagem: error.message
        }
    })
});


module.exports = app;