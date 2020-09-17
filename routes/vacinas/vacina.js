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

router.post('/inserirVacinaCad', login.obrigatorio,vacinaController.inserirVacinaCad);
module.exports = router; 