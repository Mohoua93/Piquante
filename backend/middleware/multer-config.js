//Appel multer
const multer = require('multer');

//Dictionnaire des extensions pour les images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Objet de coonfig de multer pour enregistrer les images sur le disque
const storage = multer.diskStorage({
  // destination d'enregistrement
  destination: (req, file, callback) => {
    callback(null, 'images'); // null pour dire aucune erreur et images sur le nom du dossier
  },
  //nommer le fichier avec un nom unique
  filename: (req, file, callback) => {
    // générer le nouveau nom avec le nom d'origine en remplançant les espaces par un _
    const name = file.originalname.split(' ').join('_');
    // enlever la première etensions qui reste dans le name
    const nameFile = name.split(".")[0];
    //appliquer une extension au fichier
    const extension = MIME_TYPES[file.mimetype];
    //nom complet name + heure à la mili seconde + . + extension
    callback(null, name + Date.now() + '.' + extension);
  }
});

//exporter avec la méthode multer, l'objet avec la méthode single pour dire que c'est un fichier unique
module.exports = multer({storage: storage}).single('image');