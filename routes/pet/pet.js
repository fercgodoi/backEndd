const express = require('express');
const router = express.Router();
const login = require('../../middleware/login');

const PetController = require('../../controllers/pet/pet-controller');

router.post('/BuscarPet',login.obrigatorio,PetController.buscarRg);

module.exports = router;