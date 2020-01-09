const express = require('express');
const router = express.Router();
//const mysql = require('mysql');

const mysql = require('../../mysql').pool;

router.post('/passo1', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                              //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }

        conn.query('insert into cliente(nomeCli, emailCli, senhaCli) values (?, ?, ?)',
                 [req.body.nomeCli, req.body.emailCli, req.body.senhaCli],
                 (error, resultado, field)=> {                  //tratando o retorno
                     conn.release();                            //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(201).send({                          
                        mensagem: 'Cliente inserido com sucesso',
                        id_Cliente: resultado                    //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
});


router.post('/passo2', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('update cliente set cpfCli = ?, telefoneCli = ?, cepCli = ?, estadoCli = ?, cidadeCli = ?, ruaCli = ?, numeroCli = ?, complementoCli = ? where idCli = ?',
                 [req.body.cpfCli, req.body.telefoneCli, req.body.cepCli, req.body.estadoCli, req.body.cidadeCli, req.body.ruaCli, req.body.numeroCli, req.body.complementoCli, req.body.idCli],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(201).send({                          
                        mensagem: 'Cliente inserido com sucesso',
                        id_Cliente: resultado.insertId                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
});

module.exports = router;