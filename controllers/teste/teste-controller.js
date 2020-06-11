const mysql = require('../../mysql').pool;

///////////////////////////////////////////////////////////////  INSERIR VACINA  //////////////////////////////////////////////////////////////////////////
exports.SelectAgendamento = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){return res.json({ error: error})}          
        conn.query('insert into agendamento values(0,"2020-06-01","17:59:00","tosa","sadfgh","sadfgh","Negado","","7","1","5")',
            (error, resultado, field)=> {
                if(error){return res.json({ error: error})} 
                return res.json({resultado})
        })
    })
}