const bcrypt = require("bcrypt"); // Utilisé pour chiffrer les mots de passe avant de les stocker
const jsonWebToken = require("jsonwebtoken"); // Utilisé pour créer des tokens d'authentification
const User = require("../models/User"); // Modèle utilisateur pour interagir avec la base de données
require("dotenv").config(); // Charger les variables d'environnement (comme la clé secrète pour le token)
const { SECRET_TOKEN } = process.env; // Récupérer la clé secrète de l'environnement pour signer les tokens

// Inscription d'un nouvel utilisateur
exports.signup = (req, res) => {
  // On chiffre le mot de passe avant de le sauvegarder dans la base de données
  bcrypt
    .hash(req.body.password, 10) // "10" est le coût du hashage (plus élevé = plus sécurisé)
    .then((hash) => {
      // Créer un nouvel utilisateur avec l'email et le mot de passe chiffré
      const user = new User({
        email: req.body.email, // L'email de l'utilisateur
        password: hash, // Le mot de passe chiffré
      });

      // Sauvegarder le nouvel utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" })) // Succès
        .catch((error) => res.status(400).json({ error })); // En cas d'erreur (par exemple, email déjà pris)
    })
    .catch((error) => res.status(500).json({ error })); 
};

// Connexion d'un utilisateur existant
exports.login = (req, res) => {
  // Rechercher un utilisateur dans la base de données en fonction de l'email fourni
  User.findOne({ email: req.body.email })
    .then((user) => {
      // Si l'utilisateur n'existe pas
      if (!user) {
        return res.status(401).json({ message: "Utilisateur ou mot de passe incorrect." });
      }

      // Comparer le mot de passe fourni avec celui stocké dans la base de données
      bcrypt
        .compare(req.body.password, user.password) // Vérifier si les mots de passe correspondent
        .then((passwordValid) => {
          if (!passwordValid) {
            // Si le mot de passe ne correspond pas
            return res.status(401).json({ message: "Utilisateur ou mot de passe incorrect." });
          }

          // Si le mot de passe est correct, générer un token d'authentification
          const token = jsonWebToken.sign(
            { userId: user._id }, // Ajouter l'ID de l'utilisateur dans le token
            SECRET_TOKEN, // Utiliser la clé secrète pour signer le token
            { expiresIn: "24h" } // Le token expire après 24 heures
          );

          // Envoyer le token et l'ID utilisateur au client
          res.status(200).json({ userId: user._id, token });
        })
        .catch((error) => res.status(500).json({ error })); // Erreur lors de la comparaison des mots de passe
    })
    .catch((error) => res.status(500).json({ error })); // Erreur lors de la recherche de l'utilisateur
};
