const express = require('express');
const router = express.Router();
//const mysql = require('mysql');

const mysql = require('../../mysql').pool;

router.get('/listarAll', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from prestadores',
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
        conn.query('insert into prestadores(nomePrest, cnpjPrest, telefonePrest, celularPrest, estadoPrest, cidadePrest, cepPrest, ruaPrest, numeroPrest, bairroPrest, complementoPrest, emergenciaPrest)  values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                 [req.body.nomePrest, req.body.cnpjPrest, req.body.telefonePrest, req.body.celularPrest, req.body.estadoPrest, req.body.cidadePrest, req.body.cepPrest, req.body.ruaPrest, req.body.numeroPrest, req.body.bairroPrest, req.body.complementoPrest, req.body.emergenciaPrest],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(201).send({                          
                        mensagem: 'Prestador inserido com sucesso',
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
        conn.query('update prestadores set nomePrest = ?, cnpjPrest = ?, telefonePrest = ?, celularPrest = ?, estadoPrest = ?, cidadePrest = ?, cepPrest = ?, ruaPrest = ?, numeroPrest = ?, bairroPrest = ?, complementoPrest = ?, emergenciaPrest = ? where idPrest = ?',
        [req.body.nomePrest, req.body.cnpjPrest, req.body.telefonePrest, req.body.celularPrest, req.body.estadoPrest, req.body.cidadePrest, req.body.cepPrest, req.body.ruaPrest, req.body.numeroPrest, req.body.bairroPrest, req.body.complementoPrest, req.body.emergenciaPrest, req.body.idPrest],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(201).send({                          
                        mensagem: 'Prestador atualizada com sucesso',
                        id_Cliente: resultado.insertId                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
});

router.get('/buscar/:pres', (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from prestadores where nomePrest = ?;',[req.params.pres],
            (error, resultado, fields) => {
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: error})        
                }
                return res.status(200).send({response: resultado})
            }
        )
    })
});

router.delete('/deletar',(req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query(`delete from prestadores where idPrest = ? `,[req.body.idPrest],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(202).send({                          
                        mensagem: 'Prestador deletado com sucesso',
                        id_Cliente: resultado.insertId                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
})





module.exports = router; 

