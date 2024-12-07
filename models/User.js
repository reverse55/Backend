// On importe mongoose pour pouvoir créer des schémas et interagir avec MongoDB
const mongoose = require("mongoose"); // Mongoose est une bibliothèque qui facilite l'utilisation de MongoDB en JavaScript

// On importe mongoose-unique-validator pour ajouter une contrainte d'unicité aux champs dans le schéma
const uniqueValidator = require("mongoose-unique-validator"); // Ce module garantit que certains champs (par exemple, email) sont uniques dans la base de données

// On définit un schéma pour les utilisateurs (User)
const userSchema = mongoose.Schema({
  // Le champ "email" contient l'adresse e-mail de l'utilisateur. Il est obligatoire et doit être unique dans la base de données
  email: { type: String, required: true, unique: true },

  // Le champ "password" contient le mot de passe de l'utilisateur. Il est obligatoire
  password: { type: String, required: true },
});

// On applique le plugin "mongoose-unique-validator" au schéma pour ajouter la contrainte d'unicité sur le champ "email"
userSchema.plugin(uniqueValidator);

// On exporte le modèle "User" qui correspond à ce schéma. Ce modèle nous permettra de manipuler des utilisateurs dans la base de données MongoDB.
module.exports = mongoose.model("User", userSchema);
