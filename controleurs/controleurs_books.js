const Book = require("../models/Book");
const fs = require("fs"); // Utilisé pour manipuler les fichiers, notamment pour supprimer les images

// Créer un livre
exports.createBook = (req, res, next) => {
  // On parse les données envoyées par le client
  const bookObject = JSON.parse(req.body.book);
  console.log("Création d'un nouveau livre");

  // Supprimer les champs inutiles comme l'id et l'userId
  delete bookObject.id;
  delete bookObject.userId;

  // Créer un nouveau livre avec les données fournies et l'URL de l'image
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId, // L'utilisateur qui est connecté
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, // URL de l'image téléchargée
  });

  // Sauvegarder le livre dans la base de données
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre bien enregistré !" })) 
    .catch((error) => res.status(400).json({ error })); // Erreur
};

// Modifier un livre
exports.modifyBook = (req, res, next) => {
  // Si une nouvelle image est envoyée, mettre à jour l'URL de l'image
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body }; // Sinon, garder les données existantes

  // Supprimer l'userId pour éviter de le modifier
  delete bookObject.userId;

  // Trouver le livre par son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Si le livre n'est pas trouvé, on retourne une erreur
      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: "Non autorisé à modifier ce livre" });
      }

      // Mettre à jour le livre dans la base de données
      Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Livre bien modifié !" })) 
        .catch((error) => res.status(400).json({ error })); // Erreur
    })
    .catch((error) => res.status(400).json({ error }));
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
  // Trouver le livre par son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Si le livre n'appartient pas à l'utilisateur, on refuse la suppression
      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: "Non autorisé à supprimer ce livre" });
      }

      // Extraire le nom du fichier image du livre
      const filename = book.imageUrl.split("/images/")[1];
      
      // Supprimer l'image du système de fichiers
      fs.unlink(`images/${filename}`, () => {
        // Supprimer le livre de la base de données
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Livre bien supprimé !" })) 
          .catch((error) => res.status(400).json({ error })); // Erreur
      });
    })
    .catch((error) => res.status(500).json({ error })); // Erreur serveur
};

// Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books)) // Retourner tous les livres
    .catch((error) => res.status(400).json({ error })); // Erreur
};

// Récupérer un seul livre
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book)) // Retourner le livre trouvé
    .catch((error) => res.status(404).json({ error })); // Erreur si le livre n'est pas trouvé
};

// Récupérer les 3 livres les mieux notés
exports.getTop3Books = (req, res, next) => {
  const sortOrder = -1; // Trier par ordre décroissant
  Book.find()
    .sort({ averageRating: sortOrder }) // Trier par la moyenne des notes
    .limit(3) // Limiter les résultats à 3 livres
    .then((top3Books) => res.status(200).json(top3Books)) // Retourner les 3 meilleurs livres
    .catch((error) => res.status(500).json({ error })); // Erreur
};

// Ajouter une note à un livre
exports.addRating = (req, res, next) => {
  const { userId, rating } = req.body; // Extraire l'ID de l'utilisateur et la note

  // Vérifier que la note est valide (entre 0 et 5)
  const minRating = 0;
  const maxRating = 5;
  if (rating < minRating || rating > maxRating) {
    return res.status(400).json({ message: "La note doit être comprise entre 0 et 5" });
  }

  // Trouver le livre à noter
  Book.findById(req.params.id)
    .then((foundBook) => {
      // Vérifier si l'utilisateur a déjà noté ce livre
      const userAlreadyRated = foundBook.ratings.some((r) => r.userId === userId);
      if (userAlreadyRated) {
        return res.status(403).json({ message: "L'utilisateur a déjà noté ce livre" });
      }

      // Ajouter la nouvelle note et recalculer la moyenne
      foundBook.ratings.push({ userId, grade: rating });
      foundBook.averageRating = foundBook.ratings.reduce((sum, r) => sum + r.grade, 0) / foundBook.ratings.length;

      // Sauvegarder les modifications dans la base de données
      foundBook
        .save()
        .then(() => res.status(200).json(foundBook)) // Succès
        .catch((error) => res.status(500).json({ error })); // Erreur
    })
    .catch((error) => res.status(500).json({ error })); // Erreur serveur
};
