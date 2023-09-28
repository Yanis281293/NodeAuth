const mongoose = require('mongoose');

// Schéma de l'utilisateur pour MongoDB avec Mongoose
const userSchema = new mongoose.Schema({
    // Nom d'utilisateur
    username: {
        type: String,      // Type de données: Chaîne de caractères
        required: true,    // Le nom d'utilisateur est obligatoire
        unique: true       // Le nom d'utilisateur doit être unique dans la base de données
    },

    // Adresse e-mail
    email: {
        type: String,      // Type de données: Chaîne de caractères
        required: true,    // L'e-mail est obligatoire
        unique: true,      // L'e-mail doit être unique dans la base de données
        match: [           // Validation pour s'assurer que la valeur est une adresse e-mail valide
            /^\S+@\S+\.\S+$/,
            'L\'adresse e-mail est invalide.'
        ]
    },

    // Mot de passe
    password: {
        type: String,      // Type de données: Chaîne de caractères
        required: true     // Le mot de passe est obligatoire
    }
}, {
    timestamps: true       // Ajoute des champs createdAt et updatedAt automatiquement
});

// Création du modèle User basé sur le schéma défini précédemment
const User = mongoose.model('User', userSchema);

// Exportation du modèle User pour l'utiliser dans d'autres fichiers
module.exports = User;