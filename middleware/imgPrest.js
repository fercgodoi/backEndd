const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
            cb(null, './uploads/imgPrest');
    },
    filename: function(req, file, cb){
        cb(null,`idPrest${req.prestadores.id}--`+ new Date().toISOString().replace(/:/g, '-').substr(0,19)+ '-' + file.originalname);
        // cb(null,`idPrest--teste--`+ new Date().toISOString().replace(/:/g, '-').substr(0,19)+ '-' + file.originalname);    
         //Nomeando a imagem com a data e o nome original da imagem//
         //`idCli${req.cliente.idCliente}--`+
    }
})
const fileFitro = (req, file, cb, ) => {                                          //definindo o tipo de arquivo
    req.fileFiltImgResp = ' ';
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        req.fileFiltImgResp = 'ok'
        req.imagem = file.path
        cb(null, true);
    } else {
        req.fileFiltImgResp = 'fail'
        req.respError = 'formato invalido'
        cb( null, false);
    }
}
exports.upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5                   //limitando o tamanho da imagem p 5mb
    },
    fileFilter: fileFitro,
}
).single('LogoPrest');