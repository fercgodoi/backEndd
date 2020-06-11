const mysql = require('../../mysql').pool;              //para conectar ao banco
const multer = require('multer');                       //para salvar imagens
const nodemailer = require("nodemailer");               //para enviar emails
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//-----------------------BLOCO DE UPLOAD IMAGEM----------//

const storage = multer.diskStorage({
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
});

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

//-------------------------------ATUALIZAÇÃO DOS DADOS--------------------------------------------------//

exports.atualizarCliente = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query(`update cliente set cpfCli = ?, telefoneCli = ?, cepCli = ?, estadoCli = ?, cidadeCli = ?, ruaCli = ?, numeroCli = ?, complementoCli = ?, ${"status_cli = 'ok'"} where idCli = ?`,
                 [req.body.cpfCli, req.body.telefoneCli, req.body.cepCli, req.body.estadoCli, req.body.cidadeCli, req.body.ruaCli, req.body.numeroCli, req.body.complementoCli, req.body.idCli],
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
}


//--------------------------------LOGIN----------------------------------------------------------//



//---------------------------AUTENTICAÇAO DO CODIGO-------------------------------//

exports.authCod = (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from cliente where idCli = ? && codigoCli = ?;',[ req.cliente.idCliente , req.body.codigo],
            (error, result, fields) => {
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: error})        
                }

                if(result.length < 1){
                    return res.status(500).send({ message: 'Codigo incorreto' })
                } else{
                    conn.query('update cliente set status_cli = ? where idCli = ? ;',['ok', req.cliente.idCliente],
                        (error, resultado, fields) => {
                            //conn.release();
                            if(error){                                  //tratamento de erro da query
                                return res.status(500).send({ error: error})        
                            }
                            return res.status(200).send({response: "Seu perfil esta verificado, aproveite o app"}) 
                        }
                    )
                }
                
            }
        )    
         conn.release();
    })
}

//------------------RECUPERAR SENHA-----------------------//
exports.recSenha = (req, res, next) => {

    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from cliente where emailCli = ?', [req.body.email],
            (error, result, field)=> {
                if(error){return res.status(500).send({ msg:'error sql', error: error})}
                if(result.length == 0){
                    return res.status(404).send({ msg: "Usuario nao encontrado"})
                }

                let passRandom = String(getRandomInt()) ;           //colocando formato br//
                console.log(passRandom)

                bcrypt.hash(passRandom, 10, (err, hash) =>{
                    if(err){ return res.status(500).send({ error: "erro no bcript", errou: err }) } 
                
                        conn.query(`update cliente set senhaCli = ?, status_cli = ? where emailCli = ? `, [hash, 'key', req.body.email],
                            (error, resultado, field)=> {     
                                //conn.release();                
                                if(error){                
                                    return res.status(500).send({ error: error})         
                                }
                                //return res.status(202).send({ mensagem: resultado})
                                    //colocar aquii
                                transporter.sendMail({
                                    from: "  One <oneforasteiro@gmail.com>",
                                    to: req.body.email,               
                                    subject: "Recuperar senha",
                                    text: `Faça login novamente no app com esta senha: ${passRandom}`
                                    //html: "caso precise vc pode passar um html, fica mais bonito e creio que podemos passar informaçoes nesse html sobre redirecionar p outra api"
                                }).then(message => {
                                    res.status(202).send({msg:'Enviamos uma nova senha, verifique seu email' , mensagem: message})
                                }).catch(err =>{
                                    res.status(404).send({ msg: "nao deu", error: err})
                                }) 
                                
                        })
                })
                conn.release();
            })
    }) 
}

//----------------------ALTERAR SENHA---------------------------------//

exports.AlterarSenha = (req, res, next) => {       
    mysql.getConnection((error, conn) => {
        if(error){                                  
            return res.status(500).send({ error: error})        
        } 
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) =>{
                    if(errBcrypt){ return res.status(500).send({ error: errBcrypt }) }
                    conn.query('update cliente set senhaCli = ?, status_cli = ? where idCli = ? ',[hash, 'ok', req.cliente.idCliente],
                        (error, resultado, field)=> {                  
                            conn.release();                           
                            if(error){                                  
                                return res.status(500).send({ message:"Error server", error: error})        
                            }

                            return res.status(200).send({message:'Senha alterada com sucesso' ,response: resultado})

                        }
                    )
                })     
            }
        )
}