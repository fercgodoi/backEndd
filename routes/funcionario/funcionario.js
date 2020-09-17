const express = require('express');
const router = express.Router();
const login = require('../../middleware/login');

const FuncionarioController = require('../../controllers/funcionario/funcionario-controller');

router.post('/AtualizarFunc',login.obrigatorio, FuncionarioController.AtualizarFunc);
router.post('/BuscarFunc',login.obrigatorio, FuncionarioController.BuscarFunc);
router.post('/Buscar', login.obrigatorio,FuncionarioController.Buscar);
router.post('/BuscarFuncPrest', login.obrigatorio,FuncionarioController.BuscarFuncPrest);
router.post('/CadastrarFunc',login.obrigatorio, FuncionarioController.CadastroFuncionario);
router.post('/CodFunc',login.obrigatorio,FuncionarioController.CodFunc);
router.post('/ExcluirFunc',login.obrigatorio,FuncionarioController.ExcluirFunc);
router.post('/TrocarSenhaFunc',login.obrigatorio,FuncionarioController.TrocarSenhaFunc);
router.post('/FiltroFunc',login.obrigatorio,FuncionarioController.FiltroFunc);
router.post('/LoginFunc',FuncionarioController.LoginFunc);
router.post('/EsqueciSenhaFunc',FuncionarioController.EsqueciSenhaFunc);

router.post('/FuncClinica', login.obrigatorio,FuncionarioController.FuncClinica);

router.post('/VetouNao', login.obrigatorio,FuncionarioController.VetouNao);


module.exports = router;