const express = require('express');
const router = express.Router();
//const mysql = require('mysql');

const mysql = require('../../mysql').pool;

router.post('/', (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }

        conn.query('select * from cliente where emailCli = ? && senhaCli = ?;',[req.body.email, req.body.senha],
            (error, result, fields) => {
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: 'Usuario não encontrado'})        
                }

                if(result.length === 0){                 //tratamento de erro de autenticação
                    return res.status(401).send({response: "Usuario inexistente"})
                }

                const response = {                          //tratando o retorno
                    Clientes: result.map(cli => {
                        return{
                            idCliente: cli.idCli,
                            Nome: cli.nomeCli,
                            status: cli.status_cli
                        }
                    })
                }

                if(response.Clientes[0].status === 'Pendente'){                         //tratamento p ver se o cliente fez as duas etapas do cadastro
                    return res.status(100).send({response: 'Pendente'})
                } else{


                return res.status(200).send({response: response.Clientes[0]})           //retorna apenas o primeiro cliente encontrado
                }
                mysql.getConnection.end();                                      //fechando conexao apos a query  

            }
        )     
    })
});

module.exports = router; 