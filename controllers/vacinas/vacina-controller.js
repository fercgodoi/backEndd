const mysql = require('../../mysql').pool;

<<<<<<< HEAD
///////////////////////////////////////////////////////////////  INSERIR VACINA  //////////////////////////////////////////////////////////////////////////
=======
//---------------------------------BLOCO EMAIL------------------------------------------------------//

let transporter = nodemailer.createTransport({                  //configurando a minha conta, dados da conta q vai enviar//
    host:"imap.gmail.com",                                     
    port: 465,
    secure: true,
    auth: {
        user: "oneforasteiro@gmail.com",
        pass: process.env.EMAIL_KEY                                         
    }
});

//---------------------------------------------------------------//
>>>>>>> fbe9456689e9e11b5a2ce02712a02b75a8edf8bd

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

<<<<<<< HEAD
=======
    let status ;

    if(req.body.confirmaVacina == 1){ status = "Vigente" }
    if(req.body.confirmaVacina == -1 ){ status = "Recusada" }

    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query(`update vacina set nomeVacina = ?, qntDoseVacina = ?, loteVacina = ?, nomeVetVacina = ?, crmvVetVacina = ?, confirmaVacina = ?, statusVacina = ?, observacaoVacina = ?  where idVacina = ?`,
                 [req.body.nomeVacina, 
                 req.body.qntDoseVacina, 
                 req.body.loteVacina, 
                 req.body.nomeVetVacina,
                 req.body.crmvVetVacina, 
                 req.body.confirmaVacina,
                 status,
                 req.body.observacaoVacina, 
                 req.body.idVacina],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ resposta:'falhou', error: error})        
                    }
                     res.status(201).send( 'Vacina atualizada com sucesso' )
                }
        )
    }) 
};

/*
update vacina set confirmaVacina = ?, set statusVacina = ${status}, observacaoVacina = ? where idVacina = ?

update vacina set dataApliVacina = ?, dataProxVacina = ?, nomeVacina = ?, qntDoseVacina = ?, loteVacina = ?, valorVacina = ?,  nomeVetVacina = ?, emailVetVacina = ?, crmvVetVacina = ?, statusVacina = ?,  confirmaVacina = ?, statusVacina = ${status}, observacaoVacina = ?  where idVacina = ?
*/

/*-----------------------------VERIFICAÇÃO DE DATA-----------------------

var vacVen = req.body.dataProxVacina.split('-')
        var data = new Date(vacVen[2], vacVen[1] - 1, vacVen[0]);     //atribuímos vacVen a data q foi informada em formato válido, já q estou passando String
        if(data > new Date()){
           console.log('vacina vencida')
           req.body.statusVacina = 'Vencida'
          }

---------------------------------------*/
/*
function EnviarVacVet(dataApliVacina, dataProxVacina, nomeVacina, qntDoseVacina, nomePet, nomeVetVacina, emailVetVacina, crmvVetVacina, token) {
    return (`<!DOCTYPE html>
    <html lang='br'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Agenda animal</title>
    </head>
    <body>
    
        <h1>Ola Somos o Agenda animal!!</h1>
        <h3>Um tutor informa q vc vacinou um de seus animaizinhos, dê uma olhada nos dados e se vc estiver de acordo so selecionar confimar e dar ok </h3>
       
        <label name=''>Nome Veterinario: ${nomeVetVacina} </label><br>                      //terminar aqui-----------//
        <label name=''>E-mail Veterinario: ${emailVetVacina} </label><br>
        <label name=''>CRMV Veterinario: ${crmvVetVacina} </label><br>
        <label name=''>Nome da Vacina: ${nomeVacina} </label><br>
        <label name=''>Dosagem da Vacina: ${qntDoseVacina} </label><br>
        <label name=''>Data da Vacinação: ${dataApliVacina} </label><br>
        <label name=''> Data da Proxima vacina: ${dataProxVacina} </label><br>
        <label name=''> Nome do Animal: ${nomePet} </label><br>
        <p></p>
    
        <input type='radio' id='confimar' name='gender' onclick='radio(1)' >
        <label for='confimar'>Confirmar</label><br>
    
        <input type='radio' id='cancelar' name='gender' onclick='radio(3)' >
        <label for="cancelar">Cancelar</label><br>
    
        <input type='button' value='somar'  onclick='enviar()'>  
    
        <p></p>
    
        <div id='resp' ></div>
    
    
        <script>
    
            let Resultado = 0;
    
            function radio(id) {
            Resultado = id;
            console.log(Resultado)
            }
            
            function enviar(){
                
                var http = new XMLHttpRequest();
                var url = 'http://localhost:3000/vacina/confirmaVacina';
                var params = 'confirmaVacina= ' + Resultado;                    //ALTERARRARARARAR //o idvacina esta no token
                http.open('POST', url, true);
    
                http.setRequestHeader({'Content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + ${token}}); //ṕassar o token aqui
    
                http.onreadystatechange = function() {
                    console.log(this.responseText);
                    document.getElementById('resp').innerHTML = this.responseText
                    }
                http.send(params);
                
            }
    
         </script>
    
    
    </body>
    </html>
    
    `)
}*/
>>>>>>> fbe9456689e9e11b5a2ce02712a02b75a8edf8bd
