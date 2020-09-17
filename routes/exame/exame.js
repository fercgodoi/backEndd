const express = require('express');
const router = express.Router();
const login = require('../../middleware/login');

const ExameController = require('../../controllers/exame/exame-controller');

router.post('/CadExame',login.obrigatorio, ExameController.CadExames);
router.post('/BuscarInfo',login.obrigatorio, ExameController.BuscarInfo);

module.exports = router;
