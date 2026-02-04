-- Création de la base de données
CREATE DATABASE IF NOT EXISTS ecole_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecole_db;

-- Suppression de la table si elle existe déjà (pour réinitialisation)
DROP TABLE IF EXISTS students;

-- Création de la table students
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  age INT NOT NULL CHECK (age >= 15 AND age <= 100),
  telephone VARCHAR(20),
  sexe ENUM('M', 'F') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_nom (nom),
  INDEX idx_prenom (prenom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion de données de test
INSERT INTO students (nom, prenom, age, telephone, sexe) VALUES
('Ouedraogo', 'Amadou', 21, '70123456', 'M'),
('Kaboré', 'Fatimata', 20, '76234567', 'F'),
('Sawadogo', 'Ibrahim', 22, '78345678', 'M'),
('Traoré', 'Aïcha', 19, '75456789', 'F'),
('Compaoré', 'Souleymane', 23, '77567890', 'M'),
('Nacro', 'Mariame', 20, '79678901', 'F'),
('Zongo', 'Moussa', 21, '76789012', 'M'),
('Sankara', 'Adjara', 22, '70890123', 'F');

-- Vérification des données insérées
SELECT * FROM students;

-- Affichage du nombre d'étudiants
SELECT COUNT(*) as nombre_etudiants FROM students;