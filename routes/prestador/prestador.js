const express = require('express');
const router = express.Router();
const login = require('../../middleware/login');

const PrestadorController = require('../../controllers/prestador/prestador-controller');

router.post('/CadPriPrest',PrestadorController.CadPriPrest);
router.post('/CadSegPrest',login.inicio,PrestadorController.CadSegPrest);
router.post('/CadTercPrest',login.inicio,PrestadorController.CadTercPrest);
router.post('/CadQuartPrest',login.inicio,PrestadorController.CadQuartPrest);
router.post('/CadCincoPrest',login.inicio,PrestadorController.CadCincoPrest);
router.post('/CadSeisPrest',login.inicio,PrestadorController.CadSeisPrest);
router.post('/CadSetePrest',login.inicio,PrestadorController.CadSetePrest);

module.exports = router;