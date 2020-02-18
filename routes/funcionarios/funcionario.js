const express = require('express');
const router = express.Router();
//const mysql = require('mysql');

const mysql = require('../../mysql').pool;

router.get('/listarAll', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from funcionario',
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
        conn.query('insert into funcionario(nomeFunc, cpfFunc, emailFunc, telefoneFunc, cepFunc, estadoFunc, cidadeFunc, ruaFunc, bairroFunc, numeroFunc, complementoFunc, senhaFunc, recepcionista, veterinario, Administrador, financeiro, idPrest)  values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                 [req.body.nomeFunc, req.body.cpfFunc, req.body.emailFunc, req.body.telefoneFunc, req.body.cepFunc, req.body.estadoFunc, req.body.cidadeFunc, req.body.ruaFunc, req.body.bairroFunc, req.body.numeroFunc, req.body.complementoFunc, req.body.senhaFunc, req.body.recepcionista, req.body.veterinario,
                    req.body.Administrador, req.body.financeiro,  req.body.idPrest],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }

                    res.status(201).send({                          
                        mensagem: 'funcionario inserido com sucesso',
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
        conn.query('update funcionario set nomeFunc = ?, cpfFunc = ?, emailFunc = ?, telefoneFunc = ?, cepFunc = ?, estadoFunc = ?, cidadeFunc = ?, ruaFunc = ?, bairroFunc = ?, numeroFunc = ?, complementoFunc = ?, senhaFunc = ?, recepcionista = ?, veterinario = ?, Administrador = ?, financeiro = ?,  idPrest = ? where idFunc = ?',
        [req.body.nomeFunc, req.body.cpfFunc, req.body.emailFunc, req.body.telefoneFunc, req.body.cepFunc, req.body.estadoFunc, req.body.cidadeFunc, req.body.ruaFunc, req.body.bairroFunc, req.body.numeroFunc, req.body.complementoFunc, req.body.senhaFunc, req.body.recepcionista, req.body.veterinario,
            req.body.Administrador, req.body.financeiro, req.body.idPrest, req.body.idFunc],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(201).send({                          
                        mensagem: 'Funcionario atualizada com sucesso',
                        id_Cliente: resultado.insertId                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
});

router.get('/buscar/:func', (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from funcionario where nomeFunc = ?;',[req.params.func],
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
        conn.query(`delete from funcionario where idFunc = ? `,[req.body.idFunc],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(202).send({                          
                        mensagem: 'Funcionario deletado com sucesso',
                        id_Cliente: resultado.insertId                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
})



module.exports = router; 