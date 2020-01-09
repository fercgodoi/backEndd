const express = require('express');
const router = express.Router();
//const mysql = require('mysql');

const mysql = require('../../mysql').pool;

router.post('/', (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from cliente where nomeCli = ? && senhaCli = ?;',[req.body.nome, req.body.senha],
            (error, resultado, fields) => {
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: error})        
                }

                if(resultado.length === 0){                 //tratamento de erro de autenticação
                    return res.status(401).send({response: "Usuario inexistente"})
                }

                return res.status(200).send({response: resultado})
            }
        )
    })
});

module.exports = router; 