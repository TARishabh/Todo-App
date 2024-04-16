import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { TextInput, View, TouchableOpacity, StyleSheet, Modal, Platform, Button } from 'react-native';
import { Text, View as ThemedView } from '@/components/Themed';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNewTask } from '@/providers/newTaskContext';

interface Goal {
  id: number;
  title: string;
  description?: string; // Optional description field
  targetDate: Date;
  isCompleted: boolean; // If you need to track completion state
}

export default function CreateTask() {
  const { setNewTaskAdded } = useNewTask();
  const today = new Date()
  const date_obj = new Date(today);
  const [time, setTime] = useState(null); // Optional state for time
  // Format the date object to the desired format (YYYY/MM/DD)
  const formatted_date = date_obj.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const formattedYear = formatted_date.slice(0,4)
  const formattedMonth = formatted_date.slice(5,7)
  const formattedDay = formatted_date.slice(8,10)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(today)
  const [mode, setMode] = useState<'date' | 'time' | 'datetime'>('date');
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

  const showMode = (currentMode: 'date' | 'time' | 'datetime') =>{
    setShow(true)
    setMode(currentMode)
  }

  const generateTaskId = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const tasks: Goal[] = JSON.parse(storedTasks);
        // Use the length of the tasks array to generate a unique ID
        const actualkey =  tasks.length + 10
        return actualkey;
      } else {
        const actualkey =  10
        return actualkey;
      }
    } catch (error) {
      console.error('Error generating task ID:', error);
    }
    // Default to 1 if no tasks are stored or an error occurs

  };

  const saveTask = async () => {
    if (!title) {
      alert('Please enter a title for your task.');
      return;
    }
  
    const newTask = {
      id: await generateTaskId(), // Generate a unique ID for the task
      title,
      description,
      date, // Convert selected date to ISO string
      time, // Optional time if set
      isCompleted:false
    };
  
    try {
      // Retrieve existing tasks from AsyncStorage
      const existingTasksString = await AsyncStorage.getItem('tasks');
      let existingTasks: Goal[] = [];
      if (existingTasksString) {
        existingTasks = JSON.parse(existingTasksString);
      }
  
      // Append the new task to the existing tasks
      const updatedTasks = [...existingTasks, newTask];
  
      // Save the updated tasks back to AsyncStorage
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
      alert('Task saved successfully!');
      setNewTaskAdded(true);
      setTitle(''); // Clear input fields after saving
      setDescription('');
      setDate(today);
      setTime(null); // Reset time
    } catch (error) {
      console.error('Error saving task:', error);
      alert('An error occurred while saving the task.');
    }
  };

  const deleteTasks = async () =>{
    await AsyncStorage.removeItem('tasks')
  }

  const retrieveTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (!storedTasks) {
        return []; // Return empty array if no tasks are stored
      }
      const tasks = JSON.parse(storedTasks);
      console.log(tasks)
      return tasks;
    } catch (error) {
      console.error('Error retrieving tasks:', error);
      return []; // Handle potential errors and return an empty array
    }
  };




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
      <Button title='Create Task'  onPress={saveTask}/>
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
