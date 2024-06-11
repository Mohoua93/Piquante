const http = require('http'); // Importation du module HTTP pour créer le serveur
const app = require('./app'); // Importation de l'application Express

// Fonction pour normaliser le port en s'assurant qu'il est valide
const normalizePort = val => {
  const port = parseInt(val, 10); // Convertit le port en nombre entier

  if (isNaN(port)) {
    return val; // Si ce n'est pas un nombre, renvoie la valeur telle quelle
  }
  if (port >= 0) {
    return port; // Si le port est un nombre valide, le renvoie
  }
  return false; // Si le port est invalide, renvoie false
};

const port = normalizePort(process.env.PORT || '3000'); // Normalise le port en utilisant la variable d'environnement PORT ou 3000 par défaut
app.set('port', port); // Définit le port de l'application

// Gestionnaire d'erreurs pour le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error; // Si l'erreur n'est pas liée à l'écoute du serveur, la lance
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; // Détermine si l'adresse est une pipe ou un port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.'); // Affiche une erreur si des privilèges élevés sont requis
      process.exit(1); // Termine le processus avec un échec
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.'); // Affiche une erreur si le port est déjà utilisé
      process.exit(1); // Termine le processus avec un échec
      break;
    default:
      throw error; // Lance l'erreur pour tous les autres codes d'erreur
  }
};

const server = http.createServer(app); // Crée un serveur HTTP en utilisant l'application Express

server.on('error', errorHandler); // Écoute les erreurs du serveur et appelle errorHandler en cas d'erreur
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // Détermine si l'adresse est une pipe ou un port
  console.log('Listening on ' + bind); // Affiche un message indiquant que le serveur écoute sur l'adresse ou le port
});

server.listen(port); // Démarre le serveur en écoutant sur le port normalisé
