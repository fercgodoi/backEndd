const express = require('express');
const router = express.Router();
const login = require('../../middleware/login');

const vacinaController = require('../../controllers/vacinas/vacina-controller');


router.post('/inserirVac', login.obrigatorio,vacinaController.inserirVacina);
router.post('/FiltroVac', login.obrigatorio,vacinaController.FiltroVac); 
router.post('/BuscarInfo', login.obrigatorio,vacinaController.BuscarInfo); 
router.post('/buscarVacina', login.obrigatorio,vacinaController.buscarVacinas); 

router.post('/buscarVacinasSolicitadas', login.obrigatorio,vacinaController.buscarVacinasSolicitadas); 
router.post('/AprovarVacinasSolicitadas', login.obrigatorio,vacinaController.AprovarVacinasSolicitadas); 
router.post('/NegarVacinasSolicitadas', login.obrigatorio,vacinaController.NegarVacinasSolicitadas); 

<<<<<<< HEAD
router.post('/inserirVacinaCad', login.obrigatorio,vacinaController.inserirVacinaCad);
=======

>>>>>>> b9f2d5467d2384cbfec1b650d6859601141eebad
module.exports = router; 