const mysql = require('../../mysql').pool;
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uploadImage = require('../../middleware/imgPrest');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const filterImg = require('../../middleware/sharp');

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

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME ,
    api_key: process.env.CLOUDINARY_KEY ,
    api_secret: process.env.CLOUDINARY_SECRET
});

/*                                                       GERAR CODIGO                                                                  */
function getRandomInt() { return Math.floor(Math.random() * (999999 - 100000)) + 100000; }
/*                                                    ---------------                                                              */

/*                        PRIMEIRO CADASTRO  PRESTADOR                  */
exports.BuscaPrest2 = (req, res, next) => {       
    mysql.getConnection((error, conn) =>{
        if(error){return res.json({ error:'error sql'})}

        conn.query('select * from prestadores where idPrest = ?', [req.funcionario.idPrest],
        (error, results, field)=> {
            conn.release(); 
            if(error){return res.json({ error:'error sql'})}

            const response = {
                Prestadores: results.map(prest => {
                    return{
                        fotoPrest: prest.LogoPrest,
                        NomeFantsPrest: prest.NomeFantsPrest,
                        PetShopPrest: prest.PetShopPrest,
                        ClinicaPrest: prest.ClinicaPrest,
                        OngPrest: prest.OngPrest,
                        PasseadorPrest: prest.PasseadorPrest,
                        HotelPrest: prest.HotelPrest
                    }
                })
            }

            return res.json({ response})
            
        })
    })
}

                        


/*                        PRIMEIRO CADASTRO  PRESTADOR                  */
exports.CadPriPrest = (req, res, next) => {       
    mysql.getConnection((error, conn) =>{
        if(error){return res.json({ error:'error sql'})}

        conn.query('select * from prestadores where CnpjPrest = ?', [req.body.CnpjPrest],
        (error, results, field)=> {
            conn.release(); 
            if(error){return res.json({ error:'error sql'})}
            if(results.length > 0){
                return res.json({ message: "cnpj ja existe"})
            }
            mysql.getConnection((error, conn) => {
            conn.query('select * from prestadores where CelularPrest = ?', [req.body.CelularPrest],
            (error, resultado, field)=> {
                conn.release(); 
                if(error){return res.json({ error:'error sql'})}
                if(resultado.length > 0){
                    return res.json({ message: "numero ja existe"})
                }

                mysql.getConnection((error, conn) => {
                conn.query('select * from prestadores where EmailPrest = ?', [req.body.EmailPrest],
                (error, result, field)=> {
                    conn.release(); 
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
                        mysql.getConnection((error, conn) => {
                            conn.query('insert into prestadores (CnpjPrest,EmailPrest,CelularPrest,StatusPrest,CodPrest,WhatsPrest) values (?,?,?,?,?,?)', [req.body.CnpjPrest,req.body.EmailPrest,req.body.CelularPrest,"Pendente",passRandom,req.body.WhatsPrest],
                            (error, resulta, field)=> {
                                conn.release();
                                if(error){return res.json({ error:'error sql'})}  
                                const token = jwt.sign({
                                    EmailPrest: req.body.EmailPrest,
                                    CodPrest: passRandom,
                                    id: resulta.insertId
                                }, process.env.JWT_KEY, {
                                    expiresIn:"24H"
                                });                         
                                res.json({message:'Enviado',token: token})
                            })     
                        })                   
                    }).catch(err =>{
                        res.json({ error: "nao deu"})
                    }) 
                })
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

        conn.query('update prestadores set StatusPrest=? where EmailPrest= ?', ["Incompleto",req.prestadores.EmailPrest],
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
        conn.query('insert into horarioPrest  (SegundInicio, SegundFinal, TercaInicio, TercaFinal, QuartInicio, QuartFinal, QuintInicio, QuintFinal, SextInicio, SextFinal, SabInicio, SabFinal, DomingInicio, DomingFinal) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [req.body.SegundInicio, req.body.SegundFinal, req.body.TercaInicio, req.body.TercaFinal, req.body.QuartInicio,req.body.QuartFinal, req.body.QuintInicio, req.body.QuintFinal, req.body.SextInicio, req.body.SextFinal, req.body.SabInicio, req.body.SabFinal, req.body.DomingInicio, req.body.DomingFinal],
            (error, resultHorario, field)=> {
            conn.release(); 
            if(error){ return res.json({ error: "error sql"}) }  

            let idHorarios = resultHorario.insertId; 
            mysql.getConnection((error, conn) => {
                conn.query('update prestadores set NomeFantsPrest=?,PetShopPrest=?,ClinicaPrest=?,PasseadorPrest=?,HotelPrest=?,CepPrest=?,descricaoPrest=?, NumPrest=?,IdHorarioPrest=?,longitude=?,latitude=? where EmailPrest= ?', [req.body.NomeFantsPrest,req.body.PetShopPrest,req.body.ClinicaPrest,req.body.PasseadorPrest,req.body.HotelPrest,req.body.CepPrest,req.body.descricaoPrest,req.body.NumPrest,idHorarios,req.body.longitude,req.body.latitude,req.prestadores.EmailPrest],
                (error, resulta, field)=> {
                    conn.release(); 
                    if(error){return res.json({ error:"error sql"})}            
                    return res.json({ message: "Alterado"})
                })
            })
        })
    })
}
/*                                ---------------                       */


/*                        QUARTO CADASTRO  PRESTADOR                  */
exports.CadQuartPrest = (req, res, next) => {       
    mysql.getConnection((error, conn) =>{
        if(error){return res.json({ error:'error sql'})}
        conn.query('select * from servico where idPrest=? and tipoServ=?', [req.prestadores.id,req.body.tipoServ],
        (error, results, field)=> {
            conn.release(); 
            if(error){return res.json({ error:'error sql'})}
            if(results.length > 0){
                return res.json({ message: "ja existe"})
            }

            mysql.getConnection((error, conn) => {
                conn.query('insert into servico (tipoServ,valorServ,idPrest) values (?,?,?)',[req.body.tipoServ,req.body.valorServ,req.prestadores.id],
                (error, resulta, field)=> { 
                    conn.release();
                    if(error){return res.json({ error:'error sql'})}  
                    return res.json({ message:'Salvo'});
                    // var id = resulta.insertId;  

                    // conn.query('update prestadores set idServ=? where EmailPrest= ?', [id,req.prestadores.EmailPrest],
                    // (error, results, field)=> { 
                    //     if(error){return res.json({ error:'error sql'})}            
                    //     return res.json({ message: "Alterado"})
                    // }
                })
            })       
        })
    })
}
/*                                ---------------                       */




/*                        CINCO CADASTRO  PRESTADOR                  */
exports.CadCincoPrest = (req, res, next) => {      
     console.log(req.body);
    /*                                CADASTRO DA IMAGEM                       */   
    uploadImage.upload(req, res, function (err) {
        console.log("entrou no controller")
        console.log(req.fileFiltImgResp)
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
            filterImg.compressImage(req.file).then(newPath => {  
                   
                cloudinary.uploader.upload(newPath, function(err, result){

                    if(err){ return res.json({ error: err, message:'falha ao enviar imagem'}) }
            
                    if(result){
                        console.log(result.secure_url);
                        //return res.status(200).send({ resp: result, message: 'upload concluido'})
                        req.imagem = result.secure_url
                        funcSql() 
                    }
                })
            }).catch(err => {
                return res.json({ err: err, message:'error server resize' })
            });
        }

            // console.log(req.file.path)
            // req.imagem = req.file.path
            // funcSql()
            //return res.json({ message: 'salvoou' , msg: req.file.path })
        
    })

    function funcSql(){
        mysql.getConnection((error, conn) =>{
            if(error){return res.json({ error:'error sql'})}
    
            conn.query('insert into conta (idPrest,ContaCont,BancoCont,AgenciaCont,TipoCont,CartCont,CieloCont) values (?,?,?,?,?,?,?)', [req.prestadores.id,req.body.ContaCont,req.body.BancoCont,req.body.AgenciaCont,req.body.TipoCont,req.body.CartCont,req.body.CieloCont],
            (error, resulta, field)=> { 
                conn.release();
                if(error){return res.json({ error:'error sql'})}  
                let id = resulta.insertId; 
                mysql.getConnection((error, conn) => {
                    conn.query('update prestadores set idCont=?,EmergenciaPrest=?,LogoPrest=?,OngPrest=? where EmailPrest= ?', [id,req.body.EmergenciaPrest,req.imagem,req.body.OngPrest,req.prestadores.EmailPrest],
                    (error, results, field)=> { 
                        conn.release();
                        if(error){return res.json({ error:error})}            
                        return res.json({ message: "Alterado"})
                    }) 
                })      
            })
        })
    }  

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

        // } else {
        //     return res.json({ err: err, msg:'tipo errado' })
        // } 
    // });  
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
// exports.CadSeisPrest = (req, res, next) => {       
//     mysql.getConnection((error, conn) =>{
//         if(error){return res.json({ error:'error sql'})}
//         conn.query('select * from responsavel where CpfResp = ? and CelResp= ?', [req.body.CpfResp,req.body.CelResp],
//         (error, result, field)=> {
//             conn.release();
//             if(error){return res.json({ error:'error sql'})}
//             if(result.length >= 1){
//                 if(result[0].CpfFunc == req.body.CpfFunc){
//                     return res.json({ message: "Ja existe CPF"})
//                 }      
//                 if(result[0].CelResp == req.body.CelResp){
//                     return res.json({ message: "Ja existe Numero"})
//                 }     
//             }
//             mysql.getConnection((error, conn) =>{
//                 conn.query('select * from responsavel where ', [req.body.CelResp],
//                 (error, result, field)=> {
//                     conn.release();
//                     if(error){return res.json({ error:'error sql'})}
//                     if(result.length >= 1){
//                         if(result[0].CelResp == req.body.CelResp){
//                             return res.json({ message: "Ja existe Numero"})
//                         }         
//                     }
//                     mysql.getConnection((error, conn) => {
//                         conn.query('insert into responsavel(idPrest,NomeResp,CpfResp,CelResp)values(?,?,?,?)',[req.prestadores.id,req.body.NomeResp,req.body.CpfResp,req.body.CelResp],
//                         (error, resulta, field)=> { conn.release();
//                             if(error){return res.json({ error: 'error sql'})} 

//                             var id = resulta.insertId;  

//                             mysql.getConnection((error, conn) => {
//                                 conn.query('update prestadores set IdResp=? where EmailPrest= ?', [id,req.prestadores.EmailPrest],
//                                 (error, results, field)=> {
//                                     conn.release(); 
//                                     if(error){return res.json({ error:'error sql'})}             
//                                     return res.json({ message: "Alterado"})
//                                 })   
//                             })   
//                         })
//                     })
//                 })
//             })
//         })
//     })
// }
/*                                ---------------                       */


/*                        SETE CADASTRO  PRESTADOR                  */
exports.CadSetePrest = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'error sql'})} 

        if(req.body.ButtonValor === "Sim"){req.body.EmailFunc = req.prestadores.EmailPrest}

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

            mysql.getConnection((error, conn) => {
                conn.query('select * from responsavel where CpfResp = ? or CelResp= ?', [req.body.CpfFunc,req.body.CelFunc],
                (error, result, field)=> {
                    conn.release();
                    if(error){return res.json({ error:'error sql'})}
                    if(result.length >= 1){
                        if(result[0].CpfResp == req.body.CpfFunc){
                            return res.json({ message: "Ja existe CPF"})
                        }      
                        if(result[0].CelResp == req.body.CelResp){
                            return res.json({ message: "Ja existe Numero"})
                        }     
                    }

                    mysql.getConnection((error, conn) => {
                        conn.query('insert into responsavel(idPrest,NomeResp,CpfResp,CelResp)values(?,?,?,?)',[req.prestadores.id,req.body.NomeFunc,req.body.CpfFunc,req.body.CelFunc],
                        (error, resulta, field)=> { 
                            conn.release();
                            if(error){return res.json({ error: 'error sql'})} 

                            var ids = resulta.insertId;  

                            mysql.getConnection((error, conn) => {
                                conn.query('update prestadores set IdResp=? where EmailPrest= ?', [ids,req.prestadores.EmailPrest],
                                (error, results, field)=> {
                                    conn.release(); 
                                    if(error){return res.json({ error:'error sql'})}   
                                
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
                                            if(error){return res.json({ error:'error sql'})}      

                                            let idHorarios = resultHorario.insertId; 
                                                if(req.body.CRMVFunc != "" && req.body.CRMVFunc != null && req.body.CRMVFunc != undefined)
                                                {
                                                    mysql.getConnection((error, conn) => {
                                                        conn.query('select * from funcionario where CRMVFunc= ?', [req.body.CRMVFunc],
                                                        (error, result, field)=> {
                                                            conn.release();
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

                                                                transporter.sendMail({
                                                                    from: "  AgendaAnimal <atendimento@agendaanimal.com.br>",
                                                                    to: req.body.EmailFunc,              
                                                                    subject: "Senha AgendaAnimal",
                                                                    text: `Faça login novamente no site com esta senha: ${senha} e seu código é ${passRandom}`
                                                                }).then(message => {
                                                                    mysql.getConnection((error, conn) => {
                                                                        conn.query('insert into funcionario(idPrest,idHorarioFunc,CelFunc, NomeFunc,EmailFunc,CpfFunc,RecepFunc ,VetFunc,AdminFunc ,FinanFunc ,AcessoFunc ,StatusFunc , SenhaFunc,TimeFunc,CodFunc,CRMVFunc,DateEmiFunc,TipoFunc) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                                                            [req.prestadores.id,idHorarios,req.body.CelFunc,req.body.NomeFunc,req.body.EmailFunc,req.body.CpfFunc,req.body.RecepFunc,req.body.VetFunc,req.body.AdminFunc,req.body.FinanFunc,"1111","Confirmado",hash,timeCodFunc,passRandom,req.body.CRMVFunc, req.body.DateEmiFunc,"Responsável"],
                                                                            (error, resultado, field)=> { 
                                                                                conn.release();
                                                                                if(error){return res.json({ error:'error sql'})}  

                                                                                mysql.getConnection((error, conn) => {
                                                                                    conn.query('update prestadores set StatusPrest=? where EmailPrest= ?', ["Completo",req.prestadores.EmailPrest],
                                                                                    (error, results, field)=> {
                                                                                        conn.release(); 
                                                                                        if(error){return res.json({ error:'error sql'})}             
                                                                                        return res.json({ message: 'Cadastrado'})
                                                                                    })   
                                                                                }) 
                                                                        })
                                                                    })                                                         
                                                                }).catch(err =>{
                                                                    return res.json({ error : "error"})
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
                                                        if(errBcrypt){ return res.json({ error: 'error sql' }) }
                                                            transporter.sendMail({
                                                                    from: "  AgendaAnimal <atendimento@agendaanimal.com.br>",
                                                                    to: req.body.EmailFunc,              
                                                                    subject: "Senha AgendaAnimal",
                                                                    text: `Faça login novamente no site com esta senha: ${senha} e seu código é ${passRandom}`
                                                                }).then(message => {
                                                                    mysql.getConnection((error, conn) => {
                                                                        conn.query('insert into funcionario(idPrest,idHorarioFunc, CelFunc, NomeFunc,EmailFunc,CpfFunc,RecepFunc ,VetFunc,AdminFunc ,FinanFunc ,StatusFunc , SenhaFunc,TimeFunc,CodFunc,TipoFunc,AcessoFunc) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                                                        [req.prestadores.id,idHorarios,req.body.CelFunc,req.body.NomeFunc,req.body.EmailFunc,req.body.CpfFunc,req.body.RecepFunc,req.body.VetFunc,req.body.AdminFunc,req.body.FinanFunc,"Confirmado",hash,timeCodFunc,passRandom,"Responsável","1111"],
                                                                        (error, resultado, field)=> {
                                                                            conn.release();
                                                                            if(error){return res.json({ error:'error sql'})}                                              
                                                        
                                                                            mysql.getConnection((error, conn) => {
                                                                                conn.query('update prestadores set StatusPrest=? where EmailPrest= ?', ["Completo",req.prestadores.EmailPrest],
                                                                                (error, results, field)=> {
                                                                                    conn.release(); 
                                                                                    if(error){return res.json({ error:'error sql'})}             
                                                                                    return res.json({ message: 'Cadastrado'})
                                                                                })   
                                                                            })  
                                                                        })
                                                                    })  
                                                                }).catch(err =>{
                                                                    return res.json({ error : "error"})
                                                                })                                   
                                                    })        
                                                } 
                                            })
                                    })
    
                                })
                            }) 
                        })
                    })       
                })
            })     
         })
    })
}
/*                                ---------------                       */

//////////////////////////////////////////// BUSCAR DADOS //////////////////////////////////////////////
exports.BuscaPrest = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'error sql'})} 

        conn.query('select conta.*, horarioPrest.*, prestadores.*,responsavel.*,funcionario.EmailFunc from prestadores inner join conta on conta.idCont = prestadores.idCont inner join horarioPrest on horarioPrest.idHorarioPrest = prestadores.idHorarioPrest inner join responsavel on responsavel.idResp = prestadores.idResp inner join funcionario on funcionario.idPrest = prestadores.idPrest where prestadores.idPrest=?', [req.funcionario.idPrest],
        (error, result, field)=> {
            conn.release();
            if(error){return res.json({ error:'error sql'})}

            const response = {
                Prestadores: result.map(prest => {
                    return  {
                        ContaCont: prest.ContaCont ,
                        BancoCont: prest.BancoCont ,
                        AgenciaCont: prest.AgenciaCont ,
                        TipoCont: prest.TipoCont ,
                        CartCont: prest.CartCont ,
                        CieloCont: prest.CieloCont ,
                        SegundInicio: prest.SegundInicio ,
                        SegundFinal: prest.SegundFinal ,
                        TercaInicio: prest.TercaInicio ,
                        TercaFinal: prest.TercaFinal ,
                        QuartInicio: prest.QuartInicio ,
                        QuartFinal: prest.QuartFinal ,
                        QuintInicio: prest.QuintInicio ,
                        QuintFinal: prest.QuintFinal ,
                        SextInicio: prest.SextInicio ,
                        SextFinal: prest.SextFinal ,
                        SabInicio: prest.SabInicio ,
                        SabFinal: prest.SabFinal ,
                        DomingInicio: prest.DomingInicio ,
                        DomingFinal: prest.DomingFinal ,
                        NomeFantsPrest: prest.NomeFantsPrest ,
                        CnpjPrest: prest.CnpjPrest ,
                        CelularPrest: prest.CelularPrest ,
                        WhatsPrest: prest.WhatsPrest ,
                        EmailPrest: prest.EmailPrest ,
                        CepPrest: prest.CepPrest ,
                        NumPrest: prest.NumPrest ,
                        EmergenciaPrest: prest.EmergenciaPrest ,
                        descricaoPrest: prest.descricaoPrest ,
                        longitude: prest.longitude ,
                        latitude: prest.latitude ,
                        PetShopPrest: prest.PetShopPrest ,
                        ClinicaPrest: prest.ClinicaPrest ,
                        OngPrest: prest.OngPrest ,
                        PasseadorPrest: prest.PasseadorPrest ,
                        HotelPrest: prest.HotelPrest ,
                        NomeResp: prest.NomeResp ,
                        CpfResp: prest.CpfResp ,
                        CelResp: prest.CelResp,
                        EmailFunc: prest.EmailFunc,
                        idResp: prest.IdResp,
                        idHorarioPrest: prest.idHorarioPrest,
                        idConta: prest.idConta,
                        idFunc: prest.idFunc
                    };
                })
            };

            return res.json({ response });
            // var cpf = result[0].CpfResp;

            // mysql.getConnection((error, conn) => {        
            //     conn.query('select EmailFunc from funcionario where CpfFunc = ?', [cpf],
            //     (error, resulta, field)=> {
            //         conn.release();
            //         if(error){return res.json({ error:'error sql'})}

            //         var emailFunc= resulta[0].EmailFunc;
            //         return res.json(response, emailFunc);

            //     })
            // })
        })
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////// BUSCAR SERVIÇOS //////////////////////////////////////////////
exports.BuscaServicosPrest = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'error sql'})} 

        conn.query('select * from servico where idPrest=?', [req.funcionario.idPrest],
        (error, result, field)=> {
            conn.release();
            if(error){return res.json({ error:'error sql'})}

            const response = {
                Servicos: result.map(serv => {
                    return  {
                        idServ: serv.idServ ,
                        tipoServ: serv.tipoServ ,
                        valorServ: serv.valorServ ,
                    };
                })
            };

            return res.json({ response });
        })
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////// EDITAR SERVIÇOS //////////////////////////////////////////////
exports.EditarServicosPrest = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'error sql'})} 

        conn.query('update servico set tipoServ=?, valorServ=? where idServ=?;', [req.body.tipoServ,req.body.valorServ,req.body.idServ],
        (error, result, field)=> {
            conn.release();
            if(error){return res.json({ error:'error sql'})}

            return res.json({ message: "alterado" });
        })
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////// EXLUIR SERVIÇOS //////////////////////////////////////////////
exports.ExcluirServicosPrest = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'error sql'})} 

        conn.query('delete from servico where idServ=?;', [req.body.idServ],
        (error, result, field)=> {
            conn.release();
            if(error){return res.json({ error:'error sql'})}

            return res.json({ message: "excluido" });
        })
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////// ALTERAR PRESTADORES //////////////////////////////////////////////
exports.EditarPrest = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'error sql'})} 

        conn.query('update conta set ContaCont=?,BancoCont=?,AgenciaCont=?,TipoCont=?,CartCont=?,CieloCont=? where idCont =? and idPrest=?', 
        [req.body.ContaCont,req.body.BancoCont,req.body.AgenciaCont,req.body.TipoCont,req.body.CartCont,req.body.CieloCont,req.body.idCont,req.funcionario.idPrest],
        (error, result, field)=> {
            conn.release();
            if(error){return res.json({ error:error})}

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
                conn.query('update horarioPrest set SegundInicio=?,SegundFinal=?,TercaInicio=?,TercaFinal=?,QuartInicio=?,QuartFinal=?,QuintInicio=?,QuintFinal=?,SextInicio=?,SextFinal=?,SabInicio=?,SabFinal=?,DomingInicio=?,DomingFinal=? where idHorarioPrest =?', 
                [req.body.SegundInicio,req.body.SegundFinal,req.body.TercaInicio,req.body.TercaFinal,req.body.QuartInicio,req.body.QuartFinal,req.body.QuintInicio,req.body.QuintFinal,req.body.SextInicio,req.body.SextFinal,req.body.SabInicio,req.body.SabFinal,req.body.DomingInicio,req.body.DomingFinal,req.body.idHorarioPrest],
                (error, result, field)=> {
                    conn.release();
                    if(error){return res.json({ error:error})}

                    mysql.getConnection((error, conn) => {
                        conn.query('update prestadores set NomeFantsPrest=?,CelularPrest=?,WhatsPrest=?,EmailPrest=?,CepPrest=?,NumPrest=?,EmergenciaPrest=?,descricaoPrest=?,longitude=?,latitude=?,PetShopPrest=?,ClinicaPrest=?,OngPrest=?,PasseadorPrest=?,HotelPrest=? and idPrest=?', 
                        [req.body.NomeFantsPrest,req.body.CelularPrest,req.body.WhatsPrest,req.body.EmailPrest,req.body.CepPrest,req.body.NumPrest,req.body.EmergenciaPrest,req.body.descricaoPrest,req.body.longitude,req.body.latitude,req.body.PetShopPrest,req.body.ClinicaPrest,req.body.OngPrest,req.body.PasseadorPrest,req.body.HotelPrest,req.funcionario.idPrest],
                        (error, result, field)=> {
                            conn.release();
                            if(error){return res.json({ error:error})}

                            // console.log( [req.body.NomeResp,req.body.CpfResp,req.body.CelResp,req.body.idResp,req.funcionario.idPrest]);
                            mysql.getConnection((error, conn) => {
                                conn.query('update responsavel set NomeResp=?,CpfResp=?,CelResp=? where IdResp=? and idPrest=?', 
                                [req.body.NomeResp,req.body.CpfResp,req.body.CelResp,req.body.idResp,req.funcionario.idPrest],
                                (error, result, field)=> {
                                    conn.release();
                                    if(error){return res.json({ error:error})}

                                    mysql.getConnection((error, conn) => {
                                        conn.query('update funcionario set EmailFunc=? where idFunc=? and idPrest=?', 
                                        [req.body.EmailFunc,req.body.idFunc,req.funcionario.idPrest],
                                        (error, result, field)=> {
                                            conn.release();
                                            if(error){return res.json({ error:error})}

                                            return res.json({ message:'Alterado'})
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
