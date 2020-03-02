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
        pass: "largatixa1"                                       
    }
});

//---------------------------------------------------------------//

exports.inserirVacina = (req, res, next) => {

    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('insert into vacina(dataApliVacina, dataProxVacina, nomeVacina, qntDoseVacina, valorVacina, nomeVetVacina, emailVetVacina, crmvVetVacina, idPet)  values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.body.dataApliVacina, req.body.dataProxVacina, req.body.nomeVacina, req.body.qntDoseVacina, req.body.valorVacina, req.body.nomeVetVacina, req.body.emailVetVacina, req.body.crmvVetVacina, req.body.idPet],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }

                    const token = jwt.sign({
                        idVacina: resultado.insertId,
                        dataApliVacina: req.body.dataApliVacina,
                        dataProxVacina: req.body.dataProxVacina,
                        nomeVacina: req.body.nomeVacina,
                        qntDoseVacina: req.body.qntDoseVacina,
                        nomePet: req.body.nomePet,
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
                    /*EnviarVacVet(req.body.dataApliVacina, req.body.dataProxVacina, req.body.nomeVacina, req.body.qntDoseVacina, req.body.nomePet, req.body.nomeVetVacina, req.body.emailVetVacina, req.body.crmvVetVacina, token)*/

                        }).then(message => {
                            res.status(202).send({ mensagem: message, resposta:'Vacina inserida com sucesso, aguardando confirmação do Profissional' })
                        }).catch(err =>{
                            res.status(404).send({ mensagem: "Falha", error: err})
                        }) 

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
        conn.query('update vacina set dataApliVacina = ?, dataProxVacina = ?, nomeVacina = ?, qntDoseVacina = ?, valorVacina = ?, statusVacina = ?, confirmaVacina = ?, idPet = ?, idPrest = ?, idFunc = ? where idVacina = ?',
                 [req.body.dataApliVacina, req.body.dataProxVacina, req.body.nomeVacina, req.body.qntDoseVacina, req.body.valorVacina, req.body.statusVacina, req.body.confirmaVacina, req.body.idPet, req.body.idPrest, req.body.idFunc, req.body.idVacina],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(201).send({                          
                        mensagem: 'Vacina atualizada com sucesso',
                        resp: "ok"                        //retorno do id de insert, proprio sql nos retorna
                    })
                }
        )
    }) 
};

exports.deletarVacina =(req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query(`delete from vacina where idVacina = ? `,[req.body.idCli],
                 (error, resultado, field)=> {      //tratando o retorno
                     conn.release();                //IMPORTANTE release: liberar a conexao com a nossa query 
                     if(error){                                  //tratamento de erro da query
                        return res.status(500).send({ error: error})        
                    }
                     res.status(202).send({                          
                        mensagem: 'Cliente deletado com sucesso',
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
                        return {
                            idVacina: vac.idVacina,
                            dataApliVacina: vac.dataApliVacina,
                            dataProxVacina: vac.dataProxVacina,
                            nomeVacina: vac.nomeVacina,
                            qntDoseVacina: vac.qntDoseVacina,
                            valorVacina: vac.valorVacina,
                            statusVacina: vac.statusVacina,
                            confirmaVacina: vac.confirmaVacina,
                            idPet: vac.idPet,
                            idPrest: vac.idPrest,
                            idFunc: vac.idFunc
                        };
                    })
                };
                return res.status(200).send({ response });

             // return res.status(200).send({response: resultado})
            }
        )
    })
};


exports.confirmaVacina = (req, res, next) => {

    mysql.getConnection((error, conn) =>{
        if(error){                                  //tratamento de erro da conexao
            return res.status(500).send({ error: error})        
        }
        conn.query('update vacina set confirmaVacina = ? where idVacina = ?',
                 [req.body.confirmaVacina, req.body.idVacina],
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