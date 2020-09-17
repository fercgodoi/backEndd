const mysql = require('../../mysql').pool;              //para conectar ao banco


/*                                                    BUSCAR DADOS PET                                                                  */
exports.buscarRg = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'erro sql'})} 
        conn.query('select * from pet where rgPet=?', [req.body.rgPet],
            (error, resultado, field)=> {
                conn.release(); 
                if(error){return res.json({ error: 'erro sql'})}    
                if(resultado.length == 0 ||  resultado.length == [] ){return res.json({ message: 'Nao existe'})}         

                const response = { 
                    Pet: resultado.map(Pet => {
                        return  {
                            pesoPet: Pet.pesoPet,
                            aniverPet: Pet.aniverPet,
                            dataCastPet: Pet.dataCastPet,
                            sexoPet: Pet.sexoPet
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/*                                                    ---------------                                                              */
