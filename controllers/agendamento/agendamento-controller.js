const mysql = require('../../mysql').pool;              //para conectar ao banco


/*                                                    BUSCAR AGENDAMENTO                                                                  */
exports.buscarAgendamento = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'erro sql'})} 
        conn.query('select cliente.nomeCli, pet.nomePet, pet.racaPet, pet.fotoPet, agendamento.idAgen, agendamento.tipoServicoAgen,  agendamento.formaPagtAgen,  agendamento.DataAgen,  agendamento.HoraAgen from agendamento  inner join pet on pet.idPet = agendamento.idPet inner join cliente on pet.idCli = cliente.idCli  where agendamento.idPrest = ? and agendamento.StatusAgen="Pendente"', [req.funcionario.idPrest],
            (error, resultado, field)=> {
                conn.release(); 
                if(error){return res.json({ error: 'erro sql'})}            

                const response = { 
                    Agendamento: resultado.map(agend => {
                        return  {
                            nomeCli: agend.nomeCli,
                            racaPet: agend.racaPet,
                            nomePet: agend.nomePet,
                            // fotoPet: agend.fotoPet,
                            fotoPet: agend.fotoPet,
                            // 'https://api-agenda-teste.herokuapp.com/' + 
                            tipoServicoAgen: agend.tipoServicoAgen,
                            formaPagtAgen: agend.formaPagtAgen,
                            DataAgen: agend.DataAgen,
                            HoraAgen: agend.HoraAgen,
                            idAgend: agend.idAgen
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/*                                                    ---------------                                                              */


/*                                                    BUSCAR AGENDAMENTO                                                                  */
exports.buscarAgend = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'erro sql'})} 

        conn.query('select cliente.nomeCli,pet.especiePet,agendamento.statusAgen, pet.nomePet, agendamento.idPet, pet.dataCastPet,pet.sexoPet, pet.aniverPet,pet.racaPet, pet.fotoPet, agendamento.idAgen, agendamento.tipoServicoAgen,  agendamento.formaPagtAgen,  agendamento.DataAgen,  agendamento.HoraAgen from agendamento  inner join pet on pet.idPet = agendamento.idPet inner join cliente on pet.idCli = cliente.idCli  where agendamento.idAgen = ? and agendamento.idPrest = ?', [req.body.idAgend,req.funcionario.idPrest],
        // tdNomePet.onclick = function() { Detalhes(produto[i].idAgend) };
            (error, resultado, field)=> {
                conn.release();
                if(error){return res.json({ error: 'erro sql'})}          

                const response = { 
                    Agendamento: resultado.map(agend => {
                        return  {
                            nomeCli: agend.nomeCli,
                            racaPet: agend.racaPet,
                            nomePet: agend.nomePet,
                            fotoPet: agend.fotoPet,
                            //  fotoPet: 'https://api-agenda-teste.herokuapp.com/'+ agend.fotoPet,
                            tipoServicoAgen: agend.tipoServicoAgen,
                            formaPagtAgen: agend.formaPagtAgen,
                            DataAgen: agend.DataAgen,
                            HoraAgen: agend.HoraAgen,
                            idAgend: agend.idAgend,
                            sexoPet: agend.sexoPet,
                            dataPet: agend.aniverPet,
                            castPet: agend.castPet,
                            especiePet: agend.especiePet,
                            idPet: agend.idPet,
                            statusAgen: agend.statusAgen
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/*                                                    ---------------                                                              */

/*                                                    BUSCAR AGENDAMENTO  CONFIRMADOS                                                             */
exports.buscarAgendamentoConf = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'erro sql'})} 
        conn.query('select cliente.nomeCli,pet.sexoPet, pet.racaPet,agendamento.tipoServicoAgend,agendamento.formaPagtAgend,agendamento.DataAgend,agendamento.HoraAgend from agendamento inner join pet on pet.idPet = agendamento.idPet inner join cliente on pet.idCliente = cliente.idCliente where agendamento.idPrest = ? and agendamento.StatusAgend= ?', [req.prestador.idPrest,'Confirmado'],
            (error, resultado, field)=> {
                conn.release();
                if(error){return res.json({ error: 'erro sql'})}              

                const response = {
                    Agendamento: resultado.map(agend => {
                        return  {
                            nomeCli: agend.nomeCli,
                            nomePet: agend.nomePet,
                            racaPet: agend.racaPet,
                            tipoServicoAgend: agend.tipoServicoAgend,
                            formaPagtAgend: agend.formaPagtAgend,
                            DataAgend: agend.DataAgend,
                            HoraAgend: agend.HoraAgend,
                            
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/*                                                    ---------------                                                              */


/*                                                    CONTAGEM DE AGENDAMENTO                                                                 */
exports.ContAgendamentoDia = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'erro sql'})} 

        var data = new Date;
        var ano = data.getFullYear();
        var mes = data.getMonth();
        var dia = data.getDate();
        if(mes < 10){
            mes = "0" + mes;
        }
        var dataCorreta = ano + "-" + mes + "-" + dia;

        conn.query(' SELECT COUNT(idAgen) AS contador from agendamento where idPrest= ? and StatusAgen="Confirmado" and DataAgen= ?', [req.funcionario.idPrest,dataCorreta],
            (error, resultado, field)=> {
                conn.release();
                if(error){return res.json({ error: 'erro sql'})}           

                const response = {
                    Agendamento: resultado.map(agend => {
                        return  {
                            contador: agend.contador
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/*                                                    ---------------                                                              */



/*                                                    CONFIRMARÇÃO DE AGENDAMENTO                                                                 */

exports.ConfirmarAgendamento = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.json({ error: "Error server"})        
        }
            conn.query('update agendamento set statusAgen="Confirmado" where idAgen=?',[req.body.idAgend],
                (error, resultado, field)=> {                  
                    conn.release();                           
                    if(error){return res.json({ error:"Error server"})}
                    return res.json({message:'alterado',response: resultado})

                }
            )
        
    }) 
}
/*                                                             ---------------                                                              */



/*                                                    NEGAÇÃO DE AGENDAMENTO                                                                 */

exports.NegarAgendamento = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){return res.json({ error: 'erro sql'})} 
        conn.query('update agendamento set statusAgen="Negado" where idAgen=?',[req.body.idAgend],
                (error, resultado, field)=> {                  
                    conn.release();                           
                    if(error){return res.json({ error: 'erro sql'})} 
                    return res.json({message:'alterado'})
                }
            )
    }) 
}
/*                                                             ---------------                                                              */


/*                                                    BUSCAR AGENDAMENTO  PENDENTES                                                                */
exports.BuscarPendente = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'erro sql'})} 
        
        var data = new Date;
        // var hora= data.getHours();
        // var minuto = data.getMinutes();
        // var horaCorreta = hora + ":" + minuto;

        var ano = data.getFullYear();
        var mes = data.getMonth();
        var dia = data.getDate();
        if(mes < 10){
            mes = "0" + mes;
        }
        var dataCorreta = ano + "-" + mes + "-" + dia;

        // and agendamento.HoraAgen >= ?
        conn.query('select cliente.nomeCli, pet.nomePet, pet.racaPet, pet.fotoPet, agendamento.idAgen, agendamento.tipoServicoAgen,  agendamento.formaPagtAgen,  agendamento.DataAgen,  agendamento.HoraAgen from agendamento  inner join pet on pet.idPet = agendamento.idPet inner join cliente on pet.idCli = cliente.idCli  where agendamento.idPrest = ? and agendamento.StatusAgen="Pendente" and agendamento.DataAgen >= ?  order by agendamento.DataAgen desc limit 5 ', [req.funcionario.idPrest, dataCorreta],
            (error, resultado, field)=> {
                conn.release();
                if(error){return res.json({ error: 'erro sql'})}             

                const response = { 
                    Agendamento: resultado.map(agend => {
                        return  {
                            nomeCli: agend.nomeCli,
                            racaPet: agend.racaPet,
                            nomePet: agend.nomePet,
                            fotoPet: agend.fotoPet,
                            tipoServicoAgen: agend.tipoServicoAgen,
                            formaPagtAgen: agend.formaPagtAgen,
                            DataAgen: agend.DataAgen,
                            HoraAgen: agend.HoraAgen,
                            idAgend: agend.idAgen
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/*                                                    ---------------                                                              */


/*                                                    BUSCAR AGENDAMENTO APROVADOS                                                                */
exports.BuscarAprovados = (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'erro sql'})} 
        var data = new Date;
        // var hora= data.getHours();
        // var minuto = data.getMinutes();
        // var horaCorreta = hora + ":" + minuto;

        var ano = data.getFullYear();
        var mes = data.getMonth();
        var dia = data.getDate();
        if(mes < 10){
            mes = "0" + mes;
        }
        var dataCorreta = ano + "-" + mes + "-" + dia;

        // and agendamento.HoraAgen >= ?
        conn.query('select cliente.nomeCli, pet.nomePet, pet.racaPet, pet.fotoPet, agendamento.idAgen, agendamento.tipoServicoAgen,  agendamento.formaPagtAgen,  agendamento.DataAgen,  agendamento.HoraAgen from agendamento  inner join pet on pet.idPet = agendamento.idPet inner join cliente on pet.idCli = cliente.idCli  where agendamento.idPrest = ? and agendamento.statusAgen="Confirmado" and agendamento.DataAgen >= ?  order by agendamento.DataAgen desc limit 5 ', [req.funcionario.idPrest, dataCorreta],
            (error, resultado, field)=> {
                conn.release(); 
                if(error){return res.json({ error: 'erro sql'})}          

                const response = { 
                    Agendamento: resultado.map(agend => {
                        return  {
                            nomeCli: agend.nomeCli,
                            racaPet: agend.racaPet,
                            nomePet: agend.nomePet,
                            fotoPet: agend.fotoPet,
                            tipoServicoAgen: agend.tipoServicoAgen,
                            formaPagtAgen: agend.formaPagtAgen,
                            DataAgen: agend.DataAgen,
                            HoraAgen: agend.HoraAgen,
                            idAgend: agend.idAgen
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/*                                                    ---------------                                                              */


/*                                                    BUSCAR AGENDAMENTO NEGADOS                                                               */
exports.BuscarNegado = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'erro sql'})} 

        var data = new Date;
        // var hora= data.getHours();
        // var minuto = data.getMinutes();
        // var horaCorreta = hora + ":" + minuto;

        var ano = data.getFullYear();
        var mes = data.getMonth();
        var dia = data.getDate();
        if(mes < 10){
            mes = "0" + mes;
        }
        var dataCorreta = ano + "-" + mes + "-" + dia;

        // and agendamento.HoraAgen >= ?
        conn.query('select cliente.nomeCli, pet.nomePet, pet.racaPet, pet.fotoPet, agendamento.idAgen, agendamento.tipoServicoAgen,  agendamento.formaPagtAgen,  agendamento.DataAgen,  agendamento.HoraAgen from agendamento  inner join pet on pet.idPet = agendamento.idPet inner join cliente on pet.idCli = cliente.idCli  where agendamento.idPrest = ? and agendamento.statusAgen="Negado" and agendamento.DataAgen >= ?  order by agendamento.DataAgen desc limit 5 ', [req.funcionario.idPrest, dataCorreta],
            (error, resultado, field)=> {
                conn.release();
                if(error){return res.json({ error: 'erro sql'})}            

                const response = { 
                    Agendamento: resultado.map(agend => {
                        return  {
                            nomeCli: agend.nomeCli,
                            racaPet: agend.racaPet,
                            nomePet: agend.nomePet,
                            fotoPet: agend.fotoPet,
                            tipoServicoAgen: agend.tipoServicoAgen,
                            formaPagtAgen: agend.formaPagtAgen,
                            DataAgen: agend.DataAgen,
                            HoraAgen: agend.HoraAgen,
                            idAgend: agend.idAgen
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/*                                                    ---------------                                                              */




/*                                                    BUSCAR AGENDAMENTO APROVADOS                                                                */
exports.BuscarAprovadosDia = (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'erro sql'})} 

        // and agendamento.HoraAgen >= ?
        conn.query('select cliente.nomeCli, pet.nomePet, pet.racaPet, pet.fotoPet, agendamento.idAgen, agendamento.tipoServicoAgen,  agendamento.formaPagtAgen,  agendamento.DataAgen,  agendamento.HoraAgen from agendamento  inner join pet on pet.idPet = agendamento.idPet inner join cliente on pet.idCli = cliente.idCli  where agendamento.idPrest = ? and agendamento.StatusAgen="Confirmado" and agendamento.DataAgen = ?  order by agendamento.HoraAgen ', [req.funcionario.idPrest, req.body.dataCorreta],
            (error, resultado, field)=> {
                conn.release(); 
                if(error){return res.json({ error: 'erro sql'})}          

                const response = { 
                    Agendamento: resultado.map(agend => {
                        return  {
                            nomeCli: agend.nomeCli,
                            racaPet: agend.racaPet,
                            nomePet: agend.nomePet,
                            fotoPet: agend.fotoPet,
                            tipoServicoAgen: agend.tipoServicoAgen,
                            formaPagtAgen: agend.formaPagtAgen,
                            DataAgen: agend.DataAgen,
                            HoraAgen: agend.HoraAgen,
                            idAgend: agend.idAgen
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/*                                                    ---------------                                                              */
