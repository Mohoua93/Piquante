const bcrypt = require('bcrypt'); // Importation de bcrypt pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Importation de jsonwebtoken pour la gestion des tokens JWT
const User = require('../models/user'); // Importation du modèle User

// Inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    // Hachage du mot de passe fourni par l'utilisateur avec un facteur de coût de 10
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Création d'un nouvel utilisateur avec l'email et le mot de passe haché
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // Sauvegarde de l'utilisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // Renvoie un statut 201 si l'utilisateur est créé avec succès
          .catch(error => res.status(400).json({ error })); // Renvoie une erreur 400 en cas de problème lors de la sauvegarde
      })
      .catch(error => res.status(500).json({ error })); // Renvoie une erreur 500 en cas de problème avec le hachage du mot de passe
};

// Connexion d'un utilisateur existant
exports.login = (req, res, next) => {
    // Recherche de l'utilisateur dans la base de données par son email
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                // Si l'utilisateur n'est pas trouvé, renvoie une erreur 401
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Comparaison du mot de passe fourni avec le mot de passe haché stocké dans la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        // Si le mot de passe est incorrect, renvoie une erreur 401
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // Si le mot de passe est correct, renvoie un statut 200 avec l'ID utilisateur et un token JWT
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id }, // Données encodées dans le token
                            'RANDOM_TOKEN_SECRET', // Clé secrète pour signer le token
                            { expiresIn: '24h' } // Le token expire dans 24 heures
                        )
                    });
                })
                .catch(error => res.status(500).json({ error })); // Renvoie une erreur 500 en cas de problème avec la comparaison des mots de passe
        })
        .catch(error => res.status(500).json({ error })); // Renvoie une erreur 500 en cas de problème lors de la recherche de l'utilisateur
};
