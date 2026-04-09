import axios from 'axios';

const API_URL = 'http://192.168.11.102:3000/api';

// Configuration axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gestion des erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erreur avec réponse du serveur
      console.error('Erreur API:', error.response.data);
      throw new Error(error.response.data.error || 'Erreur serveur');
    } else if (error.request) {
      // Erreur réseau
      console.error('Erreur réseau:', error.request);
      throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
    } else {
      console.error('Erreur:', error.message);
      throw new Error('Une erreur est survenue');
    }
  }
);

// Service API pour les étudiants
const studentService = {
  // Récupérer tous les étudiants
  getAllStudents: async () => {
    try {
      const response = await api.get('/students');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un étudiant par ID
  getStudentById: async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Ajouter un nouvel étudiant
  addStudent: async (studentData) => {
    try {
      const response = await api.post('/students', studentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Modifier un étudiant
  updateStudent: async (id, studentData) => {
    try {
      const response = await api.put(`/students/${id}`, studentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un étudiant
  deleteStudent: async (id) => {
    try {
      const response = await api.delete(`/students/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Ajouter un nouvel étudiant avec photo
  addStudentWithPhoto: async (formData) => {
    try {
      const response = await axios.post(
        API_URL + '/students/photo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 10000,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default studentService;