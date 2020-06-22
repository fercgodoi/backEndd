const mysql = require('../../mysql').pool;
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uploadImage = require('../../middleware/imgPrest');

/*                                                    ENVIAR EMAIL                                                               */
let transporter = nodemailer.createTransport({
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


                        


/*                        PRIMEIRO CADASTRO  PRESTADOR                  */
exports.CadPriPrest = (req, res, next) => {       
    mysql.getConnection((error, conn) =>{
        if(error){return res.json({ error:'error sql'})}

        conn.query('select * from prestadores where CnpjPrest = ?', [req.body.CnpjPrest],
        (error, results, field)=> {
            if(error){return res.json({ error:'error sql'})}
            if(results.length > 0){
                return res.json({ message: "cnpj ja existe"})
            }

            conn.query('select * from prestadores where CelularPrest = ?', [req.body.CelularPrest],
            (error, resultado, field)=> {
                
                if(error){return res.json({ error:'error sql'})}
                if(resultado.length > 0){
                    return res.json({ message: "numero ja existe"})
                }

                conn.query('select * from prestadores where EmailPrest = ?', [req.body.EmailPrest],
                (error, result, field)=> {

                    if(error){return res.json({ error:'error sql'})}
                    if(result.length > 0){
                        return res.json({ message: "email ja existe"})
                    }  

                    let passRandom = String(getRandomInt()) ;     
                                         
                    transporter.sendMail({
                        from: "  AgendaAnimal <atendimento@agendaanimal.com.br>",
                        to: req.body.EmailPrest,               
                        subject: "Código de segurança",
                        text: `Inseria o Código para prosseguir no cadastro ${passRandom}`
                    }).then(messages => {
                        conn.query('insert into prestadores (CnpjPrest,EmailPrest,CelularPrest,StatusPrest,CodPrest) values (?,?,?,?,?)', [req.body.CnpjPrest,req.body.EmailPrest,req.body.CelularPrest,"Pendente",passRandom],
                        (error, resulta, field)=> {
                            conn.release();
                            if(error){return res.json({ error:error})}  

                            const token = jwt.sign({
                                EmailPrest: req.body.EmailPrest,
                                CodPrest: passRandom,
                                id: resulta.insertId
                            }, process.env.JWT_KEY, {
                                expiresIn:"24H"
                            });                         
                            res.json({message:'Enviado',token: token})
                        })                        
                    }).catch(err =>{
                        res.json({ error: "nao deu"})
                    }) 
                })
            })
        })        
    }) 
}
/*                                                    ---------------                                                              */

/*                        SEGUNDO CADASTRO  PRESTADOR                  */
exports.CadSegPrest = (req, res, next) => {       
    mysql.getConnection((error, conn) =>{
        if(error){return res.json({ error:'error sql'})}
        if(req.body.CodPrest != req.prestadores.CodPrest){
            return res.json({ message: 'Codigo incorreto'})  
        }

        conn.query('update prestadores set StatusPrest=? where EmailPrest= ?', ["Confirmado",req.prestadores.EmailPrest],
        (error, resulta, field)=> { 
            conn.release();
            if(error){return res.json({ error:'error sql'})}            
            return res.json({ message: "Alterado"})
        })
    })
}
/*                                ---------------                       */


/*                        TERCEIRO CADASTRO  PRESTADOR                  */
exports.CadTercPrest = (req, res, next) => {       
    mysql.getConnection((error, conn) =>{
        if(error){return res.json({ error:'error sql'})}
        conn.query('insert into horarioPrest  (SegundInicio, SegundFinal, TercaInicio, TercaFinal, QuartInicio, QuartFinal, QuintInicio, QuintFinal, SextInicio, SextFinal, SabInicio, SabFinal, DomingInicio, DomingFinal) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [req.body.SegundInicio, req.body.SegundFinal, req.body.TercaInicio, req.body.TercaFinal, req.body.QuartInicio,req.body.QuartFinal, req.body.QuintInicio, req.body.QuintFinal, req.body.SextInicio, req.body.SextFinal, req.body.SabInicio, req.body.SabFinal, req.body.DomingInicio, req.body.DomingFinal],
            (error, resultHorario, field)=> {
            if(error){ return res.json({ error: "error sql"}) }  

            let idHorarios = resultHorario.insertId; 

            conn.query('update prestadores set NomeFantsPrest=?,PetShopPrest=?,ClinicaPrest=?,PasseadorPrest=?,HotelPrest=?,CepPrest=?,descricaoPrest=?, NumPrest=?,IdHorarioPrest=?,longitude=?,latitude=? where EmailPrest= ?', [req.body.NomeFantsPrest,req.body.PetShopPrest,req.body.ClinicaPrest,req.body.PasseadorPrest,req.body.HotelPrest,req.body.CepPrest,req.body.descricaoPrest,req.body.NumPrest,idHorarios,req.body.longitude,req.body.latitude,req.prestadores.EmailPrest],
            (error, resulta, field)=> {
                conn.release(); 
                if(error){return res.json({ error:"error sql"})}            
                return res.json({ message: "Alterado"})
            })
        })
    })
}
/*                                ---------------                       */


/*                        QUARTO CADASTRO  PRESTADOR                  */
exports.CadQuartPrest = (req, res, next) => {       
    mysql.getConnection((error, conn) =>{
        if(error){return res.json({ error:'error sql'})}

        conn.query('insert into servico (idPrest,AcumpunturaServ,AdestramentoServ,AnestesiaoServ,BanhoServ,CastracaoServ,CirurgiaoServ,ClinicaVetServ,ConsultasEspecificasoServ,ConsultasGeraisoServ,CorteUnhaServ,CrecheServ,CremacaoServ,DogWalkerServ,EscaDentServ,EutanasiaServ,ExamesImagemServ,ExamesParasitologicoServ,ExamesSangueServ,HemoterapiaoServ,HidracaoServ,HospedagemServ,HotelServ,IogaServ,NatacaoServ,PetSitterServ,RadiologiaoServ,RemocaoServ,SepultamentoServ,TaxiDogServ,TinturaPelaServ,TosaServ,TransfusaoSangueoServ,TransporteServ,VacinaServ,VendaAnimalServ,VendaServ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [req.prestadores.id,req.body.AcumpunturaServ,req.body.AdestramentoServ,req.body.AnestesiaoServ,req.body.BanhoServ,req.body.CastracaoServ,req.body.CirurgiaoServ,req.body.ClinicaVetServ,req.body.ConsultasEspecificasoServ,req.body.ConsultasGeraisoServ,req.body.CorteUnhaServ,req.body.CrecheServ,req.body.CremacaoServ,req.body.DogWalkerServ,req.body.EscaDentServ,req.body.EutanasiaServ,req.body.ExamesImagemServ,req.body.ExamesParasitologicoServ,req.body.ExamesSangueServ,req.body.HemoterapiaoServ,req.body.HidracaoServ,req.body.HospedagemServ,req.body.HotelServ,req.body.IogaServ,req.body.NatacaoServ,req.body.PetSitterServ,req.body.RadiologiaoServ,req.body.RemocaoServ,req.body.SepultamentoServ,req.body.TaxiDogServ,req.body.TinturaPelaServ,req.body.TosaServ,req.body.TransfusaoSangueoServ,req.body.TransporteServ,req.body.VacinaServ,req.body.VendaAnimalServ,req.body.VendaServ],
        (error, resulta, field)=> { 
            conn.release();
            if(error){return res.json({ error:'error sql'})}  
            var id = resulta.insertId;  

            conn.query('update prestadores set idServ=? where EmailPrest= ?', [id,req.prestadores.EmailPrest],
            (error, results, field)=> { 
                if(error){return res.json({ error:'error sql'})}            
                return res.json({ message: "Alterado"})
            })       
        })
    })
}
/*                                ---------------                       */




/*                        CINCO CADASTRO  PRESTADOR                  */
exports.CadCincoPrest = (req, res, next) => {      
    /*                                CADASTRO DA IMAGEM                       */   
    uploadImage.upload(req, res, function (err) {

    // if(req.file){
        console.log( req.fileFiltImgResp)
        if (err instanceof multer.MulterError) {
            if(err.message == 'File too large'){
                err.message = 'Arquivo maior que 5MB'
            }
            return res.json({err:'error multer', message: err.message})
        
        } else if (err) {
            return res.json({err: err, message:'error ao enviar imagem'})
        } else if (req.fileFiltImgResp === 'fail'){
            //resp += ' '+ req.fileFiltImgResp
            return res.json({ message: req.respError, msg:'error up img' })
        } else if(req.fileFiltImgResp === 'ok') {
            console.log(req.file.path)
            req.imagem = req.file.path
            // funcSql()

            mysql.getConnection((error, conn) =>{
                if(error){return res.json({ error:'error sql'})}
        
                conn.query('insert into conta (idPrest,ContaCont,BancoCont,AgenciaCont,TipoCont,CartCont,CieloCont) values (?,?,?,?,?,?,?)', [req.prestadores.id,req.body.ContaCont,req.body.BancoCont,req.body.AgenciaCont,req.body.TipoCont,req.body.CartCont,req.body.CieloCont],
                (error, resulta, field)=> { 
                    conn.release();
                    if(error){return res.json({ error:'error sql'})}  
                    var id = resulta.insertId; 
        
                    conn.query('update prestadores set idCont=?,EmergenciaPrest=?,LogoPrest=?,OngPrest=? where EmailPrest= ?', [id,req.body.EmergenciaPrest,req.imagem,req.body.OngPrest,req.prestadores.EmailPrest],
                    (error, results, field)=> { 
                        if(error){return res.json({ error:error})}            
                        return res.json({ message: "Alterado"})
                    })       
                })
            })

            // //Provavel por aqui o middleware do sharp e colocar o funcsql() apos essa func do sharp
            // compressImg.compressImage(req.file)
            // .then(newPath => {
            //     console.log("Upload e compressão realizados com sucesso! O novo caminho é:" +newPath );
            //     req.imagem = newPath;
            //     //funcSql();
            //     CadCincoPrest();
            // })
            // .catch(err => {
            //     return res.json({ err: err, msg:'error server resize' })
            // });

        } else {
            return res.json({ err: err, msg:'tipo errado' })
        } 
    });  
//     mysql.getConnection((error, conn) =>{
//         if(error){return res.json({ error:'error sql'})}

//         conn.query('insert into conta (idPrest,ContaCont,BancoCont,AgenciaCont,TipoCont,CartCont,CieloCont) values (?,?,?,?,?,?,?)', [req.prestadores.id,req.body.ContaCont,req.body.BancoCont,req.body.AgenciaCont,req.body.TipoCont,req.body.CartCont,req.body.CieloCont],
//         (error, resulta, field)=> { 
//             conn.release();
//             if(error){return res.json({ error:'error sql'})}  
//             var id = resulta.insertId; 

//             conn.query('update prestadores set idCont=?,EmergenciaPrest=?,LogoPrest=?,OngPrest=? where EmailPrest= ?', [id,req.body.EmergenciaPrest,req.imagem,req.body.OngPrest,req.prestadores.EmailPrest],
//             (error, results, field)=> { 
//                 if(error){return res.json({ error:error})}            
//                 return res.json({ message: "Alterado"})
//             })       
//         })
//     })
}
/*                                ---------------                       */


/*                        SEIS CADASTRO  PRESTADOR                  */
exports.CadSeisPrest = (req, res, next) => {       
    mysql.getConnection((error, conn) =>{
        if(error){return res.json({ error:'error sql'})}

        conn.query('insert into responsavel(idPrest,NomeResp,CpfResp,CelResp,VetResp,CRMVResp,DataEmiResp)values(?,?,?,?,?,?,?,?)',[req.prestadores.id,req.body.NomeResp,req.body.CpfResp,req.body.CelResp,req.body.VetResp,req.body.CRMVResp,req.body.DataEmiResp],
        (error, resulta, field)=> { 
            conn.release();
            if(error){return res.json({ error:'error sql'})} 
            if(result.length >= 1){
                if(result[0].CpfResp == req.body.CpfResp){
                    return res.json({ message: "Ja existe CPF"})
                }         
            } 

            var id = resulta.insertId;  
            conn.query('update prestadores set IdResp=? where EmailPrest= ?', [id,req.prestadores.EmailPrest],
            (error, results, field)=> { 
                if(error){return res.json({ error:'error sql'})}             
                return res.json({ message: "Alterado"})
            })       
        })
    })
}
/*                                ---------------                       */


/*                        SETE CADASTRO  PRESTADOR                  */
exports.CadSetePrest = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.json({ error: 'error sql'})        
        } 
        conn.query('select * from funcionario where EmailFunc = ? or CpfFunc = ?', [req.body.EmailFunc,req.body.CpfFunc],
        (error, result, field)=> {
            conn.release();
            if(error){return res.json({ error:'error sql'})}
            if(result.length >= 1){
                if(result[0].EmailFunc == req.body.EmailFunc){
                    return res.json({ message: "Ja existe Email"})
                }
                if(result[0].CpfFunc == req.body.CpfFunc){
                    return res.json({ message: "Ja existe CPF"})
                }         
            }


            conn.query('insert into horarioFunc (SegundInicio, SegundFinal, TercaInicio, TercaFinal, QuartInicio, QuartFinal, QuintInicio, QuintFinal, SextInicio, SextFinal, SabInicio, SabFinal, DomingInicio, DomingFinal) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [req.body.SegundInicio, req.body.SegundFinal, req.body.TercaInicio, req.body.TercaFinal, req.body.QuartInicio,req.body.QuartFinal, req.body.QuintInicio, req.body.QuintFinal, req.body.SextInicio, req.body.SextFinal, req.body.SabInicio, req.body.SabFinal, req.body.DomingInicio, req.body.DomingFinal],
            (error, resultHorario, field)=> {
                if(error){return res.json({ error:'error sql'})}      

                let idHorarios = resultHorario.insertId; 
                console.log(idHorarios);
                    if(req.body.CRMVFunc != "" && req.body.CRMVFunc != null && req.body.CRMVFunc != undefined)
                    {
                        conn.query('select * from funcionario where CRMVFunc= ?', [req.body.CRMVFunc],
                        (error, result, field)=> {
                            if(error){return res.json({ error:'error sql'})}  
                            if(result.length >= 1){
                                if(result[0].CRMVFunc == req.body.CRMVFunc){
                                    return res.json({ message: "Ja existe CRMV"})
                                }           
                            }                      

                            let passRandom = getRandomInt();
                            let timeCodFunc = Date.now();
                            let senha = "123456";
                            bcrypt.hash(senha, 10, (errBcrypt, hash) =>{
                                if(errBcrypt){ return res.json({ error: 'error sql' }) }
                                conn.query('insert into funcionario(idPrest,idHorarioFunc,CelFunc, NomeFunc,EmailFunc,CpfFunc,RecepFunc ,VetFunc,AdminFunc ,FinanFunc ,AcessoFunc ,StatusFunc , SenhaFunc,TimeFunc,CodFunc,CRMVFunc,DateEmiFunc) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                    [req.prestadores.id,idHorarios,req.body.CelFunc,req.body.NomeFunc,req.body.EmailFunc,req.body.CpfFunc,req.body.RecepFunc,req.body.VetFunc,req.body.AdminFunc,req.body.FinanFunc,"1111","Confirmado",hash,timeCodFunc,passRandom,req.body.CRMVFunc, req.body.DateEmiFunc],
                                    (error, resultado, field)=> { 
                                        if(error){return res.json({ error:'error sql'})}  

                                        transporter.sendMail({
                                            from: "  AgendaAnimal <atendimento@agendaanimal.com.br>",
                                            to: req.body.EmailFunc,              
                                            subject: "Senha AgendaAnimal",
                                            text: `Faça login novamente no site com esta senha: ${senha} e seu código é ${passRandom}`
                                        }).then(message => {
                                            return res.json({ message: 'Cadastrado'})
                                        }).catch(err =>{
                                            return res.json({ error : "error"})
                                        })                                    
                                    }
                                )
                                
                            }) 

                            
                        })
                    }
                    else{
                        let passRandom = getRandomInt();
                        let timeCodFunc = Date.now();
                        let senha = "123456";
                        bcrypt.hash(senha, 10, (errBcrypt, hash) =>{
                            if(errBcrypt){ return res.json({ error: 'error sql' }) }
                            conn.query('insert into funcionario(idPrest,idHorarioFunc, CelFunc, NomeFunc,EmailFunc,CpfFunc,RecepFunc ,VetFunc,AdminFunc ,FinanFunc ,AcessoFunc ,StatusFunc , SenhaFunc,TimeFunc,CodFunc) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                            [req.prestadores.id,idHorarios,req.body.CelFunc,req.body.NomeFunc,req.body.EmailFunc,req.body.CpfFunc,req.body.RecepFunc,req.body.VetFunc,req.body.AdminFunc,req.body.FinanFunc,req.body.AcessoFunc,"Confirmado",hash,timeCodFunc,passRandom],
                            (error, resultado, field)=> {
                                if(error){return res.json({ error:'error sql'})}  
                                    
                                transporter.sendMail({
                                    from: "  AgendaAnimal <atendimento@agendaanimal.com.br>",
                                    to: req.body.EmailFunc,              
                                    subject: "Senha AgendaAnimal",
                                    text: `Faça login novamente no site com esta senha: ${senha} e seu código é ${passRandom}`
                                }).then(message => {
                                    return res.json({ message: 'Cadastrado'})
                                }).catch(err =>{
                                    return res.json({ error : "error"})
                                })                                   
                            }) 
                        })            
                    } 
                                                
            })      
         })
    })
}
/*                                ---------------                       */



