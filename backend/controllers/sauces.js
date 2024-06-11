const fs = require("fs");
const Sauces = require("../models/sauces");

// Récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
  // Utilise la méthode find() de Mongoose pour récupérer toutes les sauces de la base de données
  Sauces.find()
    .then((sauces) => {
      // En cas de succès, renvoie les sauces avec un statut 200
      res.status(200).json(sauces);
    })
    .catch((error) => {
      // En cas d'erreur, renvoie un statut 400 avec l'erreur
      res.status(400).json({ error: error });
    });
};

// Récupérer une sauce par son ID
exports.getOneSauce = (req, res, next) => {
  // Utilise la méthode findOne() de Mongoose pour récupérer une sauce par son ID
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      // En cas de succès, renvoie la sauce avec un statut 200
      res.status(200).json(sauce);
    })
    .catch((error) => {
      // En cas d'erreur, renvoie un statut 404 avec l'erreur
      res.status(404).json({ error: error });
    });
};

// Créer une nouvelle sauce
exports.createSauces = (req, res, next) => {
  // Parse l'objet sauce de la requête
  const sauceObject = JSON.parse(req.body.sauce);
  // Supprime les propriétés _id et _userId de l'objet pour éviter les conflits
  delete sauceObject._id;
  delete sauceObject._userId;

  // Crée une nouvelle instance de Sauce avec les données fournies et les valeurs par défaut
  const sauce = new Sauces({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  // Sauvegarde la nouvelle sauce dans la base de données
  sauce
    .save()
    .then(() => {
      // En cas de succès, renvoie un message avec un statut 201
      res.status(201).json({ message: "Sauce enregistrée !" });
    })
    .catch((error) => {
      // En cas d'erreur, renvoie un statut 400 avec l'erreur
      res.status(400).json({ error: error });
    });
};

// Mettre à jour une sauce existante
exports.updateSauce = (req, res, next) => {
  // Détermine si un fichier a été envoyé avec la requête
  const sauceObject = req.file
    ? {
        // Si un fichier est présent, parse l'objet sauce et met à jour l'URL de l'image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }; // Sinon, utilise les données du corps de la requête

  // Supprime l'ID utilisateur de l'objet pour des raisons de sécurité
  delete sauceObject._userId;

  // Trouve la sauce à mettre à jour dans la base de données
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Vérifie si l'utilisateur est autorisé à mettre à jour la sauce
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        if (req.file) {
          // Si un nouveau fichier a été envoyé, supprime l'ancienne image
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            // Met à jour la sauce avec les nouvelles données
            Sauces.updateOne(
              { _id: req.params.id },
              { ...sauceObject, _id: req.params.id }
            )
              .then(() => res.status(200).json({ message: "Objet modifié!" }))
              .catch((error) => res.status(401).json({ error }));
          });
        } else {
          // Si aucun fichier n'a été envoyé, met simplement à jour la sauce
          Sauces.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Objet modifié!" }))
            .catch((error) => res.status(401).json({ error }));
        }
      }
    })
    .catch((error) => {
      // En cas d'erreur, renvoie un statut 400 avec l'erreur
      res.status(400).json({ error: error });
    });
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  // Trouve la sauce à supprimer dans la base de données
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Vérifie si l'utilisateur est autorisé à supprimer la sauce
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        // Supprime l'image associée à la sauce
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          // Supprime la sauce de la base de données
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      // En cas d'erreur, renvoie un statut 500 avec l'erreur
      res.status(500).json({ error: error });
    });
};

// Gérer les likes et dislikes sur une sauce
exports.likesDislikesSauce = (req, res, next) => {
  // Récupère les valeurs du like et de l'utilisateur de la requête
  let like = req.body.like;
  let userId = req.body.userId;

  // Trouve la sauce concernée dans la base de données
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Gestion des trois cas possibles : like, dislike, retrait du like/dislike
      switch (like) {
        case 1:
          // Si l'utilisateur a liké la sauce, incrémente le nombre de likes et ajoute l'utilisateur au tableau usersLiked
          Sauces.updateOne(
            { _id: req.params.id },
            { $inc: { likes: +1 }, $push: { usersLiked: userId } }
          )
            .then(() => res.status(200).json({ message: "Sauce liké !" }))
            .catch((error) => res.status(401).json({ error }));
          break;

        case -1:
          // Si l'utilisateur a disliké la sauce, incrémente le nombre de dislikes et ajoute l'utilisateur au tableau usersDisliked
          Sauces.updateOne(
            { _id: req.params.id },
            { $inc: { dislikes: +1 }, $push: { usersDisliked: userId } }
          )
            .then(() => res.status(200).json({ message: "Sauce disliké !" }))
            .catch((error) => res.status(401).json({ error }));
          break;

        case 0:
          // Si l'utilisateur retire son like ou dislike
          if (sauce.usersLiked.includes(userId)) {
            // Si l'utilisateur avait liké, décrémente le nombre de likes et retire l'utilisateur du tableau usersLiked
            Sauces.updateOne(
              { _id: req.params.id },
              { $inc: { likes: -1 }, $pull: { usersLiked: userId } }
            )
              .then(() =>
                res.status(200).json({ message: "Le like a été retiré !" })
              )
              .catch((error) => res.status(401).json({ error }));
          } else if (sauce.usersDisliked.includes(userId)) {
            // Si l'utilisateur avait disliké, décrémente le nombre de dislikes et retire l'utilisateur du tableau usersDisliked
            Sauces.updateOne(
              { _id: req.params.id },
              { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } }
            )
              .then(() =>
                res.status(200).json({ message: "Le dislike a été retiré !" })
              )
              .catch((error) => res.status(401).json({ error }));
          }
          break;

        default:
          // Si la valeur de like n'est pas valide, renvoie une erreur
          res.status(400).json({ error: "Invalid like value" });
      }
    })
    .catch((error) => res.status(500).json({ error: error }));
};
