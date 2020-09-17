const express = require('express');
const router = express.Router();

const TesteController = require('../../controllers/teste/teste-controller');

router.post('/SelectAgendamento', TesteController.SelectAgendamento);
// Prestador/CadPriPrest
module.exports = router;
