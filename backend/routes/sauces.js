// Appel de Express
const express = require("express");

//Création d'un router via Express
const router = express.Router();

// Importation des middlewwares de controllers 
const auth = require('../middleware/auth');
const multer = require("../middleware/multer-config");
const saucesCtrl = require('../controllers/sauces');

// Création des routes
router.get("/", auth, saucesCtrl.getAllSauces);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.post("/", auth, multer, saucesCtrl.createSauces);
router.put('/:id', auth, multer, saucesCtrl.updateSauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, saucesCtrl.likesDislikesSauce);

module.exports = router;
