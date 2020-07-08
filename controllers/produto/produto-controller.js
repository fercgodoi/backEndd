const mysql = require('../../mysql').pool;

/*                                                    BUSCAR PRODUTOS                                                                */
exports.BuscarProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.json({ error: "error sql"}) } 

        conn.query('select * from produto where idPrest=?', [req.funcionario.idPrest],
            (error, resultado, field)=> {
                conn.release(); 

                if(error){ return res.json({ error: "error sql"}) } 
                const response = {
                    Produto: resultado.map(prod => {
                        return  {
                            idProd:prod.idProd,
                            NomeProd:prod.NomeProd,
                            DescProd:prod.DescProd,
                            PrecoProd:prod.PrecoProd,
                            QuantProd:prod.QuantProd,
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/*                                                    ---------------                                                              */





/*                                                    BUSCAR PRODUTO                                                                */
exports.Buscar = (req, res, next) => {
    mysql.getConnection((error, conn) => {
       if(error){ return res.json({ error: "error sql"}) } 

        conn.query('select * from produto where idProd=?', [req.body.idProd],
            (error, resultado, field)=> {
                conn.release();

                if(error){ return res.json({ error: "error sql"}) } 
                const response = {
                    Produto: resultado.map(prod => {
                        return  {
                            NomeProd:prod.NomeProd,
                            DescProd:prod.DescProd,
                            PrecoProd:prod.PrecoProd,
                            QuantProd:prod.QuantProd,
                            ImgProd:prod.ImgProd,
                            ImgsProd:prod.ImgsProd,
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/*                                                    ---------------                                                              */




/*                                                    DELETAR PRODUTO                                                                */
exports.DeletarProd = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.json({ error: "error sql"}) } 

        conn.query('delete from produto where idProd=?', [req.body.idProd],
            (error, resultado, field)=> {
                conn.release();
                if(error){ return res.json({ error: "error sql"}) }           
                               
                return res.json({ message : "deletou" });
            })                     
    })
}
/*                                                    ---------------                                                              */


/*                                                    FILTRAR PRODUTOS                                                                */
exports.FiltrarProd = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.json({ error: "error sql"}) } 

        conn.query('select * from produto where NomeProd=? and idPrest=?', [req.body.NomeProd,req.funcionario.idPrest],
            (error, resultado, field)=> {
                conn.release();
                if(error){ return res.json({ error: "error sql"}) } 
                const response = {
                    Produto: resultado.map(prod => {
                        return  {
                            NomeProd:prod.NomeProd,
                            DescProd:prod.DescProd,
                            PrecoProd:prod.PrecoProd,
                            QuantProd:prod.QuantProd,
                        };
                    })
                };
                return res.json({ response });
            })                     
    })
}
/* 



/*                                                    CADASTRAR PRODUTOS                                                               */
exports.CadastrarProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.json({ error: "error sql"}) } 

        conn.query('select * from produto where NomeProd = ?', [req.body.NomeProd],
            (error, result, field)=> {
                conn.release();
                if(error){ return res.json({ error: "error sql"}) } 
                if(result.length >= 1) {
                    return res.json({ message :'Já existe'})
                }
                mysql.getConnection((error, conn) => {
                conn.query('insert into produto(idPrest,NomeProd,DescProd,PrecoProd,QuantProd,ImgProd,ImgsProd) values(?,?,?,?,?,?,?)',
                    [req.funcionario.idPrest, req.body.NomeProd, req.body.DescProd, req.body.PrecoProd, req.body.QuantProd,req.body.ImgProd,req.body.ImgsProd],
                    (error, resultado, field)=> {
                        conn.release();
                        if(error){ return res.json({ error: "error sql"}) } 
                        return res.json({message: 'Cadastrado'})
                    })
                })
        })
    })  
}
/*                                                    ---------------                                                              */



/*                                                    EDITAR PRODUTOS                                                               */
exports.EditarProd = (req, res, next) => {       //rota passando parametro
    mysql.getConnection((error, conn) => {
        if(error){ return res.json({ error: "error sql"}) } 

        conn.query('select * from produto where NomeProd = ?', [req.body.NomeProd],
            (error, result, field)=> {
                conn.release();
                if(error){ return res.json({ error: "error sql"}) }                
                if(result != "" && result != []){
                    if(result[0].idProd != req.body.idProd ) {
                        return res.json({ message :'Já existe'})
                    }
                }
                mysql.getConnection((error, conn) => {
                    conn.query('update produto set NomeProd=?, DescProd= ?,PrecoProd= ?, QuantProd= ?, ImgProd=?, ImgsProd=? where idProd=?',
                    [req.body.NomeProd, req.body.DescProd, req.body.PrecoProd, req.body.QuantProd,req.body.ImgProd,req.body.ImgsProd,req.body.idProd],
                    (error, resultado, field)=> {
                        conn.release();
                        if(error){ return res.json({ error: "error sql"}) } 
                        return res.json({message: 'Alterado'})
                    })
                })
        })
    })  
}
/*                                                    ---------------                                                              */