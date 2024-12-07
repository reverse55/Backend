// On importe Express pour pouvoir utiliser les fonctionnalités de routage
const express = require("express"); // express est un framework qui nous aide à créer des routes facilement
// On crée une instance de Router pour gérer les routes utilisateurs
const router = express.Router(); // Router d'Express pour définir les différentes routes pour les utilisateurs
// On importe les contrôleurs qui contiennent la logique des actions pour chaque route
const controleursUsers = require("../controleurs/controleurs_users");

// **Route POST** pour l'inscription d'un utilisateur
// Cette route permet à un utilisateur de s'inscrire en envoyant ses informations (email, mot de passe, etc.)
router.post("/signup", controleursUsers.signup);

// **Route POST** pour la connexion d'un utilisateur
// Cette route permet à un utilisateur de se connecter avec ses identifiants (email et mot de passe)
router.post("/login", controleursUsers.login);

// On exporte le router pour pouvoir l'utiliser dans l'application principale
module.exports = router;