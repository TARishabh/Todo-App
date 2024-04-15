import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { TextInput, View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Text, View as ThemedView } from '@/components/Themed';
import { Button, } from 'react-native-paper';
import DatePicker from 'react-native-modern-datepicker'
import {getFormatedDate} from 'react-native-modern-datepicker';

export default function CreateTask() {
  const today = new Date()
  const startDate = getFormatedDate(today.setDate(today.getDate()+1),'YYYY/MM/DD')
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState('12/12/2023')


  function handleOnPress() {
    setOpen(!open)
  }

  function handleChange(propDate) {
    setDate(propDate)
  }




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
      <TouchableOpacity onPress={handleOnPress}>
        <Text>Open</Text>
      </TouchableOpacity>
      <Modal animationType='slide'
        transparent={true}
        visible={open}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <DatePicker mode='calendar'
          selected={date}
          minimumDate={startDate}
          onDateChange={handleChange}/>

            <TouchableOpacity onPress={handleOnPress}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Modal>

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
  centeredView: {
    flex: 1,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%', padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25,
    shadowRadius: 4, elevation: 5,
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
