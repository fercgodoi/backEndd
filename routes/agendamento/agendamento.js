const express = require('express');
const router = express.Router();
const login = require('../../middleware/login');

const AgendamentoController = require('../../controllers/agendamento/agendamento-controller');


router.post('/BuscarConfAgendamento', AgendamentoController.buscarAgendamentoConf);

router.post('/BuscarAgend', login.obrigatorio,AgendamentoController.buscarAgend);
router.post('/BuscarAgendamento', login.obrigatorio,AgendamentoController.buscarAgendamento);
router.post('/ConfAgendamento',login.obrigatorio, AgendamentoController.ConfirmarAgendamento);
router.post('/NegarAgendamento',login.obrigatorio, AgendamentoController.NegarAgendamento);
router.post('/BuscarPendente', login.obrigatorio,AgendamentoController.BuscarPendente);
router.post('/BuscarAprovados', login.obrigatorio,AgendamentoController.BuscarAprovados);
router.post('/BuscarNegado', login.obrigatorio,AgendamentoController.BuscarNegado);
router.post('/ContAgendamentoDia',login.obrigatorio, AgendamentoController.ContAgendamentoDia);
router.post('/BuscarAprovadosDia',login.obrigatorio, AgendamentoController.BuscarAprovadosDia);

module.exports = router;