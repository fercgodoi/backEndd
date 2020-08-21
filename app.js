const express= require('express');
const app = express();                               //Router: para poder pegar as rotas, fica mais performance
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')

app.io = require('socket.io')()

const RotaAgendamento = require('./routes/agendamento/agendamento')
const rotaFuncionario = require('./routes/funcionario/funcionario') 
const rotaProduto = require('./routes/produto/produto')
const rotaPrestador = require('./routes/prestador/prestador')
const rotaVacina = require('./routes/vacinas/vacina')
const rotaMedicacao = require('./routes/medicamento/medicamento')
const rotaProntuario = require('./routes/prontuario/prontuario')
const rotaExame = require('./routes/exame/exame')
const rotaTeste = require('./routes/teste/teste')

app.use(cors());                                        //libera o acesso para determinados dominios
app.use(morgan('dev'));                                 //da uma informação no console sobre a requisição(callback)//s
app.use('/uploads/imgPrest', express.static('uploads/imgPrest'));        // diretorio uploads esta disponivel publicamente
app.use('/imagens/CadastroPrimeiro', express.static('imagens/CadastroPrimeiro'));        // diretorio uploads esta disponivel publicamente
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




app.use('/Agendamento', RotaAgendamento);       //deixando o diretorio uploads disponivel publicamente, p poder ser visualizado no navegador//
app.use('/Funcionario', rotaFuncionario); 
app.use('/Prestador', rotaPrestador); 
app.use('/Produto', rotaProduto); 
app.use('/Vacina', rotaVacina); 
app.use('/Medicamento', rotaMedicacao); 
app.use('/Prontuario', rotaProntuario); 
app.use('/Exame', rotaExame); 
app.use('/Teste', rotaTeste); 


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