const mysql = require('../../mysql').pool;

///////////////////////////////////////////////////////////////  INSERIR VACINA  //////////////////////////////////////////////////////////////////////////

exports.inserirVacina = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){return res.json({ error: "error sql"})}     

        conn.query('select * from pet where rgPet = ?', [req.body.rgPet],
            (error, resultado, field)=> {
                if(error){return res.json({ error: "error sql"})}    
                if(resultado.length == 0){
                    return res.json({ message: "Pet nao encontrado"})
                }

                conn.query('insert into vacina(dataApliVacina, dataProxVacina, nomeVacina, qntDoseVacina, loteVacina, valorVacina, nomeVetVacina, emailVetVacina, crmvVetVacina, idPet,idPrest,idFunc,observacaoVacina,statusVacina,confirmaVacina)  values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)',
                    [req.body.dataApliVacina, req.body.dataProxVacina, req.body.nomeVacina, req.body.qntDoseVacina, req.body.loteVacina, req.body.valorVacina, req.funcionario.NomeFunc, req.funcionario.EmailFunc, req.funcionario.CRMVFunc, resultado[0].idPet,req.funcionario.idPrest,req.funcionario.idFunc,req.body.observacaoVacina,"Vigente",1],
                    (error, resultados, field)=> {
                        conn.release();
                        if(error){return res.json({ error: "error sql"})}                            
                        return res.json({message : "Cadastrado", id :resultados.insertId});                        
                    }
                )
            }
        )
    }) 
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////  BUSCAR VACINAS  //////////////////////////////////////////////////////////////////////////
exports.buscarVacinas = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: "error sql"})}    
        conn.query('select cliente.nomeCli as nomeCli, pet.nomePet as nomePet, pet.rgPet as rgPet, vacina.idVacina as idVacina, vacina.nomeVacina as nomeVacina, vacina.idPet as idPet, vacina.dataApliVacina as dataApliVacina from vacina inner join pet on vacina.idPet =pet.idPet inner join cliente on pet.idCli  = cliente.idCli where vacina.idPrest = ? and vacina.statusVacina = "Vigente"',[req.funcionario.idPrest],
            (error, resultado, fields) => {
                conn.release();

                if(error){return res.json({ error: "error sql"})}    
                if(resultado.length == 0){
                    return res.json({ message: "Vacina nao encontrado"})
                }
                const response = {
                    Vacina: resultado.map(vac => {
                        return  {
                            idVacina: vac.idVacina ,
                            idPet: vac.idPet ,
                            nomeCli: vac.nomeCli ,
                            NomePet: vac.nomePet ,
                            rgPet: vac.rgPet ,
                            nomeVacina: vac.nomeVacina ,
                            dataApliVacina: vac.dataApliVacina
                        };
                    })
                };
                return res.json({ response });              
            }
        )
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////  FILTRO VACINA  //////////////////////////////////////////////////////////////////////////
exports.FiltroVac = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: "error sql"})}    

        conn.query('select cliente.nomeCli as nomeCli, pet.nomePet as nomePet, pet.rgPet as rgPet, vacina.idVacina as idVacina, vacina.nomeVacina as nomeVacina, vacina.idPet as idPet, vacina.dataApliVacina as dataApliVacina from vacina inner join pet on vacina.idPet =pet.idPet inner join cliente on pet.idCli  = cliente.idCli where pet.rgPet = ? and vacina.statusVacina = "Vigente"',[req.body.rgPet],
            (error, resultado, fields) => {
                conn.release();
                if(error){return res.json({ error: "error sql"})}    
                if(resultado.length == 0){
                    return res.json({ message: "Vacina nao encontrado"})
                }
                const response = {
                    Vacina: resultado.map(vac => {
                        return  {
                            idVacina: vac.idVacina ,
                            idPet: vac.idPet ,
                            nomeCli: vac.nomeCli ,
                            NomePet: vac.nomePet ,
                            rgPet: vac.rgPet ,
                            nomeVacina: vac.nomeVacina ,
                            dataApliVacina: vac.dataApliVacina
                        };
                    })
                };
                return res.json({ response });              
            }
        )
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////  BUSCAR VACINA  //////////////////////////////////////////////////////////////////////////
exports.BuscarInfo = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: "error sql"})} 

        conn.query('select pet.nomePet as nomePet, pet.rgPet as rgPet, vacina.NomeVacina as NomeVacina , vacina.qntDoseVacina as qntDoseVacina, vacina.loteVacina as loteVacina, vacina.dataApliVacina as dataApliVacina , vacina.dataProxVacina as dataProxVacina, vacina.nomeVetVacina  as nomeVetVacina, vacina.emailVetVacina  as emailVetVacina, vacina.crmvVetVacina as crmvVetVacina, vacina.observacaoVacina as observacaoVacina  from vacina inner join pet on vacina.idPet = pet.idPet where vacina.idVacina = ?',[req.body.idVacina],
            (error, resultado, fields) => {
                conn.release();

                if(error){return res.json({ error: "error sql"})}    
                if(resultado.length == 0){
                    return res.json({ message: "Vacina nao encontrado"})
                }
                const response = {
                    Vacina: resultado.map(vac => {
                        return  {
                            nomePet: vac.nomePet ,
                            rgPet: vac.rgPet ,
                            NomeVacina: vac.NomeVacina ,
                            qntDoseVacina: vac.qntDoseVacina ,
                            loteVacina: vac.loteVacina ,
                            dataApliVacina: vac.dataApliVacina ,
                            dataProxVacina: vac.dataProxVacina,
                            nomeVetVacina: vac.nomeVetVacina ,
                            emailVetVacina: vac.emailVetVacina,
                            crmvVetVacina: vac.crmvVetVacina,
                            observacaoVacina: vac.observacaoVacina
                        };
                    })
                };
                return res.json({ response });              
            }
        )
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

