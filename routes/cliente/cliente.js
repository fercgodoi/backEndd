const express = require('express');
const router = express.Router();
//const mysql = require('mysql');
//const mysql = require('../../mysql').pool;              //para conectar ao banco
const multer = require('multer');                       //para salvar imagens
//const nodemailer = require("nodemailer");               //para enviar emails
//const bcrypt = require('bcrypt');                       //hash nas senhas
const login = require('../../middleware/login');

const clienteController = require('../../controllers/cliente/cliente-controller');

const clienteLogin = require('../../controllers/cliente/cliente-login')

const ClienteCadastro = require('../../controllers/cliente/cliente-cadastro')

router.post('/cad', ClienteCadastro.cadastroCliente);
router.post('/login', clienteLogin.loginCliente);
router.post('/passo2', login.obrigatorio, clienteController.atualizarCliente);
router.post('/authCod', login.obrigatorio, clienteController.authCod);
router.post('/recSenha', clienteController.recSenha);
router.post('/AltSenha', login.obrigatorio, clienteController.AlterarSenha);


//-----------------------BLOCO DE UPLOAD IMAGEM----------//

/*const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);     //Nomeando a imagem com a data e o nome original da imagem,  //
    }
});

const fileFitro = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
       cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5                   //limitando o tamanho da imagem p 5mb
    },
    fileFilter: fileFitro
}); */

//---------------------------------BLOCO EMAIL------------------------------------------------------//
/*
let transporter = nodemailer.createTransport({                  //configurando a minha conta, dados da conta q vai enviar//
    host:"imap.gmail.com",                                     
    port: 465,
    secure: true,
    auth: {
        user: "oneforasteiro@gmail.com",
        pass: "largatixa"                                       
    }
});
    */
//


//-------------------------------------BLOCO PRINCIPAL------------------------------------------//

/* function getRandomInt() { return Math.floor(Math.random() * (999999 - 100000)) + 100000; }

router.post('/cad', (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        } 
        conn.query('select * from cliente where emailCli = ?',[req.body.email],
            (error, resultado, fields) => {
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: error})        
                }
                if(resultado.length > 0 ){
                    return res.status(409).send("Usuario ja existente")    //nao aceita, usuario ja existente
                }

                let passRandom = getRandomInt();
                let timeCodCli = Date.now();
                    //return res.status(200).send("1")    //aceito
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) =>{
                    if(errBcrypt){ return res.status(500).send({ error: errBcrypt }) }
                    conn.query('insert into cliente(nomeCli, emailCli, senhaCli, codigoCli, timeCodCli) values (?, ?, ?, ?, ?)',
                        [req.body.nome, req.body.email, hash, passRandom, timeCodCli],
                        (error, resultado, field)=> {                  //tratando o retorno
                            conn.release();                            //IMPORTANTE release: liberar a conexao com a nossa query 
                            if(error){                                  //tratamento de erro da query
                                return res.status(500).send({ error: error})        
                            }

                            transporter.sendMail({
                                from: "  One <oneforasteiro@gmail.com>",
                                to: req.body.email,               
                                subject: "Recuperar senha",
                                text: `Faça login novamente no app com esta senha: ${passRandom}`
                                //html: "caso precise vc pode passar um html, fica mais bonito e creio que podemos passar informaçoes nesse html sobre redirecionar p outra api"
                            }).then(message => {
                                res.status(202).send({ 
                                    mensagem: message, 
                                    message:'Bem vindo ao app, enviamos um codigo ao seu email',
                                    resultado: resultado
                                })
                            }).catch(err =>{
                                res.status(404).send({ mensagem: "nao deu", error: err, email: req.body.email})
                            })
                            //COLOCAR CODIGO P ENVIAR EMAIL                 <========================POR FAZEEEEEER

                        }
                    )
                })     
            }
        )
    })
}); */

/*
//----------------------------teste criptografia e jwt token-----------------------//
router.post('/bcrypt', (req, res, next)=>{
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error}) }       //tratamento de erro da conexao                                 
        bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) =>{ 
            if(errBcrypt){ return res.status(500).send({ error: errBcrypt }) }
            let passRandom = getRandomInt();
            let timeCodCli = Date.now();
            conn.query('insert into cliente(cpfCli, emailCli, senhaCli, codigoCli, timeCodCli) values (?, ?, ?, ?, ?)',
            [req.body.nome, req.body.email, hash, passRandom, timeCodCli],
                (error, result) =>{
                    conn.release();
                    if(error){ return res.status(500).send({ error: error }) }

                    response= {
                    mensagem: "Cliente criado com sucesso",
                        DadosCliente:{
                            id: result.insertId,
                            email: req.body.email,
                            senha: hash
                        }
                    }
                    return res.status(201).send(response)
                }
            )
        })
    })
})

router.post('/uptest', login.obrigatorio, (req, res, next) => {     //implementação de autenticação de rotas via jwt
    console.log(req.cliente);
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error}) }                                //tratamento de erro da conexao
        conn.query('update cliente set cpfCli = ? where idCli = ?',[req.body.cpf, req.body.id],
            (error, resultado, fields) => {
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: error})        
                }
                return res.status(200).send({response: resultado, token: req.cliente.idCliente})
            }
        )
    })
}); */



//-------------------------------RESTANTE DOS DADOS--------------------------------------------------//

/*
router.post('/passo2', upload.single('img_Cliente'), login.obrigatorio, (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query(`update cliente set cpfCli = ?, telefoneCli = ?, cepCli = ?, estadoCli = ?, cidadeCli = ?, ruaCli = ?, numeroCli = ?, complementoCli = ?, fotoCli = ?, ${"status_cli = 'ok'"} where idCli = ?`,
                 [req.body.cpfCli, req.body.telefoneCli, req.body.cepCli, req.body.estadoCli, req.body.cidadeCli, req.body.ruaCli, req.body.numeroCli, req.body.complementoCli, req.file.path, req.body.idCli],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                    return res.status(201).send({                          
                        mensagem: 'Cliente inserido com sucesso',
                        id_Cliente: resultado.insertId                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
}); */

//---------------------------------TESTE DA IMAGEM-----------------------------//
/*
router.post('/passot', upload.single('img_Cliente'), (req, res, next) => {                                  
    console.log(req.file);
    mysql.getConnection((error, conn) =>{
        if(error){                                              //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('insert into cliente(nomeCli, emailCli, senhaCli, fotoCli) values (?, ?, ?, ?)',
                 [req.body.nome, req.body.email, req.body.senha, req.file.path],
                 (error, resultado, field)=> {                  //tratando o retorno
                     conn.release();                            //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error })        
                    }

                    const response = {                          //tratando o retorno
                        ClienteCadastrado: {
                                id_Cliente: resultado.insertId,
                                Nome: req.body.nome,
                                img_cliente: req.file.path
                        }
                    }

                    return res.status(201).send({                          
                        mensagem: 'Cliente inserido com sucesso',
                        id_Cliente: response                        //retorno do id do Cliente cadastrado
                    })
                }
        )
    }) 
}); */


//---------------------------------------------------------------------------------------//
/*

router.post('/passo1', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                              //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('insert into cliente(nomeCli, emailCli, senhaCli) values (?, ?, ?)',
                 [req.body.nome, req.body.email, req.body.senha],
                 (error, resultado, field)=> {                  //tratando o retorno
                     conn.release();                            //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }

                    const response = {                          //tratando o retorno
                        ClienteCadastrado: {
                                id_Cliente: resultado.insertId,
                                Nome: req.body.nome
                        }
                    }

                    return res.status(201).send({                          
                        mensagem: 'Cliente inserido com sucesso',
                        id_Cliente: response                        //retorno do id do Cliente cadastrado
                    })
                }
        )
    }) 
});


router.post('/vrfEmail', (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        } 
        conn.query('select * from cliente where emailCli = ?',[req.body.email],
            (error, resultado, fields) => {
                conn.release();
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: error})        
                }
                const resp = {                          //tratando o retorno
                    Clientes: resultado.map(cli => {
                        return{
                            resEmail: cli.emailCli,
                        }
                    })
                }
                if(resp.Clientes.length > 0 ){
                    return res.status(200).send("0")    //nao aceita, usuario ja existente
                }
                else{
                    return res.status(200).send("1")    //aceito
                }

            }
        )
    })
});*/



module.exports = router;