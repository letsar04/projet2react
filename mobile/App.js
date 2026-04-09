import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddStudentScreen from './screens/AddStudentScreen';
import EditStudentScreen from './screens/EditStudentScreen';
import StudentDetailScreen from './screens/StudentDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Liste des Étudiants' }}
        />
        <Stack.Screen 
          name="AddStudent" 
          component={AddStudentScreen}
          options={{ title: 'Ajouter un Étudiant' }}
        />
        <Stack.Screen 
          name="EditStudent" 
          component={EditStudentScreen}
          options={{ title: 'Modifier l\'Étudiant' }}
        />
        <Stack.Screen 
          name="StudentDetail" 
          component={StudentDetailScreen}
          options={{ title: 'Détails de l\'Étudiant' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}