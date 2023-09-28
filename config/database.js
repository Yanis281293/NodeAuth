const mongoose = require('mongoose');
require('dotenv').config();

// Configuration de la connexion à la base de données en utilisant les variables d'environnement
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Fonction pour établir la connexion à la base de données.
 */
const connectToDatabase = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`, {
            useNewUrlParser: true, // Pour utiliser le nouveau système de connexion à la base de données
            useUnifiedTopology: true, // Pour utiliser le nouveau moteur de découverte et de surveillance du serveur
        });
        console.log('La connexion à la base de données a été établie avec succès.');
    } catch (error) {
        console.error('Impossible de se connecter à la base de données:', error);
    }
};

/**
 * Fonction pour déconnecter de la base de données.
 */
const disconnectFromDatabase = async () => {
    try {
        await mongoose.disconnect();
        console.log('Déconnexion de la base de données réussie.');
    } catch (error) {
        console.error('Erreur lors de la déconnexion de la base de données:', error);
    }
};

/**
 * Fonction pour initialiser la base de données.
 * Cette fonction établit simplement la connexion.
 */
const initDatabase = async () => {
    await connectToDatabase();
};

// Exportation des fonctions pour utilisation ailleurs dans l'application
module.exports = { initDatabase, disconnectFromDatabase };