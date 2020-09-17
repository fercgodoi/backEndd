const express = require('express');
const router = express.Router();
const login = require('../../middleware/login');

const PrestadorController = require('../../controllers/prestador/prestador-controller');
const CadastroPrimeiroController = require('../../controllers/prestador/CadastroPrimeiro');

router.post('/CadPriPrest',PrestadorController.CadPriPrest);
router.post('/CadSegPrest',login.inicio,PrestadorController.CadSegPrest);
router.post('/CadTercPrest',login.inicio,PrestadorController.CadTercPrest);
router.post('/CadQuartPrest',login.inicio,PrestadorController.CadQuartPrest);
router.post('/CadCincoPrest',login.inicio,PrestadorController.CadCincoPrest);
// router.post('/CadSeisPrest',login.inicio,PrestadorController.CadSeisPrest);
router.post('/CadSetePrest',login.inicio,PrestadorController.CadSetePrest);
router.post('/BuscaPrest',login.obrigatorio,PrestadorController.BuscaPrest);
router.post('/BuscaServicoPrest',login.obrigatorio,PrestadorController.BuscaServicosPrest);
router.post('/EditarServicosPrest',login.obrigatorio,PrestadorController.EditarServicosPrest);
router.post('/ExcluirServicosPrest',login.obrigatorio,PrestadorController.ExcluirServicosPrest);
router.post('/EditarPrest',login.obrigatorio,PrestadorController.EditarPrest);
router.post('/BuscarPrest2',login.obrigatorio,PrestadorController.BuscaPrest2);
router.post('/BuscaServicosPresQuatro',login.inicio,PrestadorController.BuscaServicosPresQuatro);

module.exports = router;