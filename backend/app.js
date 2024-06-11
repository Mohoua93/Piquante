require("dotenv").config(); // Chargement des variables d'environnement à partir d'un fichier .env
const express = require("express"); // Importation d'Express pour créer le serveur
const mongoose = require("mongoose"); // Importation de Mongoose pour interagir avec MongoDB
const path = require('path'); // Importation de Path pour travailler avec les chemins de fichiers
const helmet = require("helmet"); // Importation de Helmet pour sécuriser les en-têtes HTTP
const mongoSanitize = require("express-mongo-sanitize"); // Importation de mongoSanitize pour protéger contre les injections NoSQL

// Importation des routes pour les sauces et les utilisateurs
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// Création de l'application Express
const app = express();

// Connexion à la base de données MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.141pkai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !")) // Message de succès si la connexion est établie
  .catch(() => console.log("Connexion à MongoDB échouée !")); // Message d'erreur si la connexion échoue

// Middleware CORS pour permettre les requêtes cross-origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permet à toutes les origines d'accéder à l'API
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // Permet certains en-têtes spécifiques
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // Permet certains types de requêtes HTTP
  next(); // Passe au middleware suivant
});

// Middleware pour parser les requêtes avec un corps JSON
app.use(express.json());

// Utilisation de Helmet pour sécuriser les en-têtes HTTP, en particulier pour gérer les politiques de ressources cross-origin
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Utilisation de mongoSanitize pour protéger contre les injections NoSQL
app.use(mongoSanitize());

// Définition des routes pour les utilisateurs et les sauces
app.use('/api/auth/', userRoutes); // Route pour l'authentification des utilisateurs
app.use('/images', express.static(path.join(__dirname, 'images'))); // Route pour servir les fichiers images statiques
app.use('/api/sauces', saucesRoutes); // Route pour les sauces

// Exportation de l'application Express pour pouvoir être utilisée par d'autres fichiers, par exemple pour le démarrage du serveur
module.exports = app;
