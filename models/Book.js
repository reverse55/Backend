// On importe mongoose pour pouvoir créer des schémas et interagir avec MongoDB
const mongoose = require("mongoose"); // Mongoose est une bibliothèque qui simplifie l'utilisation de MongoDB en JavaScript

// On définit un schéma pour la collection "Book" (livres) dans MongoDB
const bookSchema = mongoose.Schema({
  // Le champ "userId" correspond à l'identifiant de l'utilisateur qui a créé ce livre
  userId: { type: String, required: true }, // Ce champ est obligatoire

  // Le champ "title" contient le titre du livre
  title: { type: String, required: true }, 

  // Le champ "author" contient le nom de l'auteur du livre
  author: { type: String, required: true }, 

  // Le champ "imageUrl" contient l'URL de l'image de couverture du livre
  imageUrl: { type: String, required: true }, 

  // Le champ "year" contient l'année de publication du livre
  year: { type: Number, required: true }, 

  // Le champ "genre" contient le genre littéraire du livre (par exemple : fantasy, science-fiction, etc.)
  genre: { type: String, required: true }, 

  // Le champ "ratings" est un tableau qui contient les évaluations (notes) des utilisateurs
  ratings: [
    {
      // Chaque évaluation a un identifiant d'utilisateur unique et une note
      userId: { type: String, required: true }, // Identifiant unique de l'utilisateur qui a noté le livre
      grade: { type: Number, required: true }, // La note donnée par l'utilisateur (de 1 à 5 par exemple)
    },
  ], // Ce tableau contient toutes les évaluations du livre

  // Le champ "averageRating" contient la note moyenne du livre
  averageRating: { type: Number, required: true }, // La note moyenne, calculée à partir des évaluations
});

// On exporte le modèle "Book" qui correspond à ce schéma, ce qui permet de l'utiliser dans l'application
module.exports = mongoose.model("Book", bookSchema);
