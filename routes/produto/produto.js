const express = require('express');
const router = express.Router();
const login = require('../../middleware/login');

const ProdutoController = require('../../controllers/produto/produto-controller');

router.post('/BuscarProd',login.obrigatorio,ProdutoController.BuscarProdutos);
router.post('/FiltroProd', login.obrigatorio,ProdutoController.FiltrarProd);
router.post('/Buscar',login.obrigatorio,ProdutoController.Buscar);
router.post('/DeleteProd',login.obrigatorio,ProdutoController.DeletarProd);
router.post('/CadastrarProd',login.obrigatorio, ProdutoController.CadastrarProdutos);
router.post('/EditarProd', login.obrigatorio,ProdutoController.EditarProd);

module.exports = router;