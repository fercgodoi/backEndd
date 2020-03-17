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

//-------------------------------------BLOCO CADASTRO------------------------------------------//

function getRandomInt() { return Math.floor(Math.random() * (999999 - 100000)) + 100000; }

exports.cadastroCliente = (req, res, next) => {       //rota passando parametro
     mysql.getConnection((error, conn) => {
        if (error) { //tratamento de erro da conexao
            return res.status(500).send({ error: error });
        }
        conn.query('select * from cliente where emailCli = ?', [req.body.email], (error, resultado, fields) => {
             if (error) { //tratamento de erro da query
                 return res.status(500).send({ error: error });
             }
             if (resultado.length > 0) {
                 return res.status(409).send("Usuario ja existente"); //nao aceita, usuario ja existente
             }
             let passRandom = getRandomInt();
             let timeCodCli = Date.now();
             //return res.status(200).send("1")    //aceito
             bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                 if (errBcrypt) {
                     return res.status(500).send({ error: errBcrypt });
                 }
                 conn.query('insert into cliente(nomeCli, emailCli, senhaCli, codigoCli, timeCodCli) values (?, ?, ?, ?, ?)', [req.body.nome, req.body.email, hash, passRandom, timeCodCli],
                  (error, resultado, field) => {
                     conn.release(); //IMPORTANTE release: fechar a conexao com a nossa query 
                     if (error) { //tratamento de erro da query
                         return res.status(500).send({ error: error });
                     }
                     //return res.status(200).send({response: resultado})
                     transporter.sendMail({
                         from: "  One <oneforasteiro@gmail.com>",
                         to: req.body.email,
                         subject: "Recuperar senha",
                         text: `Faça login novamente no app com esta senha: ${passRandom}`
                         //html: "caso precise vc pode passar um html, fica mais bonito e creio que podemos passar informaçoes nesse html sobre redirecionar p outra api"
                     }).then(message => {
                         res.status(202).send({
                             mensagem: message,
                             message: 'Bem vindo ao app, enviamos um codigo ao seu email',
                             resultado: resultado
                         });
                     }).catch(err => {
                         res.status(404).send({ mensagem: "nao deu", error: err, email: req.body.email });
                     });
                     //COLOCAR CODIGO P ENVIAR EMAIL                 <========================FEITOOOOOOOO
                 });
             });
         });
    })
}