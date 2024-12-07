// Import des modules nécessaires
const http = require("http"); // Module pour créer un serveur HTTP
const app = require("./app"); // Import de Express

// Fonction pour vérifier et retourner le port correct
const normalizePort = (val) => {
  const port = parseInt(val, 10); // Convertir en entier
  if (isNaN(port)) return val; // Si ce n'est pas un nombre, retourner la valeur
  if (port >= 0) return port; // Si c'est un port valide, le retourner
  return false; // Sinon, retourner false
};

// Définir le port, avec un port par défaut à 4000
const port = normalizePort(process.env.PORT || "4000");
app.set("port", port); // Fixer le port dans l'application Express

// Créer le serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Gestion des erreurs lors de l'écoute du serveur
server.on("error", (error) => {
  if (error.syscall !== "listen") throw error; // Si l'erreur n'est pas liée à l'écoute, on la relance
  if (error.code === "EACCES") {
    console.error("Le port nécessite des privilèges élevés.");
    process.exit(1); // Quitter le processus si l'accès est refusé
  } else if (error.code === "EADDRINUSE") {
    console.error("Le port est déjà utilisé.");
    process.exit(1); // Quitter le processus si le port est déjà pris
  } else {
    throw error; // Pour les autres erreurs, on les relance
  }
});

// Confirmer que le serveur écoute sur le port choisi
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Le serveur écoute sur " + bind); // Afficher dans la console que le serveur écoute
});

// Démarrer le serveur sur le port choisi
server.listen(port);
