const express = require('express');
const router = express.Router();      
const login = require('../../middleware/login');

const ProntuarioController = require('../../controllers/prontuario/prontuario-controller');

router.post('/CadProtuario',login.obrigatorio,ProntuarioController.CadProntuario);
router.post('/BuscarPront',login.obrigatorio,ProntuarioController.buscarPront);
router.post('/FiltroPront',login.obrigatorio,ProntuarioController.FiltroPront);
router.post('/BuscarInfo',login.obrigatorio,ProntuarioController.BuscarInfo);
router.post('/BuscarInfoPet', login.obrigatorio,ProntuarioController.BuscarInfoPet);
module.exports = router;