exports.EnviarVacVet = (req, res, next) => {
   return res.status(200).send(
       `<!DOCTYPE html>
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
    
        <input type='radio' id='cancelar' name='gender' onclick='radio(3)' >
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
                    
                http.send(JSON.stringify({ confirmaVacina: Resultado , idVacina: ${req.Vacina.idVacina}}) );
                
                
            }
    
         </script>
    
    
    </body>
    </html>
    
    `)
}

 /*(dataApliVacina, dataProxVacina, nomeVacina, qntDoseVacina, nomePet, nomeVetVacina, emailVetVacina, crmvVetVacina, token)
        <label name=''>Nome Veterinario: ${nomeVetVacina} </label><br>                      //terminar aqui-----------//
        <label name=''>E-mail Veterinario: ${emailVetVacina} </label><br>
        <label name=''>CRMV Veterinario: ${crmvVetVacina} </label><br>
        <label name=''>Nome da Vacina: ${nomeVacina} </label><br>
        <label name=''>Dosagem da Vacina: ${qntDoseVacina} </label><br>
        <label name=''>Data da Vacinação: ${dataApliVacina} </label><br>
        <label name=''> Data da Proxima vacina: ${dataProxVacina} </label><br>
        <label name=''> Nome do Animal: ${nomePet} </label><br>
        <p></p>

         'Authorization': 'Bearer ' + ${token}
    */