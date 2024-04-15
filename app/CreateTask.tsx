import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { TextInput, View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Text, View as ThemedView } from '@/components/Themed';
import { Button, } from 'react-native-paper';


export default function CreateTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('12/12/2023')





  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{
        title: `Create Task`, headerTitleAlign: 'center', headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: 'white'
      }}
      />
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (Optional)"
        value={description}
        onChangeText={setDescription}
      />
      <Button style={styles.submitButton} onPress={() => console.log('fjksahfjkashf')}>
        <Text style={styles.submitText}>Create Task</Text>
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set background color as desired
    padding: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#eee', // Adjust background color as desired
  },
  submitButton: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
});
