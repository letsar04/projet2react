const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration du stockage des images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Rendre le dossier uploads accessible publiquement
app.use('/uploads', express.static('uploads'));

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API de gestion des étudiants - IFOAD 2026' });
});

// GET - Récupérer tous les étudiants
app.get('/api/students', (req, res) => {
  const query = 'SELECT * FROM students ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des étudiants:', err);
      return res.status(500).json({ 
        error: 'Erreur serveur lors de la récupération des étudiants' 
      });
    }
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  });
});

// GET - Récupérer un étudiant par ID
app.get('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM students WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'étudiant:', err);
      return res.status(500).json({ 
        error: 'Erreur serveur' 
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ 
        error: 'Étudiant non trouvé' 
      });
    }
    
    res.json({
      success: true,
      data: results[0]
    });
  });
});

// POST - Ajouter un nouvel étudiant
app.post('/api/students', (req, res) => {
  const { nom, prenom, age, telephone, sexe } = req.body;
  
  // Validation des données
  if (!nom || !prenom || !age || !sexe) {
    return res.status(400).json({ 
      error: 'Les champs nom, prenom, age et sexe sont obligatoires' 
    });
  }
  
  if (age < 15 || age > 100) {
    return res.status(400).json({ 
      error: 'L\'âge doit être entre 15 et 100 ans' 
    });
  }
  
  const query = `
    INSERT INTO students (nom, prenom, age, telephone, sexe) 
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.query(query, [nom, prenom, age, telephone, sexe], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de l\'étudiant:', err);
      return res.status(500).json({ 
        error: 'Erreur lors de l\'ajout de l\'étudiant' 
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Étudiant ajouté avec succès',
      data: {
        id: result.insertId,
        nom,
        prenom,
        age,
        telephone,
        sexe
      }
    });
  });
});

// POST - Ajouter un nouvel étudiant avec photo
app.post('/api/students/photo', upload.single('photo'), (req, res) => {
  const { nom, prenom, age, telephone, sexe } = req.body;
  const photo = req.file ? req.file.filename : null;

  // Validation des données
  if (!nom || !prenom || !age || !sexe) {
    return res.status(400).json({
      error: 'Les champs nom, prenom, age et sexe sont obligatoires'
    });
  }
  if (age < 15 || age > 100) {
    return res.status(400).json({
      error: 'L\'âge doit être entre 15 et 100 ans'
    });
  }

  const query = `
    INSERT INTO students (nom, prenom, age, telephone, sexe, photo)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [nom, prenom, age, telephone, sexe, photo], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de l\'étudiant:', err);
      return res.status(500).json({
        error: 'Erreur lors de l\'ajout de l\'étudiant'
      });
    }
    res.status(201).json({
      success: true,
      message: 'Étudiant ajouté avec succès',
      data: {
        id: result.insertId,
        nom,
        prenom,
        age,
        telephone,
        sexe,
        photo
      }
    });
  });
});

// PUT - Modifier un étudiant
app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const { nom, prenom, age, telephone, sexe } = req.body;
  
  // Validation des données
  if (!nom || !prenom || !age || !sexe) {
    return res.status(400).json({ 
      error: 'Les champs nom, prenom, age et sexe sont obligatoires' 
    });
  }
  
  if (age < 15 || age > 100) {
    return res.status(400).json({ 
      error: 'L\'âge doit être entre 15 et 100 ans' 
    });
  }
  
  const query = `
    UPDATE students 
    SET nom = ?, prenom = ?, age = ?, telephone = ?, sexe = ?
    WHERE id = ?
  `;
  
  db.query(query, [nom, prenom, age, telephone, sexe, id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la modification de l\'étudiant:', err);
      return res.status(500).json({ 
        error: 'Erreur lors de la modification' 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: 'Étudiant non trouvé' 
      });
    }
    
    res.json({
      success: true,
      message: 'Étudiant modifié avec succès',
      data: {
        id,
        nom,
        prenom,
        age,
        telephone,
        sexe
      }
    });
  });
});

// DELETE - Supprimer un étudiant
app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM students WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'étudiant:', err);
      return res.status(500).json({ 
        error: 'Erreur lors de la suppression' 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: 'Étudiant non trouvé' 
      });
    }
    
    res.json({
      success: true,
      message: 'Étudiant supprimé avec succès'
    });
  });
});

// GET - Récupérer les étudiants connectés
app.get('/api/students/online', (req, res) => {
  const query = 'SELECT * FROM students WHERE is_online = 1 ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des étudiants connectés:', err);
      return res.status(500).json({
        error: 'Erreur serveur lors de la récupération des étudiants connectés'
      });
    }
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.error('Erreur non gérée:', err);
});