const mysql = require('../../mysql').pool;
const nodemailer = require("nodemailer");               //para enviar emails
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/*                                                    ENVIAR EMAIL                                                               */
let transporter = nodemailer.createTransport({                  //configurando a minha conta, dados da conta q vai enviar//
    host:"email-ssl.com.br",                                     
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_KEY                                    
    }    
});
/*                                                    ---------------                                                              */

/*                                                       GERAR CODIGO                                                                  */
function getRandomInt() { return Math.floor(Math.random() * (999999 - 100000)) + 100000; }
/*                                                    ---------------                                                              */



/*                                                    LOGIN                                                                */
exports.LoginFunc = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.json({ error: "error sql"}) }

        conn.query('select * from funcionario where EmailFunc= ?',[req.body.EmailFunc],
            (error, result, fields) => {
                conn.release();
                if(error){ return res.json({ error: "error sql"}) } 
                if(result.length < 1){
                    return res.json({message: "Usuario inexistente"})
                }

                bcrypt.compare(req.body.SenhaFunc, result[0].SenhaFunc, (err, resultCript)=> {
                    if(err){ return res.json( "falha na autenticação") }
                    
                    if(resultCript){
                        
                    const token = jwt.sign({
                        idPrest: result[0].idPrest,
                        idFunc: result[0].idFunc,
                        NomeFunc:result[0].NomeFunc, 
                        EmailFunc:result[0].EmailFunc, 
                        CRMVFunc:result[0].CRMVFunc
                    }, process.env.JWT_KEY, {
                        expiresIn:"24H"
                    });
                        
                    const response = {
                        Funcionarios: result.map(func => {
                            return{
                                idFunc: func.idFunc,
                                StatusFunc: func.StatusFunc,
                                TimeFunc: func.TimeFunc,
                                CodFunc: func.CodFunc,
                                AcessoFunc:func.AcessoFunc,
                            }
                        })
                    }

                    let timeSist = Date.now();
                    let timeFuncTot = response.Funcionarios[0].TimeFunc + 86400000;

                    if(response.Funcionarios[0].StatusFunc === 'Confirmado'){          
                        if(timeSist > timeFuncTot){     
                            let passRandom = getRandomInt();

                            mysql.getConnection((error, conn) => {
                                conn.query('update funcionario set CodFunc= ?, TimeFunc = ? where idFunc = ? ',[passRandom, timeSist, response.Funcionarios[0].idFunc],
                                    (error, result, fields) => {
                                        conn.release();
                                        if(error){ return res.json({ error: "error sql"}) } 

                                        transporter.sendMail({
                                            from: "  AgendaAnimal <atendimento@agendaanimal.com.br>",
                                            to: req.body.EmailFunc,              
                                            subject: "Codigo de verificação",
                                            text: `Faça login novamente no site com esta código: ${passRandom}`
                                        }).then(message => {
                                            return res.json({ message: 'Seu codigo expirou, enviamos um novo codigo para seu email'})
                                        }).catch(err =>{
                                            return res.json({ message: "nao deu", error : err})
                                        }) 
                                })
                            }) 
                        }else{                        
                                return res.json({
                                    response: response.Funcionarios[0].idFunc,
                                    message: "Confirmar Codigo",
                                    token: token,
                                    acesso:response.Funcionarios[0].AcessoFunc,
                                    req: response.Funcionarios[0]
                                })
                            } 
                    }else if(response.Funcionarios[0].StatusFunc === 'Pendente'){
                        return res.json({
                            response: response.Funcionarios[0].idFunc,
                            message: "Trocar Senha",
                            token: token,
                            acesso:response.Funcionarios[0].AcessoFunc
                        })
                    }
                    else if(response.Funcionarios[0].StatusFunc === 'Excluido'){
                        return res.json({
                            response: response.Funcionarios[0].idFunc,
                            message: "Não Pode logar",
                            token: token
                        })
                    }
                    else{
                          return res.json({
                            response: response.Funcionarios[0].idFunc,
                            message: "Logar",
                            token: token,
                            acesso:response.Funcionarios[0].AcessoFunc
                        })
                    }
                } 
                return res.json({ error: 'falha na autenticação'})
            })   
            } 
        )     
    })
}
/*                                                    ---------------                                                              */





/*                                                    CADASTRAR FUNCIONARIO                                                               */
exports.CadastroFuncionario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
       if(error){ return res.json({ error: "error sql"}) } 

        conn.query('select * from funcionario where EmailFunc = ? or CpfFunc = ?', [req.body.EmailFunc,req.body.CpfFunc],
        (error, result, field)=> {
            conn.release();
            if(error){ return res.json({ error: "error sql"}) } 

            if(result.length >= 1){
                if(result[0].EmailFunc == req.body.EmailFunc){
                    return res.json({ message: "Ja existe Email"})
                }
                if(result[0].CpfFunc == req.body.CpfFunc){
                    return res.json({ message: "Ja existe CPF"})
                } 
                          
            }
            if(req.body.SegundInicio == ''){req.body.SegundInicio = null;}
            if(req.body.SegundFinal == ''){req.body.SegundFinal = null;}
            if(req.body.TercaInicio == ''){req.body.TercaInicio = null;}
            if(req.body.TercaFinal == ''){req.body.TercaFinal = null;}
            if(req.body.QuartInicio == ''){req.body.QuartInicio = null;}
            if(req.body.QuartFinal == ''){req.body.QuartFinal = null;}
            if(req.body.QuintInicio == ''){req.body.QuintInicio = null;}
            if(req.body.QuintFinal == ''){req.body.QuintFinal = null;}
            if(req.body.SextInicio == ''){req.body.SextInicio = null;}
            if(req.body.SextFinal == ''){req.body.SextFinal = null;}
            if(req.body.SabInicio == ''){req.body.SabInicio = null;}
            if(req.body.SabFinal == ''){req.body.SabFinal = null;}
            if(req.body.DomingInicio == ''){req.body.DomingInicio = null;}
            if(req.body.DomingFinal == ''){req.body.DomingFinal = null;}

            mysql.getConnection((error, conn) => {
            conn.query('insert into horarioFunc (SegundInicio, SegundFinal, TercaInicio, TercaFinal, QuartInicio, QuartFinal, QuintInicio, QuintFinal, SextInicio, SextFinal, SabInicio, SabFinal, DomingInicio, DomingFinal) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [req.body.SegundInicio, req.body.SegundFinal, req.body.TercaInicio, req.body.TercaFinal, req.body.QuartInicio,req.body.QuartFinal, req.body.QuintInicio, req.body.QuintFinal, req.body.SextInicio, req.body.SextFinal, req.body.SabInicio, req.body.SabFinal, req.body.DomingInicio, req.body.DomingFinal],
            (error, resultHorario, field)=> {
                conn.release();
                if(error){ return res.json({ error: "error sql"}) } 
                
                let idHorarios = resultHorario.insertId; 
                    if(req.body.CRMVFunc != "" && req.body.CRMVFunc != null && req.body.CRMVFunc != undefined)
                    {
                        mysql.getConnection((error, conn) => {
                            conn.query('select * from funcionario where CRMVFunc= ?', [req.body.CRMVFunc],
                            (error, result, field)=> {
                                conn.release();
                                if(error){ return res.json({ error: "error sql"}) } 
                                if(result.length >= 1){
                                    if(result[0].CRMVFunc == req.body.CRMVFunc){
                                        return res.json({ message: "Ja existe CRMV"})
                                    }           
                                }                       

                                let passRandom = getRandomInt();
                                let timeCodFunc = Date.now();
                                let senha = "123456";
                                bcrypt.hash(senha, 10, (errBcrypt, hash) =>{
                                    if(errBcrypt){ return res.json({ error: 'error' }) }
                                    mysql.getConnection((error, conn) => {
                                        conn.query('insert into funcionario(idPrest,idHorarioFunc,CelFunc, NomeFunc,EmailFunc,CpfFunc,RecepFunc ,VetFunc,AdminFunc ,FinanFunc ,AcessoFunc ,StatusFunc , SenhaFunc,TimeFunc,CodFunc,CRMVFunc,DateEmiFunc,TipoFunc) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                        [req.funcionario.idPrest,idHorarios,req.body.CelFunc,req.body.NomeFunc,req.body.EmailFunc,req.body.CpfFunc,req.body.RecepFunc,req.body.VetFunc,req.body.AdminFunc,req.body.FinanFunc,req.body.AcessoFunc,"Confirmado",hash,timeCodFunc,passRandom,req.body.CRMVFunc, req.body.DateEmiFunc,"Funcionário"],
                                        (error, resultado, field)=> { 
                                            conn.release();
                                            if(error){ return res.json({ error: "error sql"}) } 

                                            transporter.sendMail({
                                                from: "  AgendaAnimal <atendimento@agendaanimal.com.br>",
                                                to: req.body.EmailFunc,              
                                                subject: "Senha AgendaAnimal",
                                                text: `Faça login novamente no site com esta senha: ${senha} e seu código é: ${passRandom}`
                                            }).then(message => {
                                                return res.json({ message: 'Cadastrado'})
                                            }).catch(err =>{
                                                return res.json({ message: "nao deu", error : err})
                                            })                                    
                                        })
                                    })                                
                                }) 
                                
                            })
                        })
                    }
                    else{
                        let passRandom = getRandomInt();
                        let timeCodFunc = Date.now();
                        let senha = "123456";
                        bcrypt.hash(senha, 10, (errBcrypt, hash) =>{
                            if(errBcrypt){ return res.json({ error: 'error bcrypt' }) }
                            mysql.getConnection((error, conn) => {
                                conn.query('insert into funcionario(idPrest,idHorarioFunc, CelFunc, NomeFunc,EmailFunc,CpfFunc,RecepFunc ,VetFunc,AdminFunc ,FinanFunc ,AcessoFunc ,StatusFunc , SenhaFunc,TimeFunc,CodFunc,TipoFunc) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                    [req.funcionario.idPrest,idHorarios,req.body.CelFunc,req.body.NomeFunc,req.body.EmailFunc,req.body.CpfFunc,req.body.RecepFunc,req.body.VetFunc,req.body.AdminFunc,req.body.FinanFunc,req.body.AcessoFunc,"Confirmado",hash,timeCodFunc,passRandom,"Funcionário"],
                                    (error, resultado, field)=> {
                                        conn.release();
                                        if(error){ return res.json({ error: "error sql"}) } 

                                        transporter.sendMail({
                                            from: "  AgendaAnimal <atendimento@agendaanimal.com.br>",
                                            to: req.body.EmailFunc,              
                                            subject: "Senha AgendaAnimal",
                                            text: `Faça login novamente no site com esta senha: ${senha} e seu código é: ${passRandom}`
                                        }).then(message => {
                                            return res.json({ message: 'Cadastrado'})
                                        }).catch(err =>{
                                            return res.json({ message: "nao deu", error : err})
                                        })                                     
                                })
                            })
                        })          
                    }
                })                                         
            })        
        })
    })
}

/*                                                    ---------------                                                              */



/*                                                    CODIGO FUNCIONARIO                                                               */
exports.CodFunc = (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){ return res.json({ error: "error sql"}) } 

        conn.query('select * from funcionario where CpfFunc = ?',[ req.body.CpfFunc , req.body.CodFunc],
            (error, result, fields) => {
                conn.release();
                if(error){ return res.json({ error: "error sql"}) } 
                if(result.length == 0){
                    return  res.json({ message: "Código incorreto"})
                } 

                mysql.getConnection((error, conn) => {
                conn.query('update funcionario set StatusFunc = ? where CpfFunc = ? ',['Confirmado', req.body.CpfFunc],
                    (error, resultado, fields) => {
                        conn.release();
                        if(error){ return res.json({ error: "error sql"}) } 
                        return  res.json({message: "Código confirmado"}) 
                    })
                })
            }
        )     
    })
}
/*                                                    ---------------                                                              */



/*                                                    ESQUECI SENHA FUNCIONARIO                                                               */
exports.EsqueciSenhaFunc = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.json({ message: "error sql"}) } 

        conn.query('select * from funcionario where EmailFunc = ?', [req.body.EmailFunc],
            (error, result, field)=> {
                conn.release();

                if(error){ return res.json({ message: "error sql"}) } 
                if(result.length == 0){
                    return res.json({ message: "Usuario nao encontrado"})
                }

               
                let passRandom = String(getRandomInt()) ;
                bcrypt.hash(passRandom, 10, (err, hash) =>{
                    if(err){ return res.json({ message: "erro no bcrypt" }) } 
                    mysql.getConnection((error, conn) =>{
                        conn.query(`update funcionario set SenhaFunc = ?, StatusFunc = ? where EmailFunc = ? `, [hash, 'Pendente', req.body.EmailFunc],
                        (error, resultado, field)=> {   
                            conn.release();           
                            if(error){ return res.json({ message: "error sql"}) } 

                            transporter.sendMail({
                                from: "  AgendaAnimal <atendimento@agendaanimal.com.br>",
                                to: req.body.EmailFunc,               
                                subject: "Recuperar senha",
                                text: `Faça login novamente no app com esta senha: ${passRandom}`
                            }).then(message => {
                                res.json({message:'Enviamos uma nova senha, verifique seu email' , mensagem: message})
                            }).catch(err =>{
                                res.json({ message: "nao deu"})
                            })
                        }) 
                    })
                })              
            })
    }) 
}
/*                                                    ---------------                                                              */


/*                                                    TROCA SENHA FUNCIONARIO                                                               */
exports.TrocarSenhaFunc = (req, res, next) => {       
    mysql.getConnection((error, conn) =>{
        if(error){ return res.json({ message: "error sql"}) } 

        conn.query('select * from funcionario where EmailFunc = ?', [req.body.EmailFunc],
            (error, result, field)=> {
                conn.release();
               if(error){ return res.json({ message: "error sql"}) }                
                if(result.length == 0){
                    return res.json({ message: "Usuario nao encontrado"})
                }
                bcrypt.hash(req.body.SenhaFunc, 10, (err, hash) =>{
                    if(err){ return res.json({ message: "erro no bcrypt"}) }     
                    mysql.getConnection((error, conn) =>{
                        conn.query(`update funcionario set SenhaFunc = ?, StatusFunc = ? where EmailFunc = ? `, [hash, 'Confirmado', req.body.EmailFunc],
                            (error, resultado, field)=> {        
                                conn.release();         
                                if(error){ return res.json({ message: "error sql"}) } 
                                return res.json({  message: "deu certo"})       
                        })
                    })
                })
                
            })
    }) 
}
/*                                                    ---------------                                                              */



/*                                                    BUSCAR FUNCIONARIOS                                                                 */
exports.BuscarFunc = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.json({ error: "error sql"}) } 

        conn.query('select * from funcionario where idPrest = ?', [req.funcionario.idPrest],
            (error, resultado, field)=> {
                conn.release(); 
                if(error){ return res.json({ error: "error sql"}) } 

                const response = {
                    Funcionario: resultado.map(func => {
                        return  {
                            idFunc:func.idFunc,
                            NomeFunc:func.NomeFunc,
                            EmailFunc:func.EmailFunc,
                            CpfFunc:func.CpfFunc,                           
                            AcessoFunc:func.AcessoFunc,
                            StatusFunc:func.StatusFunc,
                            HorarioFunc:func.HorarioFunc,
                            CelFunc:func.CelFunc,
                            TipoFunc:func.TipoFunc
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/*                                                    ---------------                                                              */


/*                                                    EXCLUIR FUNCIONARIO                                                               */
exports.ExcluirFunc = (req, res, next) => {       
    // mysql.getConnection((error, conn) =>{
    //     if(error){                                  //tratamento de erro da conexao
    //         return res.status(500).send({ error: error})        
    //     }       
    //     conn.query(`update funcionario set StatusFunc = ? where idFunc = ?`, ["Excluido", req.body.idFunc],
    //         (error, resultado, field)=> {                  
    //             if(error){                
    //                 return res.status(500).send({ error: error})         
    //             }
    //             return res.status(202).send({ mensagem: resultado}) //colocar aquii       
    //     })
    //     conn.release();
            
    // }) 
    mysql.getConnection((error, conn) => {
        if(error){ return res.json({ error: "error sql"}) } 
        conn.query('select * from funcionario where idFunc=?', [req.body.idFunc],
            (error, resultado, field)=> {
                conn.release();
                if(error){ return res.json({ error: "error sql"}) }
                if(resultado[0].TipoFunc == "Responsável"){
                    return res.json({ message : "Nao pode" });
                }
                mysql.getConnection((error, conn) => {
                    conn.query('delete from funcionario where idFunc=?', [req.body.idFunc],
                        (error, resultado, field)=> {
                            conn.release();
                            if(error){ return res.json({ error: "error sql"}) }
                            return res.json({ message : "deletou" });
                        })                     
                })                 
            })                                
    })
    
}
/*                                                    ---------------                                                              */

/*                                                    TROCA SENHA FUNCIONARIO                                                               */
exports.AtualizarFunc = (req, res, next) => {       
    mysql.getConnection((error, conn) =>{
        if(error){ return res.json({ error: "error sql"}) } 

        conn.query('select * from funcionario where EmailFunc = ?', [req.body.EmailFunc],
            (error, result, field)=> {
                conn.release();
                if(error){return res.json({ error:'error sql'})}
                if(result.length >= 1){
                    if(result[0].idFunc != req.body.idFunc){
                        return res.json({ message: "Ja existe Email"})
                    }                 
                }        
                mysql.getConnection((error, conn) =>{        
                conn.query('select * from funcionario where CpfFunc = ?', [req.body.CpfFunc],
                    (error, result, field)=> {
                        conn.release();
                        if(error){return res.json({ error:'error sql'})}
                        if(result.length >= 1){
                            if(result[0].idFunc != req.body.idFunc){
                                return res.json({ message: "Ja existe CPF"})
                            }                 
                        }
                        
                        if(req.body.CRMVFunc != "" || req.body.CRMVFunc != null || req.body.CRMVFunc != undefined){
                            mysql.getConnection((error, conn) =>{
                                conn.query('select * from funcionario where CRMVFunc= ?', [req.body.CRMVFunc],
                                (error, resultados, field)=> {
                                    conn.release();
                                    if(error){return res.json({ error:"error sql"})}
                                    // if(resultados.length >= 1){                            
                                    //     if(resultados[0].idFunc != req.body.idFunc){
                                    //         return res.json({ message: "Ja existe CRMV"})
                                    //     }           
                                    // }
                                    mysql.getConnection((error, conn) =>{
                                        conn.query(`update funcionario set NomeFunc = ?,EmailFunc=?,CpfFunc= ?,RecepFunc=?,VetFunc= ?,AdminFunc= ?,FinanFunc= ?,AcessoFunc= ?, CelFunc= ?, CRMVFunc = ?,DateEmiFunc=?  where idFunc = ? `, [req.body.NomeFunc,req.body.EmailFunc,req.body.CpfFunc,req.body.RecepFunc,req.body.VetFunc,req.body.AdminFunc,req.body.FinanFunc,req.body.AcessoFunc, req.body.CelFunc,req.body.CRMVFunc, req.body.DateEmiFunc,req.body.idFunc],
                                        (error, resultado, field)=> {     
                                            conn.release();            
                                            if(error){                
                                                return res.json({ error:"error sql"})         
                                            }
                                            mysql.getConnection((error, conn) =>{
                                                conn.query('select idHorarioFunc from funcionario where idFunc= ?', [req.body.idFunc],
                                                (error, resultadoPesq, field)=> {  
                                                    conn.release();               
                                                    if(error){                
                                                        return res.json({ error:"error sql"})         
                                                    }
                                                    let horario = resultadoPesq[0].idHorarioFunc;
                                                    if(req.body.SegundInicio == ''){req.body.SegundInicio = null;}
                                                    if(req.body.SegundFinal == ''){req.body.SegundFinal = null;}
                                                    if(req.body.TercaInicio == ''){req.body.TercaInicio = null;}
                                                    if(req.body.TercaFinal == ''){req.body.TercaFinal = null;}
                                                    if(req.body.QuartInicio == ''){req.body.QuartInicio = null;}
                                                    if(req.body.QuartFinal == ''){req.body.QuartFinal = null;}
                                                    if(req.body.QuintInicio == ''){req.body.QuintInicio = null;}
                                                    if(req.body.QuintFinal == ''){req.body.QuintFinal = null;}
                                                    if(req.body.SextInicio == ''){req.body.SextInicio = null;}
                                                    if(req.body.SextFinal == ''){req.body.SextFinal = null;}
                                                    if(req.body.SabInicio == ''){req.body.SabInicio = null;}
                                                    if(req.body.SabFinal == ''){req.body.SabFinal = null;}
                                                    if(req.body.DomingInicio == ''){req.body.DomingInicio = null;}
                                                    if(req.body.DomingFinal == ''){req.body.DomingFinal = null;}
                                                    mysql.getConnection((error, conn) =>{
                                                        conn.query('update horarioFunc set SegundInicio=?, SegundFinal=?, TercaInicio=?, TercaFinal=?, QuartInicio=?, QuartFinal=?, QuintInicio=?, QuintFinal=?, SextInicio=?, SextFinal=?,SabInicio=?, SabFinal=?, DomingInicio=?, DomingFinal=? where idHorarioFunc =?', [req.body.SegundInicio, req.body.SegundFinal, req.body.TercaInicio, req.body.TercaFinal, req.body.QuartInicio,req.body.QuartFinal, req.body.QuintInicio, req.body.QuintFinal, req.body.SextInicio, req.body.SextFinal, req.body.SabInicio, req.body.SabFinal, req.body.DomingInicio, req.body.DomingFinal,horario],
                                                        (error, resultHorario, field)=> {
                                                            conn.release();
                                                            if(error){ return res.json({ error: "error sql"}) } 
                                                            return res.json({ message: "Atualizado"})   
                                                        })
                                                    })
                                                })
                                            })
                                        }) 
                                    })
                                })
                            })
                        }else{
                            mysql.getConnection((error, conn) =>{
                                conn.query(`update funcionario set NomeFunc = ?,EmailFunc=?,CpfFunc= ?,RecepFunc=?,VetFunc= ?,AdminFunc= ?,FinanFunc= ?,AcessoFunc= ?, CelFunc= ? where idFunc = ? `, [req.body.NomeFunc,req.body.EmailFunc,req.body.CpfFunc,req.body.RecepFunc,req.body.VetFunc,req.body.AdminFunc,req.body.FinanFunc,req.body.AcessoFunc, req.body.CelFunc,req.body.idFunc],
                                (error, resultado, field)=> {    
                                    conn.release();             
                                    if(error){                
                                        return res.json({ error:"error sql"})         
                                    }
                                    mysql.getConnection((error, conn) =>{
                                        conn.query('select idHorarioFunc from funcionario where idFunc= ?', [req.body.idFunc],
                                        (error, resultadoPesq, field)=> { 
                                            conn.release();                
                                            if(error){                
                                                return res.json({ error:"error sql"})         
                                            }
                                            let horario = resultadoPesq[0].idHorarioFunc;
                                            mysql.getConnection((error, conn) =>{
                                                conn.query('update horarioFunc set SegundInicio=?, SegundFinal=?, TercaInicio=?, TercaFinal=?, QuartInicio=?, QuartFinal=?, QuintInicio=?, QuintFinal=?, SextInicio=?, SextFinal=?,SabInicio=?, SabFinal=?, DomingInicio=?, DomingFinal=? where idHorarioFunc =?', [req.body.SegundInicio, req.body.SegundFinal, req.body.TercaInicio, req.body.TercaFinal, req.body.QuartInicio,req.body.QuartFinal, req.body.QuintInicio, req.body.QuintFinal, req.body.SextInicio, req.body.SextFinal, req.body.SabInicio, req.body.SabFinal, req.body.DomingInicio, req.body.DomingFinal,horario],
                                                (error, resultHorario, field)=> {
                                                    conn.release();
                                                    if(error){ return res.json({ error: "error sql"}) } 
                                                    return res.json({ message: "Atualizado"})
                                                })
                                            })
                                        })   
                                    })                                 
                                })
                            })
                        }
                    })
                }) 
                
            })
    }) 
}
/*                                                    ---------------                                                              */

/*                                                    BUSCAR FUNCIONARIO                                                                 */
exports.Buscar = (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.json({ error: "Falhou"})        
        } 
        conn.query('select horarioFunc.SegundInicio as SegundInicio, horarioFunc.SegundFinal  as SegundFinal, horarioFunc.TercaInicio as TercaInicio, horarioFunc.TercaFinal as TercaFinal, horarioFunc.QuartInicio as QuartInicio, horarioFunc.QuartFinal as QuartFinal, horarioFunc.QuintInicio as QuintInicio, horarioFunc.QuintFinal as QuintFinal, horarioFunc.SextInicio as SextInicio, horarioFunc.SextFinal as SextFinal,  horarioFunc.SabInicio as SabInicio, horarioFunc.SabFinal as SabFinal, horarioFunc.DomingInicio as DomingInicio, horarioFunc.DomingFinal as DomingFinal,funcionario.* from funcionario inner join horarioFunc on horarioFunc.idHorarioFunc=  funcionario.idHorarioFunc where funcionario.idFunc = ?', [req.body.idFunc],
            (error, resultado, field)=> {
                conn.release(); 
                if(error){ return res.json({ error: "error sql"}) } 
                const response = {
                    Funcionario: resultado.map(func => {
                        return  {
                            idFunc:func.idFunc,
                            NomeFunc:func.NomeFunc,
                            EmailFunc:func.EmailFunc,
                            CpfFunc:func.CpfFunc,
                            RecepFunc:func.RecepFunc,
                            VetFunc:func.VetFunc,
                            AdminFunc:func.AdminFunc,
                            FinanFunc:func.FinanFunc,
                            AcessoFunc:func.AcessoFunc,
                            StatusFunc:func.StatusFunc,
                            CRMVFunc:func.CRMVFunc,
                            DateEmiFunc:func.DateEmiFunc,
                            CelFunc: func.CelFunc,                            
                            SegundInicio:func.SegundInicio, 
                            SegundFinal:func.SegundFinal, 
                            TercaInicio:func.TercaInicio, 
                            TercaFinal:func.TercaFinal, 
                            QuartInicio:func.QuartInicio, 
                            QuartFinal:func.QuartFinal, 
                            QuintInicio:func.QuintInicio, 
                            QuintFinal:func.QuintFinal, 
                            SextInicio:func.SextInicio, 
                            SextFinal:func.SextFinal, 
                            SabInicio:func.SabInicio, 
                            SabFinal:func.SabFinal, 
                            DomingInicio:func.DomingInicio, 
                            DomingFinal:func.DomingFinal,
                            TipoFunc:func.TipoFunc
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/*                                                    ---------------                                                              */

/*                                                    FILTRO FUNCIONARIO                                                                 */
exports.FiltroFunc = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.json({ error: "error sql"}) } 

        conn.query('select * from funcionario where EmailFunc = ?', [req.body.EmailFunc],
            (error, resultado, field)=> {
                conn.release(); 
                if(error){ return res.json({ error: "error sql"}) }          

                const response = {
                    Funcionario: resultado.map(func => {
                        return  {
                            idFunc:func.idFunc,
                            NomeFunc:func.NomeFunc,
                            EmailFunc:func.EmailFunc,
                            CpfFunc:func.CpfFunc,
                            RecepFunc:func.RecepFunc,
                            VetFunc:func.VetFunc,
                            AdminFunc:func.AdminFunc,
                            FinanFunc:func.FinanFunc,
                            AcessoFunc:func.AcessoFunc,
                            StatusFunc:func.StatusFunc,
                            HorarioFunc:func.HorarioFunc,
                            CRMVFunc:func.CRMVFunc,
                            DateEmiFunc:func.DateEmiFunc,
                            CelFunc: func.CelFunc,
                            TipoFunc:func.TipoFunc
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/*                                                    ---------------                                                              */


/*                                                    BUSCAR FUNCIONARIO  e PRESTADOR                                                              */
exports.BuscarFuncPrest = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.json({ error: "error sql"}) } 
        conn.query('select prestadores.NomeFantsPrest as nomePrest, funcionario.nomeFunc as nomeFunc from funcionario inner join prestadores on prestadores.idPrest = funcionario.idPrest where funcionario.idFunc = ?', [req.funcionario.idFunc],
            (error, resultado, field)=> { 
                conn.release(); 
                if(error){ return res.json({ error:  "error sql"}) }   

                const response = {
                    Funcionario: resultado.map(func => {
                        return  {                            
                            nomePrest:func.nomePrest,
                            nomeFunc: func.nomeFunc
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/*                                                    ---------------                                                              */
