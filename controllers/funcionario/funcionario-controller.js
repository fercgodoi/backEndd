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
                                            // text: `Faça login novamente no site com esta código: ${passRandom}`
                                            html: `
                                            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                                            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                                            <head> 
                                            <meta charset="UTF-8"> 
                                            <meta content="width=device-width, initial-scale=1" name="viewport"> 
                                            <meta name="x-apple-disable-message-reformatting"> 
                                            <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
                                            <meta content="telephone=no" name="format-detection"> 
                                            <title>Acesso Funcionário  2</title> 
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
                                                                <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://stripo.email/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:15px;text-decoration:underline;color:#31CB4B"><img src="https://res.cloudinary.com/agendanimal/image/upload/v1597876764/ImageSystem/33121597875647140_bpn48e.gif" alt="Stripo.email" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="425" title="Stripo.email" class="adapt-img"></a></td> 
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
                                                                <td align="center" style="padding:0;Margin:0;padding-bottom:15px"><h2 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#4A4A4A"><font color="#ff33cc">Olá, Seu acesso...</font><span style="color:#0099FF"><br>expirou!!🐾</span></h2></td> 
                                                                </tr> 
                                                                <tr style="border-collapse:collapse"> 
                                                                <td align="center" class="es-m-txt-c" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:24px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:36px;color:#4A4A4A"><br>Você tentou entrar na Plataforma do <br>Agenda Animal, mas o seu acesso expirou!<br><br>Não se preocupe, esse é o seu novo <br>Código de Acesso:<br><br><span style="color:#FFFFFF"><span style="background-color:#6699FF">&nbsp;${passRandom}</span><strong><span style="background-color:#6699FF">&nbsp;</span></strong></span>&nbsp;<br><br>Qualquer dúvida, estamos a disposição pelo <a target="_blank" href="mailto:suporte@agendanimal.com" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:24px;text-decoration:underline;color:#E705CF">suporte@agendanimal.com</a>!</p></td> 
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
                                                // text: `Faça login novamente no site com esta senha: ${senha} e seu código é: ${passRandom}`
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
                                            // text: `Faça login novamente no site com esta senha: ${senha} e seu código é: ${passRandom}`
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
                                // text: `Faça login novamente no app com esta senha: ${passRandom}`
                                html: `
                                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                                <head> 
                                <meta charset="UTF-8"> 
                                <meta content="width=device-width, initial-scale=1" name="viewport"> 
                                <meta name="x-apple-disable-message-reformatting"> 
                                <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
                                <meta content="telephone=no" name="format-detection"> 
                                <title>E-mail Senha Perdida</title> 
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
                                @media only screen and (max-width:600px) {u + #body { width:100vw!important } p, ul li, ol li, a { font-size:14px!important; line-height:150%!important } h1 { font-size:26px!important; text-align:center; line-height:120%!important } h2 { font-size:22px!important; text-align:center; line-height:120%!important } h3 { font-size:18px!important; text-align:left; line-height:120%!important } h1 a { font-size:26px!important; text-align:center } h2 a { font-size:22px!important; text-align:center } h3 a { font-size:18px!important; text-align:left } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:12px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:13px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:13px!important; display:block!important; border-left-width:0px!important; border-right-width:0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p20 { padding-left:20px!important; padding-right:20px!important } .es-m-p0t { padding-top:0px!important } .es-m-p10t { padding-top:10px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
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
                                td .es-button-border:hover a.es-button-3 {
                                    background:#cd21bb!important;
                                    border-color:#cd21bb!important;
                                }
                                td .es-button-border-4:hover {
                                    background:#cd21bb!important;
                                }
                                </style> 
                                </head> 
                                <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
                                <span style="display:none !important;font-size:0px;line-height:0;color:#FFFFFF;visibility:hidden;opacity:0;height:0;width:0;mso-hide:all">&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌</span> 
                                <div class="es-wrapper-color" style="background-color:#FFFFFF"> 
                                <!--[if gte mso 9]>
                                            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                                                <v:fill type="tile" color="#ffffff" origin="0.5, 0" position="0.5,0"></v:fill>
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
                                                    <td align="center" style="padding:0;Margin:0;padding-bottom:20px;font-size:0px"><a target="_blank" href="https://stripo.email/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:15px;text-decoration:underline;color:#31CB4B"><img src="https://res.cloudinary.com/agendanimal/image/upload/v1597701177/ImageSystem/49031597510557540_n3jzes.png" alt="Stripo.email" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="125" title="Stripo.email"></a></td> 
                                                    </tr> 
                                                    <tr style="border-collapse:collapse"> 
                                                    <td align="center" style="padding:0;Margin:0;padding-bottom:5px;font-size:0px"><a target="_blank" href="https://stripo.email/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:15px;text-decoration:underline;color:#31CB4B"><img src="https://res.cloudinary.com/agendanimal/image/upload/v1597701273/ImageSystem/71721597513511251_tvxfe9.gif" alt="Stripo.email" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="295" title="Stripo.email" class="adapt-img"></a></td> 
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
                                                    <td align="center" style="padding:0;Margin:0;padding-bottom:15px"><h2 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#4A4A4A"><font color="#ff33cc">AAAAAAAHHHHH!</font></h2><h2 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#4A4A4A"><font color="#ff33cc"></font><span style="color:#0099FF">Perdeu sua senha<br>DENOVO? 🐾</span><br></h2><br></td> 
                                                    </tr> 
                                                    <tr style="border-collapse:collapse"> 
                                                    <td align="center" class="es-m-txt-c" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:24px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:36px;color:#4A4A4A">Recebemos&nbsp;a sua&nbsp;<strong><span style="background-color:#FF00CC"><span style="color:#FFFFFF">&nbsp;solicitação</span>&nbsp;</span></strong>&nbsp;de senha perdida, faça o login com essa senha <span style="color:#0099FF"> ${passRandom}</span> para recuperar seu <span style="color:#FFFFFF"><span style="background-color:#FF0099"><span style="background-color:#FF00FF">&nbsp;acesso!</span></span><span style="background-color:#FF00FF">&nbsp;</span></span><br></p></td> 
                                                    </tr> 
                                                    
                                                    <tr style="border-collapse:collapse"> 
                                                    <td align="center" class="es-m-txt-c" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:24px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:36px;color:#4A4A4A"><br>"<strong><span style="background-color:#FF00CC"><span style="color:#FFFFFF">&nbsp;Agenda Animal</span>&nbsp;</span></strong>&nbsp;facilitando a sua vida, para melhorar a dos&nbsp;<span style="color:#FFFFFF"><span style="background-color:#FF0099"><span style="background-color:#FF00FF">&nbsp;animais!</span></span><span style="background-color:#FF00FF">&nbsp;</span></span></p></td> 
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


/*                                                    TROCA SENHA FUNCIONARIO                                                               */
exports.FuncClinica = (req, res, next) => {       
    mysql.getConnection((error, conn) =>{
        if(error){ return res.json({ message: "error sql"}) } 

        conn.query('select * from funcionario where funcionario.idPrest=? and CRMVFunc is not null and DateEmiFunc is not null ', [req.funcionario.idPrest],
            (error, result, field)=> {
                conn.release();
                if(error){ return res.json({ message: "error sql"}) }                
                if(result.length === 0 || result.length === []){
                    return res.json({ message: "Usuario inexistente"})
                }
                return res.json({ message: "Usuario existente"})                
            })
    }) 
}
/*                                                    ---------------                                                              */


/*                                                    BUSCAR FUNCIONARIO                                                                 */
exports.VetouNao = (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){                                  //tratamento de erro da conexao
            return res.json({ error: "Falhou"})        
        } 
        conn.query('select CRMVFunc from funcionario where funcionario.idFunc = ?', [req.funcionario.idFunc],
            (error, resultado, field)=> {
                conn.release(); 
                if(error){ return res.json({ error: "error sql"}) } 

                if(resultado[0].CRMVFunc == null || resultado[0].CRMVFunc == ""){
                    return res.json({ message: "Nao tem" });
                }else{
                    return res.json({ message: "Tem" });
                }
               
            })                     
    })
}
/*                                                    ---------------                                                              */
