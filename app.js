// ========== Importation des modules nécessaires ==========

// Express est un cadre minimal et flexible pour les applications web Node.js
const express = require('express');

// bodyParser est un middleware qui analyse les corps de requête entrants dans un middleware
const bodyParser = require('body-parser');

// cookieParser est un middleware qui analyse les cookies attachés à l'objet de requête (req)
const cookieParser = require('cookie-parser');

// express-session est un middleware de gestion de session pour Express
const session = require('express-session');

// jwt (JSON Web Token) pour gérer l'authentification basée sur des tokens
const jwt = require('jsonwebtoken');

// path fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires
const path = require('path');

// twig est un moteur de template pour JavaScript
const twig = require('twig');

// helmet aide à sécuriser les applications Express en définissant divers en-têtes HTTP
const helmet = require('helmet');

// rateLimit est un middleware pour limiter le taux de requêtes répétées à l'API
const rateLimit = require('express-rate-limit');

// Pour charger les variables d'environnement à partir d'un fichier .env
require('dotenv').config();

// Importation des routes et des configurations spécifiques à notre application
const userRoutes = require('./routes/userRoutes');
const { initDatabase } = require('./config/database');
const { isLoggedIn } = require('./middlewares/auth');

// ========== Configuration et initialisation de l'application ==========

// Initialisation de l'application Express
const app = express();

// Initialisation de la base de données
initDatabase();

// Configuration de la sécurité
app.use(helmet()); // Protège l'application de certaines vulnérabilités bien connues
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite chaque IP à 100 requêtes par fenêtre
}));

// Configuration des middlewares
app.use(bodyParser.urlencoded({ extended: true })); // Analyse les corps des requêtes en format x-www-form-urlencoded
app.use(bodyParser.json()); // Analyse les corps des requêtes en format JSON
app.use(cookieParser()); // Parse les cookies et popule req.cookies
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(express.static(path.join(__dirname, 'public'))); // Sert les fichiers statiques du répertoire 'public'

// Configuration des messages flash
app.use((req, res, next) => {
    res.locals.flashMessages = req.session.flashMessages;
    delete req.session.flashMessages;
    next();
});

// Configuration de Twig comme moteur de rendu
app.set('view engine', 'twig');
app.set('views', __dirname + '/views');

// Fonction pour gérer les actifs dans Twig
twig.extendFunction('asset', function(path) {
    return '/public' + path;
});

// Middleware pour vérifier si l'utilisateur est authentifié
app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
            if (!err && decodedUser) {
                req.user = decodedUser;
            }
        });
    }
    next();
});

// Routes de l'application
app.use('/', userRoutes);
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.use((req, res, next) => {
    res.status(404).render('404');
});

module.exports = app;