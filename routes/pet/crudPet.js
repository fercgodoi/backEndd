const express = require('express');
const router = express.Router();
//const mysql = require('mysql');

const mysql = require('../../mysql').pool;


router.get('/listarAll', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from pet',
            (error, resultado, fields) => {
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: error})        
                }
                return res.status(200).send({response: resultado})
            }
        )
    })

});

router.post('/inserirAll', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('insert into pet(nomePet, pesoPet, pelagemPet, especiePet, aniverPet, racaPet, sexoPet, corPet, dataCastPet, microshipPet, pedigreePet, idCli) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                 [req.body.nomePet, req.body.pesoPet, req.body.pelagemPet, req.body.especiePet, req.body.aniverPet, req.body.racaPet, req.body.sexoPet, req.body.corPet, req.body.dataCastPet, req.body.microshipPet, req.body.pedigreePet, req.body.idCli ],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(201).send({                          
                        mensagem: 'Animal inserido com sucesso',
                        id_Cliente: resultado.insertId                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
});

router.get('/buscar/:pet', (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from pet where nomePet = ?;',[req.params.pet],
            (error, resultado, fields) => {
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: error})        
                }
                return res.status(200).send({response: resultado})
            }
        )
    })
});

router.post('/atualizar', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('update pet set nomePet = ?, pesoPet = ?, pelagemPet = ?, especiePet = ?, aniverPet = ?, racaPet = ?, sexoPet = ?, corPet = ?, dataCastPet = ?, microshipPet = ?, pedigreePet = ?, idCli= ? where idPet = ?',
                 [req.body.nomePet, req.body.pesoPet, req.body.pelagemPet, req.body.especiePet, req.body.aniverPet, req.body.racaPet, req.body.sexoPet, req.body.corPet, req.body.dataCastPet, req.body.microshipPet, req.body.pedigreePet, req.body.idCli, req.body.idPet],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(201).send({                          
                        mensagem: 'Animal atualizado com sucesso',
                        id_Cliente: resultado.insertId                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
});

router.delete('/deletar',(req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query(`delete from pet where idPet = ? `,[req.body.idPet],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(202).send({                          
                        mensagem: 'Animal deletado com sucesso',
                        id_Cliente: resultado.insertId                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
})

module.exports = router; 