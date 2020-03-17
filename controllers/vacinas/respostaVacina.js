exports.EnviarVacVet = (req, res, next) => {
   return res.status(200).send(
       `
       <!DOCTYPE html>
<html lang='br'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Agenda animal</title>
</head>
<body>

    <h1>Ola Somos o Agenda animal!!</h1>
    <h3>Um tutor informa q vc vacinou um de seus animaizinhos, dê uma olhada nos dados e se for preciso altere, apos se estiver de acordo so selecionar confirmar e dar ok </h3>

    <form>
    <label > Nome Veterinario: ${req.Vacina.nomeVetVacina} </label>
    <input id='nomeVetVacina' value= ${req.Vacina.nomeVetVacina} > <br>
    <p></p>

    <label > E-mail Veterinario: ${req.Vacina.emailVetVacina} </label> <br>
    <p></p>

    <label > CRMV Veterinario: </label>
    <input id='crmvVetVacina' value= ${req.Vacina.crmvVetVacina} > <br>
    <p></p>

    <label > Nome da Vacina: </label>
    <input id='nomeVacina' value= ${req.Vacina.nomeVacina} > <br>
    <p></p>

    <label > Dosagem da Vacina: </label>
    <input id='qntDoseVacina' value= ${req.Vacina.qntDoseVacina} > <br>
    <p></p>

    <label > Lote da Vacina: </label>
    <input id='loteVacina' value= ${req.Vacina.loteVacina} > <br>
    <p></p>

    <label > Data da Vacinação: ${req.Vacina.dataApliVacina} </label> <br>
    <p></p>

    <label > Data da Proxima vacina: ${req.Vacina.dataProxVacina} </label> <br>
    <p></p>

    <label > Nome do Animal: ${req.Vacina.nomePet} </label> <br>
    <p></p>


    <label> Caso tenha alguma observação preencha: </label> <br>
    <textarea id='observacaoVacina' cols='30' rows='5' ></textarea>

    <p></p>

    <table>
        <tr>
            <td>
                <input type='radio' id='confimar' name='gender' onclick='radio(1)' checked >
                <label for='confimar'>Confirmar</label><br>
            </td>
            <td>
                <input type='radio' id='cancelar' name='gender' onclick='radio(-1)' >
                <label for="cancelar">Cancelar</label><br>
            </td>
        </tr>
    </table>

    <p></p>

    <button type='button'  onclick='enviar()'>OK</button>
    </form>
    <p></p>

    <div id='resp' ></div>


    <script>

        let Resultado = 0;

        function radio(id) {
        Resultado = id;
        console.log(Resultado)
        }
        
        function enviar(){

            var nomeVetVacina =  document.getElementById('nomeVetVacina').value; //
            var crmvVetVacina = document.getElementById('crmvVetVacina').value; //
            var nomeVacina = document.getElementById('nomeVacina').value; //
            var qntDoseVacina = document.getElementById('qntDoseVacina').value;//
            var loteVacina = document.getElementById('loteVacina').value; //
            var observacaoVacina = document.getElementById('observacaoVacina').value;//
            

            if(nomeVetVacina == '' || nomeVetVacina == null || nomeVetVacina == undefined ){
                alert("preencha o campo Nome Veterinario");
            } else if (crmvVetVacina == '' || crmvVetVacina == null || crmvVetVacina == undefined ) {
                alert("preencha o campo Crmv veterinario");
            } else if (nomeVacina == '' || nomeVacina == null || nomeVacina == undefined ) {
                alert("preencha o campo Nome vacina");
            } else if (qntDoseVacina == '' || qntDoseVacina == null || qntDoseVacina == undefined ) {
                alert("preencha o campo Dosagem da Vacina");
            } else if (loteVacina == '' || loteVacina == null || loteVacina == undefined ) {
                alert("preencha o campo Lote da Vacina");
            } else {
                     var http = new XMLHttpRequest();
                    var url = 'http://localhost:3000/vacina/confirmaVacina';
                    //var params = 'confirmaVacina= '+Resultado+' & idVacina= ${req.Vacina.idVacina}';        
                    http.open('POST', url, true);

                    
                    http.setRequestHeader('Content-type', 'application/json');

                    http.onreadystatechange = function() {
                        document.getElementById('resp').innerHTML = this.responseText
                        }
                        
                    http.send(JSON.stringify({ nomeVacina: nomeVacina, qntDoseVacina: qntDoseVacina, loteVacina: loteVacina, nomeVetVacina: nomeVetVacina, crmvVetVacina: crmvVetVacina, confirmaVacina: Resultado, observacaoVacina: observacaoVacina, idVacina: ${req.Vacina.idVacina} }) );
                    

            }
           
        }

     </script>

</body>
</html>     

    
    `)
}

/*
<!DOCTYPE html>
    <html lang='br'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Agenda animal</title>
    </head>
    <body>
    
        <h1>Ola Somos o Agenda animal!!</h1>
        <h3>Um tutor informa q vc vacinou um de seus animaizinhos, dê uma olhada nos dados e se vc estiver de acordo so selecionar confimar e dar ok </h3>
    
        <label name=''>Nome Veterinario: ${req.Vacina.nomeVetVacina} </label><br>                     
        <label name=''>E-mail Veterinario: ${req.Vacina.emailVetVacina} </label><br>
        <label name=''>CRMV Veterinario: ${req.Vacina.crmvVetVacina} </label><br>
        <label name=''>Nome da Vacina: ${req.Vacina.nomeVacina} </label><br>
        <label name=''>Dosagem da Vacina: ${req.Vacina.qntDoseVacina} </label><br>
        <label name=''>Data da Vacinação: ${req.Vacina.dataApliVacina} </label><br>
        <label name=''> Data da Proxima vacina: ${req.Vacina.dataProxVacina} </label><br>
        <label name=''> Nome do Animal: ${req.Vacina.nomePet} </label><br>
        <p></p>

        <input type='radio' id='confimar' name='gender' onclick='radio(1)' >
        <label for='confimar'>Confirmar</label><br>
    
        <input type='radio' id='cancelar' name='gender' onclick='radio(-1)' >
        <label for="cancelar">Cancelar</label><br>
        
        <p></p>
    
        <button type='button'  onclick='enviar()'>OK</button>
    
        <p></p>
    
        <div id='resp' ></div>
    
    
        <script>
    
            let Resultado = 0;
    
            function radio(id) {
            Resultado = id;
            console.log(Resultado)
            }
            
            function enviar(){
                
                var http = new XMLHttpRequest();
                var url = 'http://localhost:3000/vacina/confirmaVacina';
                //var params = 'confirmaVacina= '+Resultado+' & idVacina= ${req.Vacina.idVacina}';        
                http.open('POST', url, true);
    
                
                http.setRequestHeader('Content-type', 'application/json');
    
                http.onreadystatechange = function() {
                    document.getElementById('resp').innerHTML = this.responseText
                    }
                    
                http.send(JSON.stringify({ confirmaVacina: Resultado , idVacina: ${req.Vacina.idVacina}, dataApliVacina: valor, dataProxVacina = ?, nomeVacina = ?, qntDoseVacina = ?, loteVacina = ?, valorVacina = ?,  nomeVetVacina = ?, emailVetVacina = ?, crmvVetVacina = ?, confirmaVacina = ?, statusVacina = ${status}, observacaoVacina = ?  where idVacina = ? }) );
                
                
            }
    
         </script>
    
    
    </body>
    </html>

*/

/*
`
       <!DOCTYPE html>
    <html lang='br'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Agenda animal</title>
    </head>
    <body>
    
        <h1>Ola Somos o Agenda animal!!</h1>
        <h3>Um tutor informa q vc vacinou um de seus animaizinhos, dê uma olhada nos dados e se for preciso altere, apos se estiver de acordo so selecionar confirmar e dar ok </h3>
    
        <form>
        <label > Nome Veterinario: </label>
        <input id='nomeVetVacina' value= ${req.Vacina.nomeVetVacina} required>
        <p></p>

        <label > E-mail Veterinario: </label>
        <input id='emailVetVacina' value= ${req.Vacina.emailVetVacina} required> <br>
        <p></p>

        <label > CRMV Veterinario: </label>
        <input id='crmvVetVacina' value= ${req.Vacina.crmvVetVacina} required> <br>
        <p></p>

        <label > Nome da Vacina: </label>
        <input id='nomeVacina' value= ${req.Vacina.nomeVacina} required> <br>
        <p></p>

        <label > Dosagem da Vacina: </label>
        <input id='qntDoseVacina' value= ${req.Vacina.qntDoseVacina} required> <br>
        <p></p>

        <label > Lote da Vacina: </label>
        <input id='loteVacina' value= ${req.Vacina.loteVacina} required> <br>
        <p></p>

        <label > Data da Vacinação: </label>
        <input id='dataApliVacina' value= ${req.Vacina.dataApliVacina} required> <br>
        <p></p>

        <label > Data da Proxima vacina: </label>
        <input id='dataProxVacina' value= ${req.Vacina.dataProxVacina} required> <br>
        <p></p>

        <label > Nome do Animal: ${req.Vacina.nomePet} </label>
        <p></p>


        <label> Caso tenha alguma observação preencha: </label> <br>
        <textarea id='observacaoVacina' cols='30' rows='5' ></textarea>

        <p></p>

        <table>
            <tr>
                <td>
                    <input type='radio' id='confimar' name='gender' onclick='radio(1)' >
                    <label for='confimar'>Confirmar</label><br>
                </td>
                <td>
                    <input type='radio' id='cancelar' name='gender' onclick='radio(-1)' >
                    <label for="cancelar">Cancelar</label><br>
                </td>
            </tr>
        </table>

        <p></p>
    
        <button type='button'  onclick='enviar()'>OK</button>
        </form>
        <p></p>
    
        <div id='resp' ></div>
    
    
        <script>
    
            let Resultado = 0;
    
            function radio(id) {
            Resultado = id;
            console.log(Resultado)
            }
            
            function enviar(){

                var nomeVetVacina =  document.getElementById('nomeVetVacina').value;
                var emailVetVacina = document.getElementById('emailVetVacina').value;
                var crmvVetVacina = document.getElementById('crmvVetVacina').value;
                var nomeVacina = document.getElementById('nomeVacina').value;
                var qntDoseVacina = document.getElementById('qntDoseVacina').value;
                var loteVacina = document.getElementById('loteVacina').value;
                var dataApliVacina = document.getElementById('dataApliVacina').value;
                var dataProxVacina = document.getElementById('dataProxVacina').value;
                var observacaoVacina = document.getElementById('observacaoVacina').value;
                

                console.log(nomeVetVacina)
                console.log(dataApliVacina)
                console.log(qntDoseVacina)
                console.log(observacaoVacina)


                var http = new XMLHttpRequest();
                var url = 'http://localhost:3000/vacina/confirmaVacina';
                //var params = 'confirmaVacina= '+Resultado+' & idVacina= ${req.Vacina.idVacina}';        
                http.open('POST', url, true);
    
                
                http.setRequestHeader('Content-type', 'application/json');
    
                http.onreadystatechange = function() {
                    document.getElementById('resp').innerHTML = this.responseText
                    }
                    
                http.send(JSON.stringify({ dataApliVacina: dataApliVacina, dataProxVacina: dataProxVacina, nomeVacina: nomeVacina, qntDoseVacina: qntDoseVacina, loteVacina: loteVacina, nomeVetVacina: nomeVetVacina, emailVetVacina: emailVetVacina, crmvVetVacina: crmvVetVacina, confirmaVacina: Resultado, observacaoVacina: observacaoVacina, idVacina: ${req.Vacina.idVacina} }) );
                
            }
    
         </script>
    
    </body>
    </html>
    
    `)


*/

/*TESTEE 17-03

<!DOCTYPE html>
    <html lang='br'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Agenda animal</title>
    </head>
    <body>
    
        <h1>Ola Somos o Agenda animal!!</h1>
        <h3>Um tutor informa q vc vacinou um de seus animaizinhos, dê uma olhada nos dados e se for preciso altere, apos se estiver de acordo so selecionar confirmar e dar ok </h3>
    
        <form>
        <label > Nome Veterinario: ${req.Vacina.nomeVetVacina} </label><br>
        <p></p> 

        <label > E-mail Veterinario: ${req.Vacina.emailVetVacina} </label> <br>
        <p></p>

        <label > CRMV Veterinario: </label>
        <input id='crmvVetVacina' value= ${req.Vacina.crmvVetVacina} required> <br>
        <p></p>

        <label > Nome da Vacina: </label>
        <input id='nomeVacina' value= ${req.Vacina.nomeVacina} required> <br>
        <p></p>

        <label > Dosagem da Vacina: </label>
        <input id='qntDoseVacina' value= ${req.Vacina.qntDoseVacina} required> <br>
        <p></p>

        <label > Lote da Vacina: </label>
        <input id='loteVacina' value= ${req.Vacina.loteVacina} required> <br>
        <p></p>

        <label > Data da Vacinação: ${req.Vacina.dataApliVacina} </label> <br>
        <p></p>

        <label > Data da Proxima vacina: ${req.Vacina.dataProxVacina} </label> <br>
        <p></p>

        <label > Nome do Animal: ${req.Vacina.nomePet} </label> <br>
        <p></p>


        <label> Caso tenha alguma observação preencha: </label> <br>
        <textarea id='observacaoVacina' cols='30' rows='5' ></textarea>

        <p></p>

        <table>
            <tr>
                <td>
                    <input type='radio' id='confimar' name='gender' onclick='radio(1)' >
                    <label for='confimar'>Confirmar</label><br>
                </td>
                <td>
                    <input type='radio' id='cancelar' name='gender' onclick='radio(-1)' >
                    <label for="cancelar">Cancelar</label><br>
                </td>
            </tr>
        </table>

        <p></p>
    
        <button type='button'  onclick='enviar()'>OK</button>
        </form>
        <p></p>
    
        <div id='resp' ></div>
    
    
        <script>
    
            let Resultado = 0;
    
            function radio(id) {
            Resultado = id;
            console.log(Resultado)
            }
            
            function enviar(){

                var nomeVetVacina =  document.getElementById('nomeVetVacina').value;
                var emailVetVacina = document.getElementById('emailVetVacina').value;
                var crmvVetVacina = document.getElementById('crmvVetVacina').value;
                var nomeVacina = document.getElementById('nomeVacina').value;
                var qntDoseVacina = document.getElementById('qntDoseVacina').value;
                var loteVacina = document.getElementById('loteVacina').value;
                var dataApliVacina = document.getElementById('dataApliVacina').value;
                var dataProxVacina = document.getElementById('dataProxVacina').value;
                var observacaoVacina = document.getElementById('observacaoVacina').value;
                

                console.log(nomeVetVacina)
                console.log(dataApliVacina)
                console.log(qntDoseVacina)
                console.log(observacaoVacina)


                var http = new XMLHttpRequest();
                var url = 'http://localhost:3000/vacina/confirmaVacina';
                //var params = 'confirmaVacina= '+Resultado+' & idVacina= ${req.Vacina.idVacina}';        
                http.open('POST', url, true);
    
                
                http.setRequestHeader('Content-type', 'application/json');
    
                http.onreadystatechange = function() {
                    document.getElementById('resp').innerHTML = this.responseText
                    }
                    
                http.send(JSON.stringify({ dataApliVacina: dataApliVacina, dataProxVacina: dataProxVacina, nomeVacina: nomeVacina, qntDoseVacina: qntDoseVacina, loteVacina: loteVacina, nomeVetVacina: nomeVetVacina, emailVetVacina: emailVetVacina, crmvVetVacina: crmvVetVacina, confirmaVacina: Resultado, observacaoVacina: observacaoVacina, idVacina: ${req.Vacina.idVacina} }) );
                
            }
    
         </script>
    
    </body>
    </html>



*/