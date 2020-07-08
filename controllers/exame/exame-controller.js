const mysql = require('../../mysql').pool;

///////////////////////////////////////////////////////////////  INSERIR VACINA  //////////////////////////////////////////////////////////////////////////
exports.CadExames = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){return res.json({ error: 'erro sql'})}          
        conn.query('select * from pet where rgPet = ?', [req.body.rgPet],
            (error, resultado, field)=> {
                conn.release();
                if(error){return res.json({ error: 'erro sql'})} 
                if(resultado.length == 0){
                    return res.json({ message: "Pet nao encontrado"})
                }
                mysql.getConnection((error, conn) => {
                    conn.query('insert into exames(idPrest,idPet,Fezes,RadiologiaSimples,RadiologiaContrastada,Eletrocardiograma,UltrassonografiAbdominal,HemogramaCompleto,PesquisaHemoparasitas,FuncaoHepatica,SorologicoFIVFELV,Urina,AcidoUrico,Albumina,ALT,Amilase,AST,Bilirrubina,CalcioSerico,Colesterol,Colinesterase,CreatinaQuinase,Creatinina,FerroSerico,FosfataseAlcalina,Fosforo,Gama,Glicose,Magnesio,ProteinasTotais,NAKCL,Triglicerideos,Ureia,ExameTumoral,ExameGinecologico,GlicemiaJejum,Biopsia,SexagemAves) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                        [req.funcionario.idPrest,resultado[0].idPet,req.body.Fezes,req.body.RadiologiaSimples,req.body.RadiologiaContrastada,req.body.Eletrocardiograma,req.body.UltrassonografiAbdominal,req.body.HemogramaCompleto,req.body.PesquisaHemoparasitas,req.body.FuncaoHepatica,req.body.SorologicoFIVFELV,req.body.Urina,req.body.AcidoUrico,req.body.Albumina,req.body.ALT,req.body.Amilase,req.body.AST,req.body.Bilirrubina,req.body.CalcioSerico,req.body.Colesterol,req.body.Colinesterase,req.body.CreatinaQuinase,req.body.Creatinina,req.body.FerroSerico,req.body.FosfataseAlcalina,req.body.Fosforo,req.body.Gama,req.body.Glicose,req.body.Magnesio,req.body.ProteinasTotais,req.body.NAKCL,req.body.Triglicerideos,req.body.Ureia,req.body.ExameTumoral,req.body.ExameGinecologico,req.body.GlicemiaJejum,req.body.Biopsia,req.body.SexagemAves],
                        (error, resultados, field)=> { 
                            conn.release();
                            if(error){return res.json({ error: 'erro sql'})} 
                            return res.json({message : "Cadastrado", id :resultados.insertId});                        
                    })
                })
            }
        )
    }) 
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////  BUSCAR EXAMES  //////////////////////////////////////////////////////////////////////////
exports.BuscarInfo = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.json({ error: 'erro sql'})} 
        conn.query('select * from exames where idExames= ?',[req.body.idExames],
            (error, resultado, fields) => {
                conn.release();
                if(error){return res.json({ error: 'erro sql'})} 
                if(resultado.length == 0){
                    return res.json({ message: "Exame nao encontrado"})
                }

                const response = {
                    Exame: resultado.map(ex => {
                        return  {
                            Fezes: ex.Fezes,
                            RadiologiaSimples: ex.RadiologiaSimples,
                            RadiologiaContrastada: ex.RadiologiaContrastada,
                            Eletrocardiograma: ex.Eletrocardiograma,
                            UltrassonografiAbdominal: ex.UltrassonografiAbdominal,
                            HemogramaCompleto: ex.HemogramaCompleto,
                            PesquisaHemoparasitas: ex.PesquisaHemoparasitas,
                            FuncaoHepatica: ex.FuncaoHepatica,
                            SorologicoFIVFELV: ex.SorologicoFIVFELV,
                            Urina: ex.Urina,
                            AcidoUrico: ex.AcidoUrico,
                            Albumina: ex.Albumina,
                            ALT: ex.ALT,
                            Amilase: ex.Amilase,
                            AST: ex.AST,
                            Bilirrubina: ex.Bilirrubina,
                            CalcioSerico: ex.CalcioSerico,
                            Colesterol: ex.Colesterol,
                            Colinesterase: ex.Colinesterase,
                            CreatinaQuinase: ex.CreatinaQuinase,
                            Creatinina: ex.Creatinina,
                            FerroSerico: ex.FerroSerico,
                            FosfataseAlcalina: ex.FosfataseAlcalina,
                            Fosforo: ex.Fosforo,
                            Gama: ex.Gama,
                            Glicose: ex.Glicose,
                            Magnesio: ex.Magnesio,
                            ProteinasTotais: ex.ProteinasTotais,
                            NAKCL: ex.NAKCL,
                            Triglicerideos: ex.Triglicerideos,
                            Ureia: ex.Ureia,
                            ExameTumoral: ex.ExameTumoral,
                            ExameGinecologico: ex.ExameGinecologico,
                            GlicemiaJejum: ex.GlicemiaJejum,
                            Biopsia: ex.Biopsia,
                            SexagemAves: ex.SexagemAves
                            
                        };
                    })
                };
                return res.json({ response });              
            }
        )
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
