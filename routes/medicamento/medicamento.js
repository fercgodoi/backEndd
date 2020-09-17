const express = require('express');
const router = express.Router();
const login = require('../../middleware/login');

const medicacaoController = require('../../controllers/medicamento/medicamento-controller');

router.post('/CadastroMed',login.obrigatorio, medicacaoController.CadastroMed);
router.post('/BuscarMed',login.obrigatorio, medicacaoController.buscarMed);
router.post('/FiltroMed',login.obrigatorio, medicacaoController.FiltroMed);
router.post('/BuscarInfo',login.obrigatorio, medicacaoController.BuscarInfo);

router.post('/CadastroMedInserir',login.obrigatorio, medicacaoController.CadastroMedInserir);

module.exports = router; 