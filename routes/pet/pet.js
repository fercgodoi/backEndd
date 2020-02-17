const express = require('express');
const router = express.Router();
const login = require('../../middleware/login');

const petController = require('../../controllers/pet/pet-controller');


router.get('/listarPet', petController.listarPet);

router.post('/inserirPet', login.obrigatorio, petController.inserirPet);    //

router.get ('/buscarPets', login.obrigatorio, petController.buscarPets);       //

router.get('/buscaPetId/:idPet', login.obrigatorio, petController.buscaPetId);       //

router.post('/atualizarPet', login.obrigatorio, petController.atualizarPet);    //

router.delete('/deletarPet', login.obrigatorio, petController.deletePet);      //

module.exports = router; 