// Importation des modules nécessaires
const multer = require("multer"); // Gère le téléchargement de fichiers via les requêtes HTTP
const sharp = require("sharp"); // Outil pour transformer les images (comme redimensionner, convertir, etc.)
const path = require("path"); // Pour manipuler les chemins de fichiers
const fs = require("fs"); // Pour interagir avec le système de fichiers

// Définition des types MIME pour les images acceptées et leurs extensions correspondantes
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Configuration de Multer pour stocker les fichiers temporairement en mémoire
const storage = multer.memoryStorage();
// Configuration de Multer pour gérer l'upload d'un seul fichier avec le champ "image"
const upload = multer({ storage }).single("image");

// Middleware principal pour gérer l'upload et le traitement de l'image
module.exports = (req, res, next) => {
  // Étape 1 : Gérer l'upload avec Multer
  upload(req, res, async (err) => {
    // Si une erreur se produit pendant l'upload, retourner une erreur
    if (err) {
      console.error("Erreur pendant l'upload :", err.message);
      return res.status(500).json({ error: "Échec de l'upload." });
    }

    // Si aucun fichier n'a été envoyé, continuer le traitement sans image
    if (!req.file) {
      console.log("Aucun fichier reçu.");
      return next();
    }

    try {
      // Étape 2 : Transformer l'image avec Sharp
      const webpBuffer = await sharp(req.file.buffer) // Charger l'image en mémoire
        .resize({ height: 500 }) // Redimensionner l'image à une hauteur de 500px
        .webp({ quality: 70 }) // Convertir l'image en format .webp avec une qualité de compression de 70%
        .toBuffer(); // Obtenir les données transformées de l'image

      // Étape 3 : Créer un nom unique pour le fichier transformé
      const webpFilename = `${req.file.originalname.split(".")[0]}_${Date.now()}.webp`;
      const outputPath = path.join(__dirname, "..", "images", webpFilename); // Définir le chemin de sauvegarde

      // Étape 4 : Sauvegarder l'image transformée sur le disque
      await fs.promises.writeFile(outputPath, webpBuffer);
      console.log("Image transformée et sauvegardée avec succès :", outputPath);

      // Étape 5 : Mettre à jour les informations du fichier dans la requête
      req.file.filename = webpFilename; // Nom du fichier transformé
      req.file.path = outputPath; // Chemin du fichier sur le disque

      // Passer au middleware suivant ou au contrôleur
      next();
    } catch (error) {
      // En cas d'erreur lors du traitement de l'image, retourner une erreur
      console.error("Erreur lors du traitement de l'image :", error);
      res.status(500).json({ error: "Impossible de traiter l'image." });
    }
  });
};

