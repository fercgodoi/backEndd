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
                        AdestradorPrest: prest.AdestradorPrest,

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
                        // text: `Inseria o Código para prosseguir no cadastro ${passRandom}`                        
                        // html: `<!DOCTYPE HTML>
                        // <html lang=”pt-br”>
                        // <head>
                        // <meta charset=”UTF-8”>
                        // <link rel=”stylesheet” type=”text/css” href=”estilo.css”>
                        // <title></title>
                        // </head>
                        // <body>
                        //     <h1>Ola Somos o Agenda animal!!</h1>
                        //     <h3>Um tutor informa q vc vacinou um de seus animaizinhos, acesse o link a abaixo e confira</h3>
                            
                        //     <a href="http://localhost:3000/Prestador/EnviarCodigo/${token}" target="_blank" >link</a>
                        // </body>
                        // </html>`
                        html :  `
                        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                         <head> 
                          <meta charset="UTF-8"> 
                          <meta content="width=device-width, initial-scale=1" name="viewport"> 
                          <meta name="x-apple-disable-message-reformatting"> 
                          <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
                          <meta content="telephone=no" name="format-detection"> 
                          <title>Primeiro contato Prestador</title> 
                          <!--[if (mso 16)]><style type="text/css"> a {text-decoration: none;} </style><![endif]--> 
                          <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
                          <!--[if !mso]><!-- --> 
                          <link href="href=" https: fonts.googleapis.com css?family="Montserrat:500,700,800&display=swap" " rel="stylesheet"> 
                          <!--<![endif]--> 
                          <!--[if !mso]><!-- --> 
                          <link href="href=" https: fonts.googleapis.com css?family="Montserrat:500,700,800&display=swap" " rel="stylesheet"> 
                          <!--<![endif]--> 
                          <!--[if !mso]><!-- --> 
                          <link href="href=" https: fonts.googleapis.com css?family="Montserrat:500,700,800&display=swap" " rel="stylesheet"> 
                          <!--<![endif]--> 
                          <!--[if gte mso 9]>
                        <xml>
                            <o:OfficeDocumentSettings>
                            <o:AllowPNG></o:AllowPNG>
                            <o:PixelsPerInch>96</o:PixelsPerInch>
                            </o:OfficeDocumentSettings>
                        </xml>
                        <![endif]--> 
                          <style type="text/css">
                        @media only screen and (max-width:600px) {u + #body { width:100vw!important } p, ul li, ol li, a { font-size:14px!important; line-height:150%!important } h1 { font-size:26px!important; text-align:center; line-height:120%!important } h2 { font-size:22px!important; text-align:center; line-height:120%!important } h3 { font-size:18px!important; text-align:left; line-height:120%!important } h1 a { font-size:26px!important; text-align:center } h2 a { font-size:22px!important; text-align:center } h3 a { font-size:18px!important; text-align:left } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:12px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:13px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:13px!important; display:block!important; border-left-width:0px!important; border-right-width:0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p20 { padding-left:20px!important; padding-right:20px!important; padding:20px!important } .es-m-p0t { padding-top:0!important } .es-m-p10t { padding-top:10px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } }
                        @media only screen and (min-width:320px) {ul { padding-left:24px; list-style-image:url(https://pics.esputnik.com/repository/home/17278/common/images/1548324873427.png) } }
                        .section-title {
                            padding:5px 10px;
                            background-color:#f6f6f6;
                            border:1px solid #dfdfdf;
                            outline:0;
                        }
                        .amp-form-submit-success .hidden-block {
                            display:none;
                        }
                        #outlook a {
                            padding:0;
                        }
                        .ExternalClass {
                            width:100%;
                        }
                        .ExternalClass,
                        .ExternalClass p,
                        .ExternalClass span,
                        .ExternalClass font,
                        .ExternalClass td,
                        .ExternalClass div {
                            line-height:100%;
                        }
                        .es-button {
                            mso-style-priority:100!important;
                            text-decoration:none!important;
                        }
                        a[x-apple-data-detectors] {
                            color:inherit!important;
                            text-decoration:none!important;
                            font-size:inherit!important;
                            font-family:inherit!important;
                            font-weight:inherit!important;
                            line-height:inherit!important;
                        }
                        .es-desk-hidden {
                            display:none;
                            float:left;
                            overflow:hidden;
                            width:0;
                            max-height:0;
                            line-height:0;
                            mso-hide:all;
                        }
                        a.es-button:hover {
                            border-color:#2CB543!important;
                            background:#2CB543!important;
                        }
                        a.es-secondary:hover {
                            border-color:#ffffff!important;
                            background:#ffffff!important;
                        }
                        .es-button-border:hover a.es-button {
                            background:#56d66b!important;
                            border-color:#56d66b!important;
                        }
                        .es-button-border:hover {
                            border-color:#42d159 #42d159 #42d159 #42d159!important;
                            background:transparent!important;
                        }
                        td .es-button-border:hover a.es-button-1 {
                            background:#edce48!important;
                            border-color:#edce48!important;
                        }
                        td .es-button-border-2:hover {
                            background:#edce48!important;
                        }
                        </style> 
                         </head> 
                         <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
                          <span style="display:none !important;font-size:0px;line-height:0;color:#FFFFFF;visibility:hidden;opacity:0;height:0;width:0;mso-hide:all">&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌</span> 
                          <div class="es-wrapper-color" style="background-color:#FFFFFF"> 
                           <!--[if gte mso 9]>
                                    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                                        <v:fill type="tile" color="#ffffff"></v:fill>
                                    </v:background>
                                <![endif]--> 
                           <table cellpadding="0" cellspacing="0" class="es-wrapper" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:left top"> 
                             <tr style="border-collapse:collapse"> 
                              <td valign="top" style="padding:0;Margin:0"> 
                               <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                                 <tr style="border-collapse:collapse"> 
                                  <td align="center" style="padding:0;Margin:0"> 
                                   <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"> 
                                     <tr style="border-collapse:collapse"> 
                                      <td align="left" style="padding:0;Margin:0"> 
                                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="center" valign="top" style="padding:0;Margin:0;width:600px"> 
                                           <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                             <tr style="border-collapse:collapse"> 
                                              <td style="padding:0;Margin:0"> 
                                               <amp-img src="" width="1" height="1" alt></amp-img></td> 
                                             </tr> 
                                           </table></td> 
                                         </tr> 
                                       </table></td> 
                                     </tr> 
                                     <tr style="border-collapse:collapse"> 
                                      <td align="left" style="padding:0;Margin:0"> 
                                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="center" valign="top" style="padding:0;Margin:0;width:600px"> 
                                           <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                             <tr style="border-collapse:collapse"> 
                                              <td style="padding:0;Margin:0"> 
                                              <amp-img src="https://www.google-analytics.com/collect?v=1&amp;tid=UA-96386569-1&amp;t=event&amp;cid=%CONTACT_ID%&amp;cn=spring&amp;cs=email&amp;ec=email&amp;ea=openamp" width="1" height="1" alt></amp-img></td> 
                                             </tr> 
                                           </table></td> 
                                         </tr> 
                                       </table></td> 
                                     </tr> 
                                     <tr style="border-collapse:collapse"> 
                                      <td align="left" style="padding:0;Margin:0"> 
                                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="center" valign="top" style="padding:0;Margin:0;width:600px"> 
                                           <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                             <tr style="border-collapse:collapse"> 
                                              <td style="padding:0;Margin:0"> 
                                               <amp-img src="https://www.google-analytics.com/collect?v=1&amp;tid=UA-96386569-1&amp;t=event&amp;cid=%CONTACT_ID%&amp;cn=spring&amp;cs=email&amp;ec=email&amp;ea=openamp" width="1" height="1" alt></amp-img></td> 
                                             </tr> 
                                           </table></td> 
                                         </tr> 
                                       </table></td> 
                                     </tr> 
                                     <tr style="border-collapse:collapse"> 
                                      <td align="left" style="padding:0;Margin:0;padding-left:30px;padding-right:30px"> 
                                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="center" valign="top" style="padding:0;Margin:0;width:540px"> 
                                           <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                             <tr style="border-collapse:collapse"> 
                                              <td align="center" class="es-m-p40" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://stripo.email/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:15px;text-decoration:underline;color:#31CB4B"><img src="https://res.cloudinary.com/agendanimal/image/upload/v1597701177/ImageSystem/49031597510557540_n3jzes.png" alt="Stripo.email" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" title="Stripo.email" class="adapt-img" height="130"></a></td> 
                                             </tr> 
                                             <tr style="border-collapse:collapse"> 
                                              <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://stripo.email/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:15px;text-decoration:underline;color:#31CB4B"><img src="https://res.cloudinary.com/agendanimal/image/upload/v1597701177/ImageSystem/62771597514305577_rp3fe0.gif" alt="Stripo.email" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="485" title="Stripo.email" class="adapt-img"></a></td> 
                                             </tr> 
                                           </table></td> 
                                         </tr> 
                                       </table></td> 
                                     </tr> 
                                     <tr style="border-collapse:collapse"> 
                                      <td align="left" bgcolor="#ffffff" style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:30px;padding-right:30px;background-color:#FFFFFF"> 
                                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="center" valign="top" style="padding:0;Margin:0;width:540px"> 
                                           <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                             <tr style="border-collapse:collapse"> 
                                              <td align="center" style="padding:0;Margin:0;padding-bottom:15px"><h2 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#4A4A4A"><font color="#ff33cc">Oba, Oba, Oba!</font></h2><h2 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#0099FF">&nbsp; Seja bem-vindo🐾</h2></td> 
                                             </tr> 
                                             <tr style="border-collapse:collapse"> 
                                              <td align="center" class="es-m-txt-c" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:24px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:36px;color:#4A4A4A">A plataforma mais Animal do Brasil!<br><br>&nbsp;<strong><span style="background-color:#FF00CC"><span style="color:#FFFFFF">&nbsp;Vamos</span>&nbsp;</span></strong>&nbsp;começar com seus&nbsp;<span style="color:#FFFFFF"><span style="background-color:#6699FF">&nbsp;</span><strong><span style="background-color:#6699FF">primeiros&nbsp;</span></strong></span><br>passos aqui&nbsp;no Agenda Animal.<br><br>Inserir o seu&nbsp;<span style="color:#FFFFFF"><span style="background-color:#6699FF"> Código&nbsp;</span></span> para prosseguir<br>no cadastro&nbsp;<span style="color:#FFFFFF"><span style="background-color:#FF00CC">${passRandom}</span></span></p></td> 
                                             </tr> 
                                           </table></td> 
                                         </tr> 
                                       </table></td> 
                                     </tr> 
                                     <tr style="border-collapse:collapse"> 
                                      <td align="left" style="padding:0;Margin:0"> 
                                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                         <tr style="border-collapse:collapse"> 
                                          <td align="center" valign="top" style="padding:0;Margin:0;width:600px"> 
                                           <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                             <tr style="border-collapse:collapse"> 
                                              <td align="center" style="padding:0;Margin:0"><img class="adapt-img" src="https://pics.esputnik.com/repository/home/17278/images/msg/68933580/1581343662477.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="600"></td> 
                                             </tr> 
                                           </table></td> 
                                         </tr> 
                                       </table></td> 
                                     </tr> 
                                   </table></td> 
                                 </tr> 
                               </table> 
                               <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                                 <tr style="border-collapse:collapse"> 
                                  <td align="center" style="padding:0;Margin:0"> 
                                   <table class="es-content-body" cellspacing="0" cellpadding="0" align="center" bgcolor="#FFFFFF" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"> 
                                     <tr style="border-collapse:collapse"> 
                                      <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px"> 
                                       <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                         <tr style="border-collapse:collapse"> 
                                          <td valign="top" align="center" style="padding:0;Margin:0;width:560px"> 
                                           <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                             <tr style="border-collapse:collapse"> 
                                              <td align="center" style="padding:0;Margin:0;padding-bottom:20px;font-size:0px"><a target="_blank" href="https://stripo.email/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:15px;text-decoration:underline;color:#31CB4B"><img src="https://res.cloudinary.com/agendanimal/image/upload/v1597701177/ImageSystem/86931597512027261_toxqxg.png" alt="Stripo.email" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="480" title="Stripo.email" class="adapt-img"></a></td> 
                                             </tr> 
                                           </table></td> 
                                         </tr> 
                                       </table></td> 
                                     </tr> 
                                     <tr style="border-collapse:collapse"> 
                                      <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px"> 
                                       <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                         <tr style="border-collapse:collapse"> 
                                          <td valign="top" align="center" style="padding:0;Margin:0;width:560px"> 
                                           <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                             <tr style="border-collapse:collapse"> 
                                              <td class="es-infoblock made_with" align="center" style="padding:0;Margin:0;line-height:0px;font-size:0px;color:#FFFFFF"><a target="_blank" href="https://viewstripo.email/?utm_source=templates&utm_medium=email&utm_campaign=webinar+&utm_content=predictions-for-spring" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:12px;text-decoration:underline;color:#FFFFFF"><img src="https://res.cloudinary.com/agendanimal/image/upload/v1597701177/ImageSystem/76591597510713353_qrrhpd.png" alt width="60" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td> 
                                             </tr> 
                                             <tr style="border-collapse:collapse"> 
                                              <td align="center" style="padding:10px;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:15px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#4A4A4A">Operações Comerciais Avenida Paulista, 777 – Bela Vista São Paulo -<br>SP CEP: 01311-914 - <a target="_blank" href="mailto:contato@agendaanimal.com" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:15px;text-decoration:none;color:#CD21BB">contato@agendaanimal.com</a></p></td> 
                                             </tr> 
                                           </table></td> 
                                         </tr> 
                                       </table></td> 
                                     </tr> 
                                   </table></td> 
                                 </tr> 
                               </table></td> 
                             </tr> 
                           </table> 
                          </div>  
                         </body>
                        </html>
                    
                    `
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
              let idHorarios = resultHorario.insertId; 
            conn.release(); 
            if(error){ return res.json({ error: "error sql"}) }  

            
            mysql.getConnection((error, conn) => {
                conn.query('update prestadores set NomeFantsPrest=?,PetShopPrest=?,ClinicaPrest=?,PasseadorPrest=?,AdestradorPrest=?,HotelPrest=?,CepPrest=?,descricaoPrest=?, NumPrest=?,IdHorarioPrest=?,longitude=?,latitude=? where EmailPrest= ?', [req.body.NomeFantsPrest,req.body.PetShopPrest,req.body.ClinicaPrest,req.body.PasseadorPrest,req.body.AdestradorPrest,req.body.HotelPrest,req.body.CepPrest,req.body.descricaoPrest,req.body.NumPrest,idHorarios,req.body.longitude,req.body.latitude,req.prestadores.EmailPrest],
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
                conn.query('insert into servico (tipoServ,codigoServ,valorServ,idPrest) values (?,?,?,?)',[req.body.tipoServ,req.body.Codigo,req.body.valorServ,req.prestadores.id],
                (error, resulta, field)=> { 
                    conn.release();          
                    let id = resulta.insertId;          
                    if(error){return res.json({ error:'error sql'})}  
                    return res.json({ message:'Salvo', id:id});
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

        if(req.body.ButtonValor === "true"){req.body.EmailFunc = req.prestadores.EmailPrest}


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
                                                                    // text: `Faça login novamente no site com esta senha: ${senha} e seu código é ${passRandom}`
                                                                    html: `
                                                                    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                                                                    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                                                                     <head> 
                                                                      <meta charset="UTF-8"> 
                                                                      <meta content="width=device-width, initial-scale=1" name="viewport"> 
                                                                      <meta name="x-apple-disable-message-reformatting"> 
                                                                      <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
                                                                      <meta content="telephone=no" name="format-detection"> 
                                                                      <title>Primeiro Acesso Funcinário</title> 
                                                                      <!--[if (mso 16)]><style type="text/css"> a {text-decoration: none;} </style><![endif]--> 
                                                                      <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
                                                                      <!--[if !mso]><!-- --> 
                                                                      <link href="href=" https: fonts.googleapis.com css?family="Montserrat:500,700,800&display=swap" " rel="stylesheet"> 
                                                                      <!--<![endif]--> 
                                                                      <!--[if !mso]><!-- --> 
                                                                      <link href="href=" https: fonts.googleapis.com css?family="Montserrat:500,700,800&display=swap" " rel="stylesheet"> 
                                                                      <!--<![endif]--> 
                                                                      <!--[if !mso]><!-- --> 
                                                                      <link href="href=" https: fonts.googleapis.com css?family="Montserrat:500,700,800&display=swap" " rel="stylesheet"> 
                                                                      <!--<![endif]--> 
                                                                      <!--[if gte mso 9]>
                                                                    <xml>
                                                                        <o:OfficeDocumentSettings>
                                                                        <o:AllowPNG></o:AllowPNG>
                                                                        <o:PixelsPerInch>96</o:PixelsPerInch>
                                                                        </o:OfficeDocumentSettings>
                                                                    </xml>
                                                                    <![endif]--> 
                                                                      <style type="text/css">
                                                                    @media only screen and (max-width:600px) {u + #body { width:100vw!important } p, ul li, ol li, a { font-size:14px!important; line-height:150%!important } h1 { font-size:26px!important; text-align:center; line-height:120%!important } h2 { font-size:22px!important; text-align:center; line-height:120%!important } h3 { font-size:18px!important; text-align:left; line-height:120%!important } h1 a { font-size:26px!important; text-align:center } h2 a { font-size:22px!important; text-align:center } h3 a { font-size:18px!important; text-align:left } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:12px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:13px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:13px!important; display:block!important; border-left-width:0px!important; border-right-width:0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p20 { padding-left:20px!important; padding-right:20px!important; padding:20px!important } .es-m-p0t { padding-top:0!important } .es-m-p10t { padding-top:10px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } }
                                                                    @media only screen and (min-width:320px) {ul { padding-left:24px; list-style-image:url(https://pics.esputnik.com/repository/home/17278/common/images/1548324873427.png) } }
                                                                    .section-title {
                                                                        padding:5px 10px;
                                                                        background-color:#f6f6f6;
                                                                        border:1px solid #dfdfdf;
                                                                        outline:0;
                                                                    }
                                                                    .amp-form-submit-success .hidden-block {
                                                                        display:none;
                                                                    }
                                                                    #outlook a {
                                                                        padding:0;
                                                                    }
                                                                    .ExternalClass {
                                                                        width:100%;
                                                                    }
                                                                    .ExternalClass,
                                                                    .ExternalClass p,
                                                                    .ExternalClass span,
                                                                    .ExternalClass font,
                                                                    .ExternalClass td,
                                                                    .ExternalClass div {
                                                                        line-height:100%;
                                                                    }
                                                                    .es-button {
                                                                        mso-style-priority:100!important;
                                                                        text-decoration:none!important;
                                                                    }
                                                                    a[x-apple-data-detectors] {
                                                                        color:inherit!important;
                                                                        text-decoration:none!important;
                                                                        font-size:inherit!important;
                                                                        font-family:inherit!important;
                                                                        font-weight:inherit!important;
                                                                        line-height:inherit!important;
                                                                    }
                                                                    .es-desk-hidden {
                                                                        display:none;
                                                                        float:left;
                                                                        overflow:hidden;
                                                                        width:0;
                                                                        max-height:0;
                                                                        line-height:0;
                                                                        mso-hide:all;
                                                                    }
                                                                    a.es-button:hover {
                                                                        border-color:#2CB543!important;
                                                                        background:#2CB543!important;
                                                                    }
                                                                    a.es-secondary:hover {
                                                                        border-color:#ffffff!important;
                                                                        background:#ffffff!important;
                                                                    }
                                                                    .es-button-border:hover a.es-button {
                                                                        background:#56d66b!important;
                                                                        border-color:#56d66b!important;
                                                                    }
                                                                    .es-button-border:hover {
                                                                        border-color:#42d159 #42d159 #42d159 #42d159!important;
                                                                        background:transparent!important;
                                                                    }
                                                                    td .es-button-border:hover a.es-button-1 {
                                                                        background:#edce48!important;
                                                                        border-color:#edce48!important;
                                                                    }
                                                                    td .es-button-border-2:hover {
                                                                        background:#edce48!important;
                                                                    }
                                                                    </style> 
                                                                     </head> 
                                                                     <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
                                                                      <span style="display:none !important;font-size:0px;line-height:0;color:#FFFFFF;visibility:hidden;opacity:0;height:0;width:0;mso-hide:all">&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌</span> 
                                                                      <div class="es-wrapper-color" style="background-color:#FFFFFF"> 
                                                                       <!--[if gte mso 9]>
                                                                                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                                                                                    <v:fill type="tile" color="#ffffff"></v:fill>
                                                                                </v:background>
                                                                            <![endif]--> 
                                                                       <table cellpadding="0" cellspacing="0" class="es-wrapper" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:left top"> 
                                                                         <tr style="border-collapse:collapse"> 
                                                                          <td valign="top" style="padding:0;Margin:0"> 
                                                                           <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                                                                             <tr style="border-collapse:collapse"> 
                                                                              <td align="center" style="padding:0;Margin:0"> 
                                                                               <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" style="padding:0;Margin:0"> 
                                                                                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:600px"> 
                                                                                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td style="padding:0;Margin:0"> 
                                                                                           <amp-img src="https://www.google-analytics.com/collect?v=1&amp;tid=UA-96386569-1&amp;t=event&amp;cid=%CONTACT_ID%&amp;cn=releases&amp;cs=email&amp;ec=email&amp;ea=openamp" width="1" height="1" alt></amp-img></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" style="padding:0;Margin:0"> 
                                                                                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:600px"> 
                                                                                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td style="padding:0;Margin:0"> 
                                                                                           <amp-img src="https://www.google-analytics.com/collect?v=1&amp;tid=UA-96386569-1&amp;t=event&amp;cid=%CONTACT_ID%&amp;cn=releases&amp;cs=email&amp;ec=email&amp;ea=openamp" width="1" height="1" alt></amp-img></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" style="padding:0;Margin:0"> 
                                                                                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:600px"> 
                                                                                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td style="padding:0;Margin:0"> 
                                                                                           <amp-img src="https://www.google-analytics.com/collect?v=1&amp;tid=UA-96386569-1&amp;t=event&amp;cid=%CONTACT_ID%&amp;cn=spring&amp;cs=email&amp;ec=email&amp;ea=openamp" width="1" height="1" alt></amp-img></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" style="padding:0;Margin:0;padding-left:30px;padding-right:30px"> 
                                                                                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:540px"> 
                                                                                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td align="center" class="es-m-p40" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://stripo.email/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:15px;text-decoration:underline;color:#31CB4B"><img src="https://res.cloudinary.com/agendanimal/image/upload/v1597701177/ImageSystem/49031597510557540_n3jzes.png" alt="Stripo.email" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" title="Stripo.email" class="adapt-img" height="130"></a></td> 
                                                                                         </tr> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://stripo.email/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:15px;text-decoration:underline;color:#31CB4B"><img src="https://res.cloudinary.com/agendanimal/image/upload/v1597876469/ImageSystem/36781597875217917_ekvaov.gif" alt="Stripo.email" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="385" title="Stripo.email" class="adapt-img"></a></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" bgcolor="#ffffff" style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:30px;padding-right:30px;background-color:#FFFFFF"> 
                                                                                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:540px"> 
                                                                                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td align="center" style="padding:0;Margin:0;padding-bottom:15px"><h2 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#4A4A4A"><font color="#ff33cc">Novo funcionário!!</font><span style="color:#0099FF">&nbsp; <br>Seja bem-vindo🐾</span></h2></td> 
                                                                                         </tr> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td align="center" class="es-m-txt-c" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:24px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:36px;color:#4A4A4A"><br>Olá, esse é o seu primeiro&nbsp;<strong><span style="background-color:#FF00CC"><span style="color:#FFFFFF">&nbsp;acesso</span>&nbsp;</span></strong>&nbsp;na <br>plataforma Agenda Animal, aqui está sua nova&nbsp;senha&nbsp;<span style="color:#FFFFFF"><span style="background-color:#6699FF">&nbsp; ${senha}</span><strong><span style="background-color:#6699FF">&nbsp;</span></strong></span>, lembre-se de altera-la <br>para sua segurança!<br><br>E esse é o seu Código de Acesso:<br><span style="color:#FFFFFF"><span style="background-color:#6699FF">&nbsp;${passRandom}</span><strong><span style="background-color:#6699FF">&nbsp;</span></strong></span>&nbsp;<br><br><br>Qualquer dúvida, estamos a disposição pelo <a target="_blank" href="mailto:suporte@agendanimal.com" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:24px;text-decoration:underline;color:#E705CF">suporte@agendanimal.com</a>!<br></p></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" style="padding:0;Margin:0"> 
                                                                                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:600px"> 
                                                                                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://pics.esputnik.com/repository/home/17278/images/msg/68933580/1581343662477.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="600"></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                               </table></td> 
                                                                             </tr> 
                                                                           </table> 
                                                                           <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                                                                             <tr style="border-collapse:collapse"> 
                                                                              <td align="center" style="padding:0;Margin:0"> 
                                                                               <table class="es-content-body" cellspacing="0" cellpadding="0" align="center" bgcolor="#FFFFFF" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px"> 
                                                                                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td valign="top" align="center" style="padding:0;Margin:0;width:560px"> 
                                                                                       <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td align="center" style="padding:0;Margin:0;padding-bottom:20px;font-size:0px"><a target="_blank" href="https://stripo.email/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:15px;text-decoration:underline;color:#31CB4B"><img src="https://res.cloudinary.com/agendanimal/image/upload/v1597701177/ImageSystem/86931597512027261_toxqxg.png" alt="Stripo.email" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="480" title="Stripo.email" class="adapt-img"></a></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px"> 
                                                                                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td valign="top" align="center" style="padding:0;Margin:0;width:560px"> 
                                                                                       <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td class="es-infoblock made_with" align="center" style="padding:0;Margin:0;line-height:0px;font-size:0px;color:#FFFFFF"><a target="_blank" href="https://viewstripo.email/?utm_source=templates&utm_medium=email&utm_campaign=webinar+&utm_content=predictions-for-spring" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:12px;text-decoration:underline;color:#FFFFFF"><img src="https://res.cloudinary.com/agendanimal/image/upload/v1597701177/ImageSystem/76591597510713353_qrrhpd.png" alt width="60" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td> 
                                                                                         </tr> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td align="center" style="padding:10px;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:15px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#4A4A4A">Operações Comerciais Avenida Paulista, 777 – Bela Vista São Paulo -<br>SP CEP: 01311-914 - <a target="_blank" href="mailto:contato@agendaanimal.com" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:15px;text-decoration:none;color:#CD21BB">contato@agendaanimal.com</a></p></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                               </table></td> 
                                                                             </tr> 
                                                                           </table></td> 
                                                                         </tr> 
                                                                       </table> 
                                                                      </div>  
                                                                     </body>
                                                                    </html>                                        
                                                                `
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
                                                                    // text: `Faça login novamente no site com esta senha: ${senha} e seu código é ${passRandom}`
                                                                    html: `
                                                                    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                                                                    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                                                                     <head> 
                                                                      <meta charset="UTF-8"> 
                                                                      <meta content="width=device-width, initial-scale=1" name="viewport"> 
                                                                      <meta name="x-apple-disable-message-reformatting"> 
                                                                      <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
                                                                      <meta content="telephone=no" name="format-detection"> 
                                                                      <title>Primeiro Acesso Funcinário</title> 
                                                                      <!--[if (mso 16)]><style type="text/css"> a {text-decoration: none;} </style><![endif]--> 
                                                                      <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
                                                                      <!--[if !mso]><!-- --> 
                                                                      <link href="href=" https: fonts.googleapis.com css?family="Montserrat:500,700,800&display=swap" " rel="stylesheet"> 
                                                                      <!--<![endif]--> 
                                                                      <!--[if !mso]><!-- --> 
                                                                      <link href="href=" https: fonts.googleapis.com css?family="Montserrat:500,700,800&display=swap" " rel="stylesheet"> 
                                                                      <!--<![endif]--> 
                                                                      <!--[if !mso]><!-- --> 
                                                                      <link href="href=" https: fonts.googleapis.com css?family="Montserrat:500,700,800&display=swap" " rel="stylesheet"> 
                                                                      <!--<![endif]--> 
                                                                      <!--[if gte mso 9]>
                                                                    <xml>
                                                                        <o:OfficeDocumentSettings>
                                                                        <o:AllowPNG></o:AllowPNG>
                                                                        <o:PixelsPerInch>96</o:PixelsPerInch>
                                                                        </o:OfficeDocumentSettings>
                                                                    </xml>
                                                                    <![endif]--> 
                                                                      <style type="text/css">
                                                                    @media only screen and (max-width:600px) {u + #body { width:100vw!important } p, ul li, ol li, a { font-size:14px!important; line-height:150%!important } h1 { font-size:26px!important; text-align:center; line-height:120%!important } h2 { font-size:22px!important; text-align:center; line-height:120%!important } h3 { font-size:18px!important; text-align:left; line-height:120%!important } h1 a { font-size:26px!important; text-align:center } h2 a { font-size:22px!important; text-align:center } h3 a { font-size:18px!important; text-align:left } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:12px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:13px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:13px!important; display:block!important; border-left-width:0px!important; border-right-width:0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p20 { padding-left:20px!important; padding-right:20px!important; padding:20px!important } .es-m-p0t { padding-top:0!important } .es-m-p10t { padding-top:10px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } }
                                                                    @media only screen and (min-width:320px) {ul { padding-left:24px; list-style-image:url(https://pics.esputnik.com/repository/home/17278/common/images/1548324873427.png) } }
                                                                    .section-title {
                                                                        padding:5px 10px;
                                                                        background-color:#f6f6f6;
                                                                        border:1px solid #dfdfdf;
                                                                        outline:0;
                                                                    }
                                                                    .amp-form-submit-success .hidden-block {
                                                                        display:none;
                                                                    }
                                                                    #outlook a {
                                                                        padding:0;
                                                                    }
                                                                    .ExternalClass {
                                                                        width:100%;
                                                                    }
                                                                    .ExternalClass,
                                                                    .ExternalClass p,
                                                                    .ExternalClass span,
                                                                    .ExternalClass font,
                                                                    .ExternalClass td,
                                                                    .ExternalClass div {
                                                                        line-height:100%;
                                                                    }
                                                                    .es-button {
                                                                        mso-style-priority:100!important;
                                                                        text-decoration:none!important;
                                                                    }
                                                                    a[x-apple-data-detectors] {
                                                                        color:inherit!important;
                                                                        text-decoration:none!important;
                                                                        font-size:inherit!important;
                                                                        font-family:inherit!important;
                                                                        font-weight:inherit!important;
                                                                        line-height:inherit!important;
                                                                    }
                                                                    .es-desk-hidden {
                                                                        display:none;
                                                                        float:left;
                                                                        overflow:hidden;
                                                                        width:0;
                                                                        max-height:0;
                                                                        line-height:0;
                                                                        mso-hide:all;
                                                                    }
                                                                    a.es-button:hover {
                                                                        border-color:#2CB543!important;
                                                                        background:#2CB543!important;
                                                                    }
                                                                    a.es-secondary:hover {
                                                                        border-color:#ffffff!important;
                                                                        background:#ffffff!important;
                                                                    }
                                                                    .es-button-border:hover a.es-button {
                                                                        background:#56d66b!important;
                                                                        border-color:#56d66b!important;
                                                                    }
                                                                    .es-button-border:hover {
                                                                        border-color:#42d159 #42d159 #42d159 #42d159!important;
                                                                        background:transparent!important;
                                                                    }
                                                                    td .es-button-border:hover a.es-button-1 {
                                                                        background:#edce48!important;
                                                                        border-color:#edce48!important;
                                                                    }
                                                                    td .es-button-border-2:hover {
                                                                        background:#edce48!important;
                                                                    }
                                                                    </style> 
                                                                     </head> 
                                                                     <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
                                                                      <span style="display:none !important;font-size:0px;line-height:0;color:#FFFFFF;visibility:hidden;opacity:0;height:0;width:0;mso-hide:all">&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌</span> 
                                                                      <div class="es-wrapper-color" style="background-color:#FFFFFF"> 
                                                                       <!--[if gte mso 9]>
                                                                                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                                                                                    <v:fill type="tile" color="#ffffff"></v:fill>
                                                                                </v:background>
                                                                            <![endif]--> 
                                                                       <table cellpadding="0" cellspacing="0" class="es-wrapper" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:left top"> 
                                                                         <tr style="border-collapse:collapse"> 
                                                                          <td valign="top" style="padding:0;Margin:0"> 
                                                                           <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                                                                             <tr style="border-collapse:collapse"> 
                                                                              <td align="center" style="padding:0;Margin:0"> 
                                                                               <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" style="padding:0;Margin:0"> 
                                                                                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:600px"> 
                                                                                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td style="padding:0;Margin:0"> 
                                                                                           <amp-img src="https://www.google-analytics.com/collect?v=1&amp;tid=UA-96386569-1&amp;t=event&amp;cid=%CONTACT_ID%&amp;cn=releases&amp;cs=email&amp;ec=email&amp;ea=openamp" width="1" height="1" alt></amp-img></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" style="padding:0;Margin:0"> 
                                                                                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:600px"> 
                                                                                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td style="padding:0;Margin:0"> 
                                                                                           <amp-img src="https://www.google-analytics.com/collect?v=1&amp;tid=UA-96386569-1&amp;t=event&amp;cid=%CONTACT_ID%&amp;cn=releases&amp;cs=email&amp;ec=email&amp;ea=openamp" width="1" height="1" alt></amp-img></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" style="padding:0;Margin:0"> 
                                                                                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:600px"> 
                                                                                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td style="padding:0;Margin:0"> 
                                                                                           <amp-img src="https://www.google-analytics.com/collect?v=1&amp;tid=UA-96386569-1&amp;t=event&amp;cid=%CONTACT_ID%&amp;cn=spring&amp;cs=email&amp;ec=email&amp;ea=openamp" width="1" height="1" alt></amp-img></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" style="padding:0;Margin:0;padding-left:30px;padding-right:30px"> 
                                                                                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:540px"> 
                                                                                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td align="center" class="es-m-p40" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://stripo.email/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:15px;text-decoration:underline;color:#31CB4B"><img src="https://res.cloudinary.com/agendanimal/image/upload/v1597701177/ImageSystem/49031597510557540_n3jzes.png" alt="Stripo.email" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" title="Stripo.email" class="adapt-img" height="130"></a></td> 
                                                                                         </tr> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://stripo.email/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:15px;text-decoration:underline;color:#31CB4B"><img src="https://res.cloudinary.com/agendanimal/image/upload/v1597876469/ImageSystem/36781597875217917_ekvaov.gif" alt="Stripo.email" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="385" title="Stripo.email" class="adapt-img"></a></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" bgcolor="#ffffff" style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:30px;padding-right:30px;background-color:#FFFFFF"> 
                                                                                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:540px"> 
                                                                                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td align="center" style="padding:0;Margin:0;padding-bottom:15px"><h2 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#4A4A4A"><font color="#ff33cc">Novo funcionário!!</font><span style="color:#0099FF">&nbsp; <br>Seja bem-vindo🐾</span></h2></td> 
                                                                                         </tr> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td align="center" class="es-m-txt-c" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:24px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:36px;color:#4A4A4A"><br>Olá, esse é o seu primeiro&nbsp;<strong><span style="background-color:#FF00CC"><span style="color:#FFFFFF">&nbsp;acesso</span>&nbsp;</span></strong>&nbsp;na <br>plataforma Agenda Animal, aqui está sua nova&nbsp;senha&nbsp;<span style="color:#FFFFFF"><span style="background-color:#6699FF">&nbsp; ${senha}</span><strong><span style="background-color:#6699FF">&nbsp;</span></strong></span>, lembre-se de altera-la <br>para sua segurança!<br><br>E esse é o seu Código de Acesso:<br><span style="color:#FFFFFF"><span style="background-color:#6699FF">&nbsp;${passRandom}</span><strong><span style="background-color:#6699FF">&nbsp;</span></strong></span>&nbsp;<br><br><br>Qualquer dúvida, estamos a disposição pelo <a target="_blank" href="mailto:suporte@agendanimal.com" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:24px;text-decoration:underline;color:#E705CF">suporte@agendanimal.com</a>!<br></p></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" style="padding:0;Margin:0"> 
                                                                                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:600px"> 
                                                                                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://pics.esputnik.com/repository/home/17278/images/msg/68933580/1581343662477.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="600"></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                               </table></td> 
                                                                             </tr> 
                                                                           </table> 
                                                                           <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                                                                             <tr style="border-collapse:collapse"> 
                                                                              <td align="center" style="padding:0;Margin:0"> 
                                                                               <table class="es-content-body" cellspacing="0" cellpadding="0" align="center" bgcolor="#FFFFFF" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px"> 
                                                                                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td valign="top" align="center" style="padding:0;Margin:0;width:560px"> 
                                                                                       <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td align="center" style="padding:0;Margin:0;padding-bottom:20px;font-size:0px"><a target="_blank" href="https://stripo.email/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:15px;text-decoration:underline;color:#31CB4B"><img src="https://res.cloudinary.com/agendanimal/image/upload/v1597701177/ImageSystem/86931597512027261_toxqxg.png" alt="Stripo.email" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="480" title="Stripo.email" class="adapt-img"></a></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                                 <tr style="border-collapse:collapse"> 
                                                                                  <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px"> 
                                                                                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                     <tr style="border-collapse:collapse"> 
                                                                                      <td valign="top" align="center" style="padding:0;Margin:0;width:560px"> 
                                                                                       <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td class="es-infoblock made_with" align="center" style="padding:0;Margin:0;line-height:0px;font-size:0px;color:#FFFFFF"><a target="_blank" href="https://viewstripo.email/?utm_source=templates&utm_medium=email&utm_campaign=webinar+&utm_content=predictions-for-spring" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:12px;text-decoration:underline;color:#FFFFFF"><img src="https://res.cloudinary.com/agendanimal/image/upload/v1597701177/ImageSystem/76591597510713353_qrrhpd.png" alt width="60" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td> 
                                                                                         </tr> 
                                                                                         <tr style="border-collapse:collapse"> 
                                                                                          <td align="center" style="padding:10px;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:15px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:23px;color:#4A4A4A">Operações Comerciais Avenida Paulista, 777 – Bela Vista São Paulo -<br>SP CEP: 01311-914 - <a target="_blank" href="mailto:contato@agendaanimal.com" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:15px;text-decoration:none;color:#CD21BB">contato@agendaanimal.com</a></p></td> 
                                                                                         </tr> 
                                                                                       </table></td> 
                                                                                     </tr> 
                                                                                   </table></td> 
                                                                                 </tr> 
                                                                               </table></td> 
                                                                             </tr> 
                                                                           </table></td> 
                                                                         </tr> 
                                                                       </table> 
                                                                      </div>  
                                                                     </body>
                                                                    </html>                                        
                                                                `
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
                        AdestradorPrest:prest.AdestradorPrest,
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
                        codigoServ: serv.codigoServ ,
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

        conn.query('update servico set tipoServ=?, codigoServ=?, valorServ=? where idServ=?;', [req.body.tipoServ,req.body.Codigo,req.body.valorServ,req.body.idServ],
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

                        conn.query('update prestadores set NomeFantsPrest=?,CelularPrest=?,WhatsPrest=?,EmailPrest=?,CepPrest=?,NumPrest=?,EmergenciaPrest=?,descricaoPrest=?,longitude=?,latitude=?,PetShopPrest=?,ClinicaPrest=?,OngPrest=?,PasseadorPrest=?,AdestradorPrest=?,HotelPrest=? and idPrest=?', 
                        [req.body.NomeFantsPrest,req.body.CelularPrest,req.body.WhatsPrest,req.body.EmailPrest,req.body.CepPrest,req.body.NumPrest,req.body.EmergenciaPrest,req.body.descricaoPrest,req.body.longitude,req.body.latitude,req.body.PetShopPrest,req.body.ClinicaPrest,req.body.OngPrest,req.body.PasseadorPrest,req.body.AdestradorPrest,req.body.HotelPrest,req.funcionario.idPrest],

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




//////////////////////////////////////////// BUSCAR SERVIÇOS ESTAPA 4//////////////////////////////////////////////
exports.BuscaServicosPresQuatro = (req,res,next) => {
  mysql.getConnection((error, conn) => {
      if(error){return res.json({ error: 'error sql'})} 

      conn.query('select * from servico where idPrest=?', [req.prestadores.id],
      (error, result, field)=> {
          conn.release();
          if(error){return res.json({ error:'error sql'})}

          const response = {
              Servicos: result.map(serv => {
                  return  {
                      idServ: serv.idServ ,
                      tipoServ: serv.tipoServ ,
                      valorServ: serv.valorServ ,
                      codigoServ: serv.codigoServ ,
                  };
              })
          };

          return res.json({ response });
      })
  })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
