// Appel de Express
const express = require('express');

// Création router
const router = express.Router();

//Importation des middlewares des controllers
const userCtrl = require('../controllers/user');

// Création des routes d'inscription et de connexion
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;