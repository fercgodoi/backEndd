const fs = require('fs');
sharp = require('sharp');

exports.compressImage = (file) => {
<<<<<<< HEAD

    const newPath = file.path.split('.')[0] + '.jpg';

=======
    const newPath = file.path.split('.')[0] + '.webp';
>>>>>>> b9f2d5467d2384cbfec1b650d6859601141eebad

    return sharp(file.path)
        .resize(531, 479)
        .toFormat('jpg')
<<<<<<< HEAD

        .jpeg({
=======
        .webp({
>>>>>>> b9f2d5467d2384cbfec1b650d6859601141eebad
            quality: 80
        })
        .toBuffer()
        .then(data => {

            // Deletando o arquivo antigo
            // O fs.acess serve para testar se o arquivo realmente existe, evitando bugs
            fs.access(file.path, (err) => {

                // Um erro significa que a o arquivo não existe, então não tentamos apagar
                if (!err) {
                    
                    //Se não houve erros, tentamos apagar
                    fs.unlink(file.path, err => {

                        // Não quero que erros aqui parem todo o sistema, então só vou imprimir o erro, sem throw.
                        if(err) console.log(err)
                    })
                }
            });
            
            //Agora vamos armazenar esse buffer no novo caminho
            fs.writeFile(newPath, data, err => {
                if(err){
                    // Já aqui um erro significa que o upload falhou, então é importante que o usuário saiba.
                    throw err;
                }
            });

            // Se o código chegou até aqui, deu tudo certo, então vamos retornar o novo caminho
            return newPath;
        })
}