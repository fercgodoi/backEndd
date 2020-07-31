const mysql = require('../../mysql').pool;



///////////////////////////////////////////////////////////////  CADASTRO PRONTUARIO /////////////////////////////////////////////////////////////////////////
exports.CadProntuario = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.json({ error:'error sql'})};

        conn.query('select * from pet where rgPet = ?', [req.body.rgPet],
        (error, resultado, field)=> {
            conn.release();
            if(error){return res.json({ error:"error sql"})}
            if(resultado.length == 0){
                return res.json({ message: "Pet nao encontrado"})
            }
            mysql.getConnection((error, conn) => {
                conn.query('insert into consulta(idPrest,idFunc,idPet,idVacina,idMed,idExames,dataConst) values (?,?,?,?,?,?,?)',
                [req.funcionario.idPrest,req.funcionario.idFunc,resultado[0].idPet,req.body.idVacina,req.body.idMed,req.body.idExames,req.body.dataConst],
                    (error, resultados, field)=> {
                        conn.release();
                    if(error){ return res.json({ error:"error sql"})};
                    return res.json({message : "Cadastrado"});
                })
            })

        })
    })
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////  BUSCAR PRONTUARIO  //////////////////////////////////////////////////////////////////////////
exports.buscarPront = (req, res, next) => {       //rota passando parametro

    mysql.getConnection((error, conn) => {
        if(error){ return res.json({ error:'error sql'})};

        conn.query('select cliente.nomeCli as nomeCli,pet.fotoPet, pet.nomePet as nomePet, pet.rgPet as rgPet, consulta.idConst as idConst from consulta inner join pet on consulta.idPet =pet.idPet inner join cliente on pet.idCli  = cliente.idCli where consulta.idPrest= ?',[req.funcionario.idPrest],
        (error, resultado, fields) => {
            conn.release();

            if(error){ return res.json({ error:'error sql'})};
            // if(resultado.length == 0){
            //     return res.json({ message: "Prontuario nao encontrado"})
            // }
            const response = {
                Prontuario: resultado.map(prod => {
                    return  {
                        nomeCli: prod.nomeCli ,
                        nomePet: prod.nomePet ,
                        rgPet: prod.rgPet ,
                        idConst: prod.idConst,
                        // fotoPet : prod.fotoPet,
                        fotoPet: prod.fotoPet,
                        // 'https://api-agenda-teste.herokuapp.com/'+ 
                    };
                })
            };
            return res.json({ response });              
        })
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////  FILTRO PRONTUARIO  //////////////////////////////////////////////////////////////////////////
exports.FiltroPront = (req, res, next) => {       //rota passando parametro

    mysql.getConnection((error, conn) => {
        if(error){ return res.json({ error:'error sql'})};

        conn.query('select cliente.nomeCli as nomeCli, pet.nomePet as nomePet, pet.rgPet as rgPet, consulta.idConst as idConst from consulta inner join pet on consulta.idPet =pet.idPet inner join cliente on pet.idCli  = cliente.idCli where pet.rgPet = ?',[req.body.rgPet],
            (error, resultado, fields) => {
                conn.release();
                if(error){ return res.json({ error:'error sql'})};
                if(resultado.length == 0){
                    return res.json({ message: "Prontuario nao encontrado"})
                }

                const response = {
                    Prontuario: resultado.map(prod => {
                        return  {
                            nomeCli: prod.nomeCli ,
                            nomePet: prod.nomePet ,
                            rgPet: prod.rgPet ,
                            idConst: prod.idConst 
                        };
                    })
                };
                return res.json({ response });              
            }
        )
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////  VISUALIZAR PRONTUARIO  /////////////////////////////////////////////////////////////////////
exports.BuscarInfo = (req, res, next) => {       //rota passando parametro

    mysql.getConnection((error, conn) => {
        if(error){ return res.json({ error:'error sql'})};

        conn.query('select prestadores.NomeFantsPrest as nomePrest, funcionario.nomeFunc as nomeFunc, consulta.dataConst as dataConst,pet.rgPet as rgPet, pet.nomePet as nomePet,consulta.idVacina as idVacina,consulta.idMed as idMed,consulta.idExames as idExames from consulta inner join pet on consulta.idPet = pet.idPet inner join prestadores on prestadores.idPrest = consulta.idPrest inner join funcionario on funcionario.idFunc = consulta.idFunc where consulta.idConst=?',[req.body.idConst],
            (error, resultado, fields) => {
                conn.release();

                if(error){ return res.json({ error:'error sql'})};
                if(resultado.length == 0){
                    return res.json({ message: "Prontuario nao encontrado"})
                }

                const response = {
                    Prontuario: resultado.map(prod => {
                        return  {
                            nomePrest: prod.nomePrest ,
                            nomeFunc: prod.nomeFunc ,
                            dataConst: prod.dataConst ,
                            rgPet: prod.rgPet,
                            nomePet: prod.nomePet ,
                            idVacina: prod.idVacina ,
                            idMed: prod.idMed,
                            idExames: prod.idExames,
                        };
                    })
                };  
                return res.json({ response });  
            }
        )
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////// PRONTUARIO PETS  /////////////////////////////////////////////////////////////////////
exports.BuscarInfoPet = (req, res, next) => {       //rota passando parametro

    mysql.getConnection((error, conn) => {
        if(error){ return res.json({ error:'error sql'})};

        conn.query('select * from consulta where idPet=?',[req.body.idPet],
            (error, resultado, fields) => {
                conn.release();

            if(error){ return res.json({ error:'error sql'})};
            if(resultado.length == 0 || resultado.length == [] ){return res.json({ message: "nao tem"})}
            return res.json({ message: "tem"})
        })
    })
}