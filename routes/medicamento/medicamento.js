const express = require('express');
const router = express.Router();
const login = require('../../middleware/login');

const medicacaoController = require('../../controllers/medicamento/medicamento-controller');

router.post('/CadastroMed',login.obrigatorio, medicacaoController.CadastroMed);
router.post('/BuscarMed',login.obrigatorio, medicacaoController.buscarMed);
router.post('/FiltroMed',login.obrigatorio, medicacaoController.FiltroMed);
router.post('/BuscarInfo',login.obrigatorio, medicacaoController.BuscarInfo);

<<<<<<< HEAD
router.post('/CadastroMedInserir',login.obrigatorio, medicacaoController.CadastroMedInserir);

=======
>>>>>>> b9f2d5467d2384cbfec1b650d6859601141eebad
module.exports = router; 