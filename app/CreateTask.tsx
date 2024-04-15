import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { TextInput, View, TouchableOpacity, StyleSheet, Modal, Platform, Button } from 'react-native';
import { Text, View as ThemedView } from '@/components/Themed';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
export default function CreateTask() {
  const today = new Date()
  const date_obj = new Date(today);

  // Format the date object to the desired format (YYYY/MM/DD)
  const formatted_date = date_obj.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const formattedYear = formatted_date.slice(0,4)
  const formattedMonth = formatted_date.slice(5,7)
  const formattedDay = formatted_date.slice(8,10)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(today)
  const [mode,setMode] = useState('date')
  const [show,setShow] = useState(false)
  const [text,setText] = useState('Empty')

  const onChange = (event:DateTimePickerEvent,selectedDate:Date) =>{
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios')
    setDate(currentDate);
    let tempDate = new Date(currentDate)
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear() 
    let fTime = 'Hours: ' + tempDate.getHours() + ' | Minutes: ' + tempDate.getMinutes()
    setText(fDate + '\n' + fTime)

    // console.log(fDate + '(' + fTime + ')')
  }

  const showMode = (currentMode:string) =>{
    setShow(true)
    setMode(currentMode)
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
    <Button title='DatePicker' onPress={()=>showMode('date')}/>
    <Button title='TimePicker' onPress={()=>showMode('time')}/>
      <Button title='Create Task'  onPress={() => console.log('fjksahfjkashf')}/>
      <Text>{text}</Text>
      {show && (
        <DateTimePicker
        testID='dateTimePicker'
        value={date}
        mode={mode}
        is24Hour={true}
        display='default'
        onChange={onChange}
        minimumDate={new Date(parseInt(formattedYear), parseInt(formattedMonth) - 1, parseInt(formattedDay))}
        />
      )}
    </ThemedView>
  );
}
// style={styles.submitButton}

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
