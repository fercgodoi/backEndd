const express = require('express');
const router = express.Router();
//const mysql = require('mysql');
//const mysql = require('../../mysql').pool;              //para conectar ao banco
//const multer = require('multer');                       //para salvar imagens
//const nodemailer = require("nodemailer");               //para enviar emails
//const bcrypt = require('bcrypt');                       //hash nas senhas
const login = require('../../middleware/login');

const vacinaController = require('../../controllers/vacinas/vacina-controller');

router.post('/inserirVacina', login.obrigatorio, vacinaController.inserirVacina);

router.post('/atualizarVacina', login.obrigatorio, vacinaController.atualizarVacina);    //

router.post('/buscarVacina', login.obrigatorio, vacinaController.buscarVacina); 

router.post('/deletarVacina', login.obrigatorio, vacinaController.deletarVacina); 

module.exports = router; 