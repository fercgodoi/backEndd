const mysql = require('../../mysql').pool;

///////////////////////////////////////////////////////////////  CADASTRO MEDICAMENTOS /////////////////////////////////////////////////////////////////////////
exports.CadastroMed = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){return res.json({ error: 'erro sql'})} 

        conn.query('select * from prestadores where idPrest=?', [req.funcionario.idPrest],
        (error, result, field)=> {
            conn.release();
            if(error){return res.json({ error: 'erro sql' })} 
            if(result.length == 0){
                return res.json({ message: "Vet nao encontrado"})
            }

            mysql.getConnection((error, conn) => {
                conn.query('select * from pet where rgPet = ?', [req.body.rgPet],
                (error, resultado, field)=> {
                    conn.release();
                    if(error){return res.json({ error:'erro sql'})}
                    if(resultado.length == 0){
                        return res.json({ message: "Pet nao encontrado"})
                    }
                    mysql.getConnection((error, conn) => {
                        conn.query('insert into medicamento(idPet,idPrest,statusMed,doseMed,rotinaMed,dataIniMed,dataFinMed,nomeMed,nomeEstbMed,emailEstbMed,loteMed,observacaoMed,confirmMed) values (?,?,?,?,?,?,?,?,?,?,?,?,?)',
                        [resultado[0].idPet,req.funcionario.idPrest, req.body.statusMed, req.body.doseMed, req.body.rotinaMed, req.body.dataIniMed,req.body.dataFinMed, req.body.nomeMed,result[0].NomeFantsPrest, result[0].EmailPrest,  req.body.loteMed, req.body.observacaoMed,"Confirmado"],
                            (error, resultados, field)=> {
                            conn.release();
                            if(error){return res.json({ error: 'erro sql'})} 
                            return res.json({message : "Cadastrado", id :resultados.insertId});
                        })
                    })

                }) 
            })  
        }) 
    })
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////  CADASTRO MEDICAMENTOS /////////////////////////////////////////////////////////////////////////
exports.CadastroMedInserir = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){return res.json({ error: 'erro sql'})} 

        conn.query('select * from prestadores where idPrest=?', [req.funcionario.idPrest],
        (error, result, field)=> {
            conn.release();
            if(error){return res.json({ error: 'erro sql' })} 
            if(result.length == 0){
                return res.json({ message: "Vet nao encontrado"})
            }

            mysql.getConnection((error, conn) => {
                conn.query('select * from pet where rgPet = ?', [req.body.rgPet],
                (error, resultado, field)=> {
                    conn.release();
                    if(error){return res.json({ error:'erro sql'})}
                    if(resultado.length == 0){
                        return res.json({ message: "Pet nao encontrado"})
                    }
                    mysql.getConnection((error, conn) => {
                        conn.query('insert into medicamento(idPet,idPrest,statusMed,doseMed,rotinaMed,dataIniMed,dataFinMed,nomeMed,nomeEstbMed,emailEstbMed,loteMed,observacaoMed,confirmMed) values (?,?,?,?,?,?,?,?,?,?,?,?,?)',
                        [resultado[0].idPet,req.funcionario.idPrest, req.body.statusMed, req.body.doseMed, req.body.rotinaMed, req.body.dataIniMed,req.body.dataFinMed, req.body.nomeMed,result[0].NomeFantsPrest, result[0].EmailPrest,  req.body.loteMed, req.body.observacaoMed,"Confirmado"],
                            (error, resultados, field)=> {
                            conn.release();
                            if(error){return res.json({ error: 'erro sql'})} 
                            // return res.json({message : "Cadastrado", id :resultados.insertId});

                            var id = resultados.insertId;

                            mysql.getConnection((error, conn) => {
                                conn.query('insert into consulta(idPrest,idFunc,idPet,idVacina,idMed,idExames,dataConst) values (?,?,?,?,?,?,?)',
                                [req.funcionario.idPrest,req.funcionario.idFunc,resultado[0].idPet,"false",id,"false",req.body.dataIniMed],
                                    (error, resultados, field)=> {
                                        conn.release();
                                    if(error){ return res.json({ error:"error sql"})};
                                    return res.json({message : "Cadastrado", id :id});  
                                })
                            })
                        })
                    })

                }) 
            })  
        }) 
    })
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////  BUSCAR MEDICAMENTO  //////////////////////////////////////////////////////////////////////////
exports.buscarMed = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'erro sql'})} 
        conn.query('select cliente.nomeCli as nomeCli,pet.fotoPet, pet.nomePet as nomePet, pet.rgPet as rgPet, medicamento.idMed as idMed, medicamento.NomeMed as NomeMed, medicamento.idPet as idPet from medicamento inner join pet on medicamento.idPet =pet.idPet  inner join cliente on pet.idCli  = cliente.idCli where medicamento.idPrest = ? and medicamento.statusMed = "Vigente"',[req.funcionario.idPrest],
        (error, resultado, fields) => {
            conn.release();  
            if(error){return res.json({ error: 'erro sql'})} 
            if(resultado.length == 0){
                return res.json({ message: "Medicamento nao encontrado"})
            }

            const response = {
                Medicamento: resultado.map(med => {
                    return  {
                        nomeCli: med.nomeCli ,
                        nomePet: med.nomePet ,
                        rgPet: med.rgPet ,
                        idMed: med.idMed ,
                        NomeMed: med.NomeMed ,
                        idPet: med.idPet,
                        fotoPet: med.fotoPet,
                        // fotoPet: 'https://api-agenda-teste.herokuapp.com/' + med.fotoPet,
                    };
                })
            };            
            return res.json({ response });              
        })
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////  FILTRO MEDICAMENTO  //////////////////////////////////////////////////////////////////////////
exports.FiltroMed = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'erro sql'})} 

        conn.query('select cliente.nomeCli as nomeCli, pet.nomePet as nomePet, pet.rgPet as rgPet, medicamento.idMed as idMed, medicamento.NomeMed as NomeMed, medicamento.idPet as idPet from medicamento inner join pet on medicamento.idPet =pet.idPet  inner join cliente on pet.idCli  = cliente.idCli where pet.rgPet = ? and medicamento.statusMed = "Vigente"',[req.body.rgPet],
            (error, resultado, fields) => {
                conn.release();  
                if(error){return res.json({ error: 'erro sql'})} 
                if(resultado.length == 0){
                    return res.json({ message: "Medicamento nao encontrado"})
                }

                const response = {
                    Medicamento: resultado.map(med => {
                        return  {
                            nomeCli: med.nomeCli ,
                            nomePet: med.nomePet ,
                            rgPet: med.rgPet ,
                            idMed: med.idMed ,
                            NomeMed: med.NomeMed ,
                            idPet: med.idPet
                        };
                    })
                };
                return res.json({ response });              
            }
        )
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////  VISUALIZAR MEDICAMENTO  /////////////////////////////////////////////////////////////////////
exports.BuscarInfo = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'erro sql'})} 

        conn.query('select pet.nomePet as nomePet,pet.rgPet as rgPet, medicamento.nomeMed as nomeMed, medicamento.doseMed as doseMed, medicamento.loteMed as loteMed, medicamento.rotinaMed as rotinaMed, medicamento.observacaoMed as observacaoMed, medicamento.dataIniMed as dataIniMed, medicamento.dataFinMed as dataFinMed, medicamento.nomeEstbMed as nomeEstbMed, medicamento.emailEstbMed as emailEstbMed from medicamento inner join pet on medicamento.idPet = pet.idPet where  medicamento.idMed = ?',[req.body.idMed],
            (error, resultado, fields) => {
                conn.release();  
                if(error){return res.json({ error: 'erro sql'})} 
                if(resultado.length == 0){
                    return res.json({ message: "Medicamento nao encontrado"})
                }

                const response = {
                    Medicamento: resultado.map(med => {
                        return  {
                            nomePet: med.nomePet ,
                            rgPet: med.rgPet ,
                            nomeMed: med.nomeMed ,
                            doseMed: med.doseMed ,
                            loteMed: med.loteMed ,
                            rotinaMed: med.rotinaMed ,
                            observacaoMed: med.observacaoMed,
                            dataIniMed: med.dataIniMed ,
                            dataFinMed: med.dataFinMed,
                            nomeEstbMed: med.nomeEstbMed,
                            emailEstbMed: med.emailEstbMed
                        };
                    })
                };
                return res.json({ response });              
            }
        )
    })
}