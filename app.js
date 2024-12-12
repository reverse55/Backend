// Importation des modules nécessaires
const express = require("express"); // Framework pour créer le serveur
const mongoose = require("mongoose"); // Pour connecter et gérer MongoDB
const cors = require("cors"); // Gestion entre le frontend et le backend
const path = require("path"); // Manipuler les chemins de fichiers et de répertoires p
const routesBooks = require("./routes/routes_books"); // Routes pour les livres
const routesUsers = require("./routes/routes_users"); // Routes pour les utilisateurs
require("dotenv").config(); // Charger les variables d'environnement

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.error(" Échec de la connexion à MongoDB :"));

// Initialisation de l'application Express
const app = express(); 

// Middleware pour gérer les données JSON dans les requêtes acdr mad
app.use(express.json());

// Middleware pour activer CORS (partage des ressources entre frontend et backend)
app.use(cors());

// Définition des routes
app.use("/api/books", routesBooks); // Toutes les requêtes vers "/api/books" utiliseront routesBooks
app.use("/api/auth", routesUsers); // Toutes les requêtes vers "/api/auth" utiliseront routesUsers

// Servir des images stockées dans le dossier "images"
app.use("/images", express.static(path.join(__dirname, "images")));

// Exporter l'application Express pour pouvoir l'utiliser ailleurs
module.exports = app;