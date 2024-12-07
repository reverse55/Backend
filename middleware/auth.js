// importe jsonwebtoken, une bibliothèque pour créer et vérifier des tokens JWT (JSON Web Tokens)
const jsonWebToken = require("jsonwebtoken");
// On charge les variables d'environnement à partir du fichier .env
require("dotenv").config();

// récupère la clé secrète pour signer les tokens depuis les variables d'environnement
const { SECRET_TOKEN } = process.env; 

// Cette fonction est utilisée comme middleware pour protéger les routes nécessitant une authentification
module.exports = (req, res, next) => {
  try {
    // On récupère le token JWT dans l'en-tête Authorization de la requête HTTP.
    // split(" ")[1] permet d'extraire la partie <token>
    const token = req.headers.authorization.split(" ")[1];

    // On vérifie et décode le token en utilisant la clé secrète pour valider son authenticité
    const decodedToken = jsonWebToken.verify(token, SECRET_TOKEN);

    // On récupère l'ID de l'utilisateur à partir du token décodé
    const userId = decodedToken.userId;
    // On attache l'ID de l'utilisateur à la requête (req) pour qu'il soit accessible dans les autres middlewares ou routes
    req.auth = { userId: userId };

    // On passe la requête au middleware suivant ou à la route
    next();
  } catch (error) {
    // Si une erreur se produit (par exemple, si le token est invalide ou expiré), on renvoie une erreur 401 (non autorisé)
    res.status(401).json({ error: "requête non autorisée" });
  }
};
