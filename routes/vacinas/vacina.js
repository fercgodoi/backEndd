const express = require('express');
const router = express.Router();
const login = require('../../middleware/login');

const vacinaController = require('../../controllers/vacinas/vacina-controller');

<<<<<<< HEAD
router.post('/inserirVac', login.obrigatorio,vacinaController.inserirVacina);
router.post('/FiltroVac', login.obrigatorio,vacinaController.FiltroVac); 
router.post('/BuscarInfo', login.obrigatorio,vacinaController.BuscarInfo); 
router.post('/buscarVacina', login.obrigatorio,vacinaController.buscarVacinas); 
=======
router.post('/inserirVacina', login.obrigatorio, vacinaController.inserirVacina);

router.post('/atualizarVacina', login.obrigatorio, vacinaController.atualizarVacina);    //

router.post('/buscarVacina', login.obrigatorio, vacinaController.buscarVacina); 

router.post('/deletarVacina', login.obrigatorio, vacinaController.deletarVacina);

router.post('/confirmaVacina', vacinaController.confirmaVacina);


router.get('/respostaVacina/:token',login.vacinaPet, vacinaConfirma.EnviarVacVet);

//teste//
router.post('/teste', vacinaController.teste);
>>>>>>> fbe9456689e9e11b5a2ce02712a02b75a8edf8bd

module.exports = router; 