const mysql = require('../../mysql').pool;


exports.inserirVacina = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('insert into vacina(dataApliVacina, dataProxVacina, nomeVacina, qntDoseVacina, valorVacina, statusVacina, idPet, idPrest, idFunc)            values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
};


exports.atualizarVacina = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('update vacina set dataApliVacina = ?, dataProxVacina = ?, nomeVacina = ?, qntDoseVacina = ?, valorVacina = ?, statusVacina = ?, confirmaVacina = ?, idPet = ?, idPrest = ?, idFunc = ? where idVacina = ?',
                 [req.body.dataApliVacina, req.body.dataProxVacina, req.body.nomeVacina, req.body.qntDoseVacina, req.body.valorVacina, req.body.statusVacina, req.body.confirmaVacina, req.body.idPet, req.body.idPrest, req.body.idFunc, req.body.idVacina],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(201).send({                          
                        mensagem: 'Vacina atualizada com sucesso',
                        resp: "ok"                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
};

exports.deletarVacina =(req, res, next) => {
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
                        resp: "ok"                       //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
};

exports.buscarVacina = (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from vacina where idPet = ?;',[req.body.idPet],
            (error, resultado, fields) => {
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: error})        
                }

                const response = {
                    Vacina: resultado.map(vac => {
                        return {
                            idVacina: vac.idVacina,
                            dataApliVacina: vac.dataApliVacina,
                            dataProxVacina: vac.dataProxVacina,
                            nomeVacina: vac.nomeVacina,
                            qntDoseVacina: vac.qntDoseVacina,
                            valorVacina: vac.valorVacina,
                            statusVacina: vac.statusVacina,
                            confirmaVacina: vac.confirmaVacina,
                            idPet: vac.idPet,
                            idPrest: vac.idPrest,
                            idFunc: vac.idFunc
                        };
                    })
                };
                return res.status(200).send({ response });

             // return res.status(200).send({response: resultado})
            }
        )
    })
};