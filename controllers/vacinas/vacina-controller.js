const mysql = require('../../mysql').pool;
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");               //para enviar emails

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

exports.inserirVacina = (req, res, next) => {

    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('insert into vacina(dataApliVacina, dataProxVacina, nomeVacina, qntDoseVacina, loteVacina, valorVacina, nomeVetVacina, emailVetVacina, crmvVetVacina, idPet)  values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.body.dataApliVacina, req.body.dataProxVacina, req.body.nomeVacina, req.body.qntDoseVacina, req.body.loteVacina, req.body.valorVacina, req.body.nomeVetVacina, req.body.emailVetVacina, req.body.crmvVetVacina, req.body.idPet],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: Feacha conexao com o banco
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }

                    var dataApliVacina = req.body.dataApliVacina.split('-').reverse().join('-'); //colocando a data para o formato dd/mm/yyyy
                    var dataProxVacina = req.body.dataProxVacina.split('-').reverse().join('-');

                    const token = jwt.sign({
                        idVacina: resultado.insertId,
                        dataApliVacina: dataApliVacina,
                        dataProxVacina: dataProxVacina,
                        nomeVacina: req.body.nomeVacina,
                        qntDoseVacina: req.body.qntDoseVacina,
                        loteVacina: req.body.loteVacina,
                        nomePet: req.body.nomePet,
                        nomeVetVacina: req.body.nomeVetVacina,
                        emailVetVacina: req.body.emailVetVacina,
                        crmvVetVacina: req.body.crmvVetVacina
                    }, process.env.JWT_KEY, {
                        expiresIn:"48H"
                    });

                    res.status(202).send({token: token})

                    //enviar o codigo pelo email//
                    transporter.sendMail({
                    from: "  One <oneforasteiro@gmail.com>",
                    to: req.body.emailVetVacina,               
                    subject: "O Agenda animal tem uma notificação para você",
                    text: ``,
                    html: `<!DOCTYPE HTML>
                    <html lang=”pt-br”>
                    <head>
                    <meta charset=”UTF-8”>
                    <link rel=”stylesheet” type=”text/css” href=”estilo.css”>
                    <title></title>
                    </head>
                    <body>
                        <h1>Ola Somos o Agenda animal!!</h1>
                        <h3>Um tutor informa q vc vacinou um de seus animaizinhos, acesse o link a abaixo e confira</h3>
                        
                        <a href="http://localhost:3000/vacina/respostaVacina/${token}" target="_blank" >link</a>
                    </body>
                    </html>`
                    
                        }).then(message => {
                            res.status(202).send({ mensagem: message, resposta:'Vacina inserida com sucesso, aguardando confirmação do Profissional' })
                        }).catch(err =>{
                            res.status(404).send({ mensagem: "Falha", error: err})
                        }) 
                        /*EnviarVacVet(req.body.dataApliVacina, req.body.dataProxVacina, req.body.nomeVacina, req.body.qntDoseVacina, req.body.nomePet, req.body.nomeVetVacina, req.body.emailVetVacina, req.body.crmvVetVacina, token)*/
                     /* res.status(201).send({                          
                        mensagem: 'Vacina inserida com sucesso, aguardando confirmação do Profissional',
                        id_Vacina: resultado.insertId,                        //retorno do id de insert, proprio sql nos retorna
                        token: token
                    })*/
                }
        )
    }) 
};


//----------TESTEEEE---------------------------//
exports.teste = (req, res, next) => {
    var idVac = req.body.idVac;
    var resp = req.body.resp;
    //res.send({ idVac: idVac ,resultado: resp})
    res.send(EnviarVacVet(idVac, resp));
}; 

//-------------------------------------------//


exports.atualizarVacina = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('update vacina set dataApliVacina = ?, dataProxVacina = ?, nomeVacina = ?, qntDoseVacina = ?, loteVacina = ?, valorVacina = ?,  nomeVetVacina = ?, emailVetVacina = ?, crmvVetVacina = ?, statusVacina = ?,  confirmaVacina = ? where idVacina = ?',
                 [req.body.dataApliVacina, req.body.dataProxVacina, req.body.nomeVacina, req.body.qntDoseVacina, req.body.loteVacina, req.body.valorVacina, req.body.nomeVetVacina, req.body.emailVetVacina, req.body.crmvVetVacina, 'Pendente', 0 , req.body.idVacina],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }

                    var dataApliVacina = req.body.dataApliVacina.split('-').reverse().join('-'); //colocando a data para o formato dd/mm/yyyy
                    var dataProxVacina = req.body.dataProxVacina.split('-').reverse().join('-');

                    const token = jwt.sign({
                        idVacina: req.body.idVacina,
                        dataApliVacina: dataApliVacina,
                        dataProxVacina: dataProxVacina,
                        nomeVacina: req.body.nomeVacina,
                        qntDoseVacina: req.body.qntDoseVacina,
                        nomePet: req.body.nomePet,                      // <==================
                        nomeVetVacina: req.body.nomeVetVacina,
                        emailVetVacina: req.body.emailVetVacina,
                        crmvVetVacina: req.body.crmvVetVacina
                    }, process.env.JWT_KEY, {
                        expiresIn:"48H"
                    });

                    //enviar o codigo pelo email//
                    transporter.sendMail({
                    from: "  One <oneforasteiro@gmail.com>",
                    to: req.body.emailVetVacina,               
                    subject: "O Agenda animal tem uma notificação para você",
                    text: ``,
                    html: `<!DOCTYPE HTML>
                    <html lang=”pt-br”>
                    <head>
                    <meta charset=”UTF-8”>
                    <link rel=”stylesheet” type=”text/css” href=”estilo.css”>
                    <title></title>
                    </head>
                    <body>
                        <h1>Ola Somos o Agenda animal!!</h1>
                        <h3>Um tutor informa q vc vacinou um de seus animaizinhos, acesse o link a abaixo e confira</h3>
                        
                        <a href="http://localhost:3000/vacina/respostaVacina/${token}" target="_blank" >link</a>
                    </body>
                    </html>`

                        }).then(message => {
                            res.status(202).send({ mensagem: message, resposta:'Vacina atualizada com sucesso, aguardando confirmação do Profissional' })
                        }).catch(err =>{
                            res.status(404).send({ mensagem: "Falha", error: err})
                        }) 

                        //res.status(202).send({ resposta:'Vacina atualizada com sucesso, aguardando confirmação do Profissional' })
                }
        )
    }) 
};

exports.deletarVacina =(req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query(`delete from vacina where idVacina = ? `,[req.body.idVacina],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error })        
                    }
                     res.status(202).send({                          
                        mensagem: 'Vacina deletada com sucesso',
                        resp: "ok"                       //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
};

exports.buscarVacina = (req, res, next) => {       //rota passando parametro

    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('select * from vacina where idPet = ?;',[req.body.idPet],
            (error, resultado, fields) => {
                if(error){                                  //tratamento de erro da query
                    return res.status(500).send({ error: error})        
                }

                const response = {
                    Vacina: resultado.map(vac => {

                        if(vac.confirmaVacina == 0){
                            //continua pendente
                            vac.statusVacina = 'Pendente'
                        } else if(vac.confirmaVacina == -1) {
                            //continua recusado
                        } else 
                        if(vac.dataProxVacina == undefined || vac.dataProxVacina == null || vac.dataProxVacina == '' ){
                            //vac.statusVacina = 'Vigente'
                            //continua vigente
                        } else {
                            var vacVencida = JSON.stringify(vac.dataProxVacina).substr(1,10)
                            var vacVen = vacVencida.split('-').reverse()
                            var data = new Date(vacVen[2], vacVen[1] - 1, vacVen[0]);
                            //console.log(`dados passados ${data} e   ${ new Date()}`)
                            if( new Date() > data ){
                                vac.statusVacina = 'Vencida'
                                conn.query('update vacina set statusVacina = ? where idVacina = ?;',[vac.statusVacina, vac.idVacina ], (error, resultado, fields) => {
                                    if(error){                                  
                                        return res.status(500).send({ error: error})        
                                    }
                                    //senao so continua
                                })
                            }else {
                                vac.statusVacina = 'Vigente'
                                conn.query('update vacina set statusVacina = ? where idVacina = ?;',[vac.statusVacina, vac.idVacina ], (error, resultado, fields) => {
                                    if(error){                                  
                                        return res.status(500).send({ error: error})        
                                    }
                                    //senao so continua
                                })
                            }
                        }
                       // vac.dataApliVacina = JSON.stringify(vac.dataApliVacina).substr(1,10).split('-').reverse().join('-')
                       //deixar em formato brbr

                        return {
                            idVacina: vac.idVacina,
                            dataApliVacina: vac.dataApliVacina,
                            dataProxVacina: vac.dataProxVacina,
                            nomeVacina: vac.nomeVacina,
                            qntDoseVacina: vac.qntDoseVacina,
                            loteVacina: vac.loteVacina,
                            valorVacina: vac.valorVacina,
                            statusVacina: vac.statusVacina,
                            confirmaVacina: vac.confirmaVacina,
                            nomeVetVacina: vac.nomeVetVacina,
                            emailVetVacina: vac.emailVetVacina,
                            crmvVetVacina: vac.crmvVetVacina,
                            idPet: vac.idPet,
                            idPrest: vac.idPrest,
                            idFunc: vac.idFunc
                        };
                        
                    })
                };

                //FAZER VERIFICAÇÃO SE A VACINA ESTA VENCIDA

                return res.status(200).send({ response });
            }
        )
    })
};


exports.confirmaVacina = (req, res, next) => {

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