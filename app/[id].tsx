import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable, Platform } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNewTask } from '@/providers/newTaskContext';


interface Goal {
  id: number;
  title: string;
  description?: string; // Optional description field
  date: Date;
  isCompleted: boolean; // If you need to track completion state
}

export default function TaskDetailsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { newTaskAdded, setNewTaskAdded } = useNewTask();
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
  const [task, setTask] = useState<Goal | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<Goal>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const date_obj = new Date();
  const formatted_date = date_obj.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const formattedYear = formatted_date.slice(0,4)
  const formattedMonth = formatted_date.slice(5,7)
  const formattedDay = formatted_date.slice(8,10)
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'date' | 'time' | 'datetime'>('date');
  const [text, setText] = useState('Empty');

  // Fetch the task details based on the ID
  const fetchTask = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        const foundTask = tasks.find((eachTask: Goal) => eachTask.id.toString() === id.toString());
        if (foundTask) {
          setTask(foundTask);
          const extractedDate = foundTask?.date ? new Date(foundTask.date) : new Date();
          setDate(extractedDate);
          setEditedTask({ ...foundTask }); // Initialize editedTask with current task details
        }
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };
  useEffect(() => {
    fetchTask();
  }, [id]);

  useEffect(() => {
    if (newTaskAdded) {
      fetchTask();
      setNewTaskAdded(false); // Reset the flag after fetching tasks
    }
  }, [newTaskAdded, setNewTaskAdded]);

  // Update task details
  const updateTask = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        if (editedTask) {
          editedTask.date = date;
        }
        const tasks: Goal[] = JSON.parse(storedTasks);
        const updatedTasks = tasks.map((t) => (t.id === task?.id ? { ...t, ...editedTask } : t));
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setIsEditing(false); // Exit edit mode after update
        setNewTaskAdded(true)
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const onChange = (event: DateTimePickerEvent, selectedDate: Date) => {
    if (selectedDate === undefined) {
      setShow(false); // Hide the date and time picker modal
      return; // Exit the function early
    }
  
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    let fTime = 'Hours: ' + tempDate.getHours() + ' | Minutes: ' + tempDate.getMinutes();
    setText(fDate + '\n' + fTime);
  };

  const showMode = (currentMode: 'date' | 'time' | 'datetime') => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `${task?.title || ''}`,
          headerTitleAlign: 'center',
          headerTintColor:'white',
          headerStyle: {
            backgroundColor: '#5B04BC',
            
          },
          headerRight: () => (
            <Pressable onPress={() => setIsEditing(!isEditing)}>
              {({ pressed }) => (
                <FontAwesome
                  name="pencil"
                  size={25}
                  color={'white'}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <View style={styles.row}>
        <Text style={styles.label}>Title:</Text>
        {isEditing ? (
          <TextInput
            style={styles.editableText}
            value={editedTask.title || ''}
            onChangeText={(text) => setEditedTask({ ...editedTask, title: text })}
          />
        ) : (
          <Text style={styles.taskText}>{task?.title || ''}</Text>
        )}
      </View>
      {task?.description && (
        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          {isEditing ? (
            <TextInput
              style={styles.editableText}
              value={editedTask.description || ''}
              onChangeText={(text) => setEditedTask({ ...editedTask, description: text })}
            />
          ) : (
            <Text style={styles.taskText}>{task.description}</Text>
          )}
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        {isEditing ? (
          <Pressable style={styles.editableText} onPress={() => showMode('date')}>
            <Text>{date.toDateString()}</Text>
          </Pressable>
        ) : (
          <Text>{date.toDateString()}</Text>
        )}
      </View>
      {show && (
      <DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode={mode}
        is24Hour={true}
        display="default"
        onChange={onChange}
        minimumDate={new Date(parseInt(formattedYear), parseInt(formattedMonth) - 1, parseInt(formattedDay))}
      />
)}
      {isEditing && (
        <TouchableOpacity onPress={updateTask}>
          <Text style={styles.updateButton}>Update</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  taskText: {
    flex: 1,
    marginRight: 10,
  },
  editableText: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    textAlign: 'center',
  },
});
