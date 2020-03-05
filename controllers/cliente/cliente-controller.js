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
        pass: "largatixa"                                       
    }
});

//-------------------------------------BLOCO CADASTRO------------------------------------------//

function getRandomInt() { return Math.floor(Math.random() * (999999 - 100000)) + 100000; }

exports.cadastroCliente = (req, res, next) => {       //rota passando parametro
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
                            conn.release();                            //IMPORTANTE release: fechar a conexao com a nossa query 
                            if(error){                                  //tratamento de erro da query
                                return res.status(500).send({ error: error})        
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
                                    message:'Bem vindo ao app, enviamos um codigo ao seu email',
                                    resultado: resultado
                                })
                            }).catch(err =>{
                                res.status(404).send({ mensagem: "nao deu", error: err, email: req.body.email})
                            }) 
                            //COLOCAR CODIGO P ENVIAR EMAIL                 <========================FEITOOOOOOOO

                        }
                    )
                })     
            }
        )
    })
}


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
                    
                    if(resultCript){
                        
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
                                    return res.status(200).send({ message: 'Seu codigo expirou, enviamos um novo codigo para seu email'})
                                    //enviar o codigo pelo email//
                                    /* transporter.sendMail({
                                        from: "  One <oneforasteiro@gmail.com>",
                                        to: response.Clientes[0].emailCli,               
                                        subject: "Codigo de verificação",
                                        text: `Faça login novamente no app com esta senha: ${passRandom}`
                                        //html: "caso precise vc pode passar um html, fica mais bonito e creio que podemos passar informaçoes nesse html sobre redirecionar p outra api"
                                    }).then(message => {
                                        res.status(202).send({ mensagem: message})
                                    }).catch(err =>{
                                        res.status(404).send({ mensagem: "nao deu"})
                                    }) */

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
                
                return res.status(500).send({ error: 'falha na autenticação'})
            })    

            conn.release();
            } //termina aquii
        )     
    })
}


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
                            conn.release();
                            if(error){                                  //tratamento de erro da query
                                return res.status(500).send({ error: error})        
                            }
                            return res.status(200).send({response: "Seu perfil esta verificado, aproveite o app"}) 
                        }
                    )
                }
                conn.release();
            }
        )     
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

                let passRandom = String(getRandomInt()) ;
                console.log(passRandom)

                bcrypt.hash(passRandom, 10, (err, hash) =>{
                    if(err){ return res.status(500).send({ error: "erro no bcript", errou: err }) } 
                
                        conn.query(`update cliente set senhaCli = ?, status_cli = ? where emailCli = ? `, [hash, 'key', req.body.email],
                            (error, resultado, field)=> {     
                                conn.release();                
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