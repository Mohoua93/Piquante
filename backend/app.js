require("dotenv").config(); // Accès aux variables d'environnement
const express = require("express"); // Appel d'Express
const mongoose = require("mongoose");// Appel Mongoose, base de donnée
const path = require('path'); // Appel Path, système de fichier, donne un accès
const helmet = require("helmet"); // Appel Helmet, sécuritée en-tête HTTP
const mongoSanitize = require("express-mongo-sanitize"); //protège des attaques par injection NoSQL(MongoDB) en nettoyant les données et supprime les clés incriminées


// Importation des routes
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// Création de app avec le framework Express
const app = express();

// Connexion à ma base de données MongoDb
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.141pkai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));


// Middleware CORS permettant à tout le monde d'envoyer des requêtes, évitant ainsi les erreurs CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(mongoSanitize());

app.use('/api/auth/', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);


module.exports = app;
