const mysql = require('../../mysql').pool;

///////////////////////////////////////////////////////////////  INSERIR VACINA  //////////////////////////////////////////////////////////////////////////
exports.SelectAgendamento = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){return res.json({ error: error})}          
        conn.query('select * from funcionario where idFunc=3',
            (error, resultado, field)=> {
                if(error){return res.json({ error: error})} 
                return res.json({resultado})
        })
    })
}