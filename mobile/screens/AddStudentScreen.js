import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import studentService from '../services/api';

export default function AddStudentScreen({ navigation }) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    age: '',
    telephone: '',
    sexe: 'M',
  });
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);

  // Mettre à jour un champ
  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Valider le formulaire
  const validateForm = () => {
    if (!formData.nom.trim()) {
      Alert.alert('Erreur', 'Le nom est obligatoire');
      return false;
    }
    if (!formData.prenom.trim()) {
      Alert.alert('Erreur', 'Le prénom est obligatoire');
      return false;
    }
    if (!formData.age || isNaN(formData.age)) {
      Alert.alert('Erreur', 'L\'âge doit être un nombre');
      return false;
    }
    const age = parseInt(formData.age);
    if (age < 15 || age > 100) {
      Alert.alert('Erreur', 'L\'âge doit être entre 15 et 100 ans');
      return false;
    }
    return true;
  };

  // Sélectionner une image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      if (photo) {
        form.append('photo', {
          uri: photo.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });
      }
      await studentService.addStudentWithPhoto(form);
      Alert.alert('Succès', 'Étudiant ajouté avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Nom */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom *</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le nom"
            value={formData.nom}
            onChangeText={(text) => updateField('nom', text)}
          />
        </View>

        {/* Prénom */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prénom *</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le prénom"
            value={formData.prenom}
            onChangeText={(text) => updateField('prenom', text)}
          />
        </View>

        {/* Âge */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Âge *</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez l'âge"
            value={formData.age}
            onChangeText={(text) => updateField('age', text)}
            keyboardType="numeric"
          />
        </View>

        {/* Téléphone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le numéro de téléphone"
            value={formData.telephone}
            onChangeText={(text) => updateField('telephone', text)}
            keyboardType="phone-pad"
          />
        </View>

        {/* Sexe */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sexe *</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                formData.sexe === 'M' && styles.radioButtonSelected,
              ]}
              onPress={() => updateField('sexe', 'M')}
            >
              <Text
                style={[
                  styles.radioText,
                  formData.sexe === 'M' && styles.radioTextSelected,
                ]}
              >
                👨 Masculin
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                formData.sexe === 'F' && styles.radioButtonSelected,
              ]}
              onPress={() => updateField('sexe', 'F')}
            >
              <Text
                style={[
                  styles.radioText,
                  formData.sexe === 'F' && styles.radioTextSelected,
                ]}
              >
                👩 Féminin
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sélection de la photo */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Photo (optionnelle)</Text>
          {photo && (
            <Image source={{ uri: photo.uri }} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 8 }} />
          )}
          <TouchableOpacity style={[styles.button, { backgroundColor: '#eee' }]} onPress={pickImage}>
            <Text style={{ color: '#2196F3', fontWeight: 'bold' }}>Choisir une photo</Text>
          </TouchableOpacity>
        </View>

        {/* Boutons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Ajouter</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  radioText: {
    fontSize: 16,
    color: '#666',
  },
  radioTextSelected: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  submitButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});