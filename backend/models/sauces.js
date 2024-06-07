// Appel de Mongoose
const mongoose = require('mongoose');

//Création du schéma de données pour l'utilisateur
const thingSauces = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
  // userId: { type: String, required: true },
  // name: { type: String, required: false },
  // manufacturer: { type: String, required: false },
  // description: { type: String, required: true },
  // mainPepper: { type: String, required: false },
  // imageUrl: { type: String, required: false },
  // heat: { type: Number, required: false },
  // likes: { type: Number },
  // dislikes: { type: Number },
  // userLiked:  { type: String },
  // userDisliked: { type: String },
});


// Export du schéma sous forme de modèle de nom "Sauces" de forme sauceSchema
module.exports = mongoose.model('Sauces', thingSauces);