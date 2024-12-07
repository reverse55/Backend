// On importe Express pour pouvoir utiliser les fonctionnalités de routage
const express = require("express"); // express est un framework pour gérer les routes et les requêtes HTTP
// On importe les contrôleurs qui contiennent la logique des actions pour chaque route
const controleursBooks = require("../controleurs/controleurs_books");
// On importe un middleware pour vérifier l'authentification des utilisateurs
const auth = require("../middleware/auth");
// On importe un middleware qui gère l'upload des fichiers et leur traitement
const multerAndSharp = require("../middleware/multer_and_sharp_config");

// On crée une instance de Router pour gérer les différentes routes de notre application
const router = express.Router(); // La fonction Router crée un nouvel objet pour gérer les routes

// **Route POST** pour créer un nouveau livre
// On utilise auth pour vérifier si l'utilisateur est authentifié et multerAndSharp pour gérer les fichiers
router.post("/", auth, multerAndSharp, controleursBooks.createBook);

// **Route GET** pour obtenir les 3 livres avec les meilleures évaluations (rating)
router.get("/bestrating", controleursBooks.getTop3Books);

// **Route GET** pour obtenir la liste de tous les livres
router.get("/", controleursBooks.getAllBooks);

// **Route POST** pour ajouter une évaluation (rating) à un livre spécifique
// On vérifie d'abord si l'utilisateur est authentifié avec le middleware auth
router.post("/:id/rating", auth, controleursBooks.addRating);

// **Route GET** pour obtenir un livre spécifique en fonction de son ID
router.get("/:id", controleursBooks.getOneBook);

// **Route PUT** pour modifier un livre en fonction de son ID
// On vérifie l'authentification de l'utilisateur et on gère les fichiers via multerAndSharp
router.put("/:id", auth, multerAndSharp, controleursBooks.modifyBook);

// **Route DELETE** pour supprimer un livre spécifique en fonction de son ID
// l'authentification est nécessaire avant de supprimer un livre
router.delete("/:id", auth, controleursBooks.deleteBook);

// On exporte le router pour pouvoir l'utiliser dans l'application principale
module.exports = router;
