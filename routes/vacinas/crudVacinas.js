const express = require('express');
const router = express.Router();
//const mysql = require('mysql');

const mysql = require('../../mysql').pool;

router.get('/listarAll', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from vacina',
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
        conn.query('insert into vacina(dataApliVacina, dataProxVacina, nomeVacina, qntDoseVacina, valorVacina, statusVacina, idPet, idPrest, idFunc)                                    values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                 [req.body.dataApliVacina, req.body.dataProxVacina, req.body.nomeVacina, req.body.qntDoseVacina, req.body.valorVacina, req.body.statusVacina, req.body.idPet, req.body.idPrest, req.body.idFunc],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(201).send({                          
                        mensagem: 'Vacina inserida com sucesso',
                        id_Cliente: resultado.insertId                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
});


router.post('/atualizarAll', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('update vacina set dataApliVacina = ?, dataProxVacina = ?, nomeVacina = ?, qntDoseVacina = ?, valorVacina = ?, statusVacina = ?, idPet = ?, idPrest = ?, idFunc = ? where idVacina = ?',
                 [req.body.dataApliVacina, req.body.dataProxVacina, req.body.nomeVacina, req.body.qntDoseVacina, req.body.valorVacina, req.body.statusVacina, req.body.idPet, req.body.idPrest, req.body.idFunc, req.body.idVacina],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(201).send({                          
                        mensagem: 'Vacina atualizada com sucesso',
                        id_Cliente: resultado.insertId                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
});

router.delete('/deletarAll',(req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query(`delete from vacina where idVacina = ? `,[req.body.idCli],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(202).send({                          
                        mensagem: 'Cliente deletado com sucesso',
                        id_Cliente: resultado.insertId                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
});

router.get('/buscar/:cliente', (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from vacina where nomeVacina = ?;',[req.params.cliente],
            (error, resultado, fields) => {
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: error})        
                }
                return res.status(200).send({response: resultado})
            }
        )
    })
});


module.exports = router; 