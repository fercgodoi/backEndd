const mysql = require('../../mysql').pool;



 exports.listarPet = (req, res, next) => {

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

};

exports.inserirPet = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('insert into pet(nomePet, pesoPet, pelagemPet, especiePet, aniverPet, racaPet, sexoPet, corPet, dataCastPet, microshipPet, pedigreePet, idCli) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                 [req.body.nomePet, req.body.pesoPet, req.body.pelagemPet, req.body.especiePet, req.body.aniverPet, req.body.racaPet, req.body.sexoPet, req.body.corPet, req.body.dataCastPet, req.body.microshipPet, req.body.pedigreePet, req.cliente.idCliente],
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
};

exports.buscarPets = (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
       conn.query('select * from pet where idCli = ?;', [req.cliente.idCliente], //select * from pet where nomePet = ?;
            (error, resultado, fields) => {
                conn.release();
                if (error) { //tratamento de erro da query
                    return res.status(500).send({ error: error });
                }
                const response = {
                    Clientes: resultado.map(pet => {
                        return  {
                            /*idPet: pet.idPet,
                            nomePet: pet.nomePet,
                            racaPet: pet.racaPet*/
                            idPet: pet.idPet,
                            nomePet: pet.nomePet,
                            aniverPet: pet.aniverPet,
                            pesoPet: pet.pesoPet,
                            especiePet: pet.especiePet,
                            racaPet: pet.racaPet,
                            corPet: pet.corPet,
                            sexoPet: pet.sexoPet,
                            pelagemPet: pet.pelagemPet,
                            dataCastPet: pet.dataCastPet,
                            microshipPet: pet.microshipPet,
                            pedigreePet: pet.pedigreePet
                        };
                    })
                };
                return res.status(200).send({ response });
            })
    })
};

exports.buscaPetId = (req, res, next) => {       //rota passando parametro
   mysql.getConnection((error, conn) => {
        if (error) { //tratamento de erro da conexao
            return res.status(500).send({ error: error });
        }
        conn.query('select * from pet where idPet = ?;', [req.params.idPet], //select * from pet where nomePet = ?;
            ( error, resultado, fields) => {
                conn.release();
                if (error) { //tratamento de erro da query
                    return res.status(500).send({ error: error });
                }
                const response = {
                    Clientes: resultado.map(pet => {
                        return {
                            idPet: pet.idPet,
                            nomePet: pet.nomePet,
                            aniverPet: pet.aniverPet,
                            pesoPet: pet.pesoPet,
                            especiePet: pet.especiePet,
                            racaPet: pet.racaPet,
                            corPet: pet.corPet,
                            sexoPet: pet.sexoPet,
                            pelagemPet: pet.pelagemPet,
                            dataCastPet: pet.dataCastPet,
                            microshipPet: pet.microshipPet,
                            pedigreePet: pet.pedigreePet
                        };
                    })
                };
                return res.status(200).send({ response });
            });
    })
}; 

exports.atualizarPet = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('update pet set nomePet = ?, pesoPet = ?, pelagemPet = ?, especiePet = ?, aniverPet = ?, racaPet = ?, sexoPet = ?, corPet = ?, dataCastPet = ?, microshipPet = ?, pedigreePet = ? where idPet = ?',
                 [req.body.nomePet, req.body.pesoPet, req.body.pelagemPet, req.body.especiePet, req.body.aniverPet, req.body.racaPet, req.body.sexoPet, req.body.corPet, req.body.dataCastPet, req.body.microshipPet, req.body.pedigreePet, req.body.idPet],     //req.cliente.idCliente
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(201).send({                          
                        mensagem: 'Pet atualizado com sucesso',
                        id_Cliente: resultado.insertId                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
};

exports.deletePet = (req, res, next) => {
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
};
