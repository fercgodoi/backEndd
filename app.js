const express= require('express')
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser')

const rotaCliente = require('./routes/clientes')


app.use(morgan('dev'))  //da uma informação no console sobre a requisição(callback)//s
app.use(bodyParser.urlencoded({extended: false}));      //Aceitar apenas dados simples//
app.use(bodyParser.json());                             //so iremos aceita formato json//

app.use((req, res, next) => {                           //implemetando o cors//
    res.header('Access-Control-Allow-Origin', '*')      //permissao de controle de acesso para todos* (poderia passar algum http) //
    res.header('Access-Control-Allow-Header',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');         //informação a ser passada no header//
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET')     //tipos de metodos rest que aceita//
        return res.status(200).send({});
    }
    next();                                             //para poder passar a baixo quando vir o request//
});

app.use('/cliente', rotaCliente);

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