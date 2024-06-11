const jwt = require('jsonwebtoken'); // Importation de jsonwebtoken pour la gestion des tokens JWT

module.exports = (req, res, next) => {
    try {
        // Récupère le token depuis le header Authorization de la requête
        // Le token est généralement envoyé sous la forme "Bearer <token>", d'où la séparation par espace et la récupération du second élément
        const token = req.headers.authorization.split(" ")[1];

        // Vérifie et décode le token en utilisant la clé secrète 'RANDOM_TOKEN_SECRET'
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

        // Extrait l'ID utilisateur du token décodé
        const userId = decodedToken.userId;

        // Ajoute l'ID utilisateur au champ auth de l'objet requête pour pouvoir l'utiliser dans les prochaines middlewares/routes
        req.auth = {
            userId: userId
        };

        // Passe au middleware ou à la route suivante
        next();
    } catch (error) {
        // En cas d'erreur (par exemple, si le token est invalide ou manquant), renvoie une réponse avec le statut 401 (non autorisé) et l'erreur
        res.status(401).json({ error });
    }
};
