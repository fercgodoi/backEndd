const mysql = require('../../mysql').pool;              //para conectar ao banco
const multer = require('multer');                       //para salvar imagens
const nodemailer = require("nodemailer");               //para enviar emails
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



//---------------------------------BLOCO EMAIL------------------------------------------------------//

let transporter = nodemailer.createTransport({                  //configurando a minha conta, dados da conta q vai enviar//
    host:"imap.gmail.com",                                     
    port: 465,
    secure: true,
    auth: {
        user: "oneforasteiro@gmail.com",
        pass: process.env.EMAIL_KEY                                       
    }
});

//--------------------------------------------------------------//

function getRandomInt() { return Math.floor(Math.random() * (999999 - 100000)) + 100000; }

//--------------------------------LOGIN----------------------------------------------------------//

exports.loginCliente = (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error}) }      //tratamento de erro da conexao
        conn.query('select * from cliente where emailCli = ?',[req.body.email],
            (error, result, fields) => {
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: 'Error de requisição'})        
                }

                if(result.length < 1){                 //tratamento de erro de autenticação
                    return res.status(401).send({response: "Usuario inexistente"})      //trocar retorno para falha de autenticação//
                }

                bcrypt.compare(req.body.senha, result[0].senhaCli, (err, resultCript)=> {           //comparando a senha hash com a senha enviada
                    if(err){ return res.status(500).send( 'error: falha na autenticação') }
                    
                    if(resultCript){        //CORRIGIR AQUI , PROVAVEL DE UMA PROMISSE
                        
                    const token = jwt.sign({
                        idCliente: result[0].idCli,
                        email: result[0].emailCli
                    }, process.env.JWT_KEY, {
                        expiresIn:"3H"
                    });
                        
                    const response = {                          //tratando o retorno
                        Clientes: result.map(cli => {
                            return{
                                idCliente: cli.idCli,
                                Nome: cli.nomeCli,
                                status: cli.status_cli,
                                timeCodCli: cli.timeCodCli,
                                emailCli: cli.emailCli
                            }
                        })
                    }

                    if(response.Clientes[0].status === 'Pendente'){                         //verificar se ele ja confirmou o codigo e ativou a conta
                        //return res.status(300).send({response: 'Pendente'})

                        let timeSist = Date.now();
                        let timeCliTot = response.Clientes[0].timeCodCli + 86400000;

                        if(timeSist > timeCliTot){                                          //**verifica se o codigo dele não é valido
                            //COLOCAR O NOVO CODIGO, TIME  P ALTERAR NO BANCO E ENVIAR O EMAIL NOVAMENTE
                            let passRandom = getRandomInt();

                            conn.query('update cliente set codigoCli= ?, timeCodCli = ? where emailCli = ? ',[passRandom, timeSist, response.Clientes[0].emailCli],
                                (error, result, fields) => {
                                    conn.release();
                                    if(error){                                  //tratamento de erro da query
                                        return res.status(500).send({ error: error})        
                                    }
                                    //return res.status(200).send({ message: 'Seu codigo expirou, enviamos um novo codigo para seu email'})
                                    //enviar o codigo pelo email//
                                     transporter.sendMail({
                                        from: "  One <oneforasteiro@gmail.com>",
                                        to: response.Clientes[0].emailCli,               
                                        subject: "Codigo de verificação",
                                        text: `Faça login novamente no app com esta senha: ${passRandom}`
                                        //html: "caso precise vc pode passar um html, fica mais bonito e creio que podemos passar informaçoes nesse html sobre redirecionar p outra api"
                                    }).then(message => {
                                        res.status(202).send({ mensagem: message, message: 'Seu codigo expirou, enviamos um novo codigo para seu email' })
                                    }).catch(err =>{
                                        res.status(404).send({ mensagem: "nao deu"})
                                    }) 

                                }
                            ) 
                    }else {                                                              
                        //**se o codigo for valido ira redirecionar para tela onde ele ira conferir o codigo
                        return res.status(200).send({
                            permissao: 'b',
                            response: response.Clientes[0].idCliente,
                            message: "Vc sera redirecionado para a area de confirmação do codigo",
                            token: token
                        })
                    }
                    }else if(response.Clientes[0].status === 'key'){
                        return res.status(200).send({
                            permissao: 'c',
                            response: response.Clientes[0].idCliente,
                            message: "Vc sera redirecionado para colocar uma nova senha",
                            token: token
                        })
                    } 
                    else{                 //**se o cliente ja estiver o status ativado e podera entrar ao app 
                        return res.status(200).send({                   //cliente logado
                            permissao: 'a',
                            response: response.Clientes[0].idCliente,
                            message: "cliente liberado para acessar o app",
                            token: token
                        })           
                    }
                }
                return res.status(500).send({ error: 'falha na autenticação '})
            })    

            conn.release();
            } //termina aquii
        )     
    })
}