import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface Goal {
  id: number;
  title: string;
  description?: string; // Optional description field
  targetDate: Date;
  isCompleted: boolean; // If you need to track completion state
}

export default function TaskDetailsScreen() {
  // const navigation = useNavigation();
  const router = useRouter()
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
  const [task, setTask] = useState<Goal | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<Goal>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [date,setDate] = useState('');

  // Fetch the task details based on the ID
  useEffect(() => {
    console.log('ID:', id);
    console.log(typeof(id))
    const fetchTask = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          const tasks: any = JSON.parse(storedTasks);
          const foundTask = tasks.find((eachTask:Goal)=>(
            eachTask.id.toString() === id.toString()
          ))
          // console.log(foundTask)
          if (foundTask) {
            setTask(foundTask);
            const extractedDate = foundTask?.targetDate ? new Date(foundTask.targetDate) : new Date();
            // New state variable for date
            const formattedDate = extractedDate.toLocaleDateString()
            setDate(formattedDate); 
            setEditedTask({ ...foundTask }); // Initialize editedTask with current task details
          }
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };
    fetchTask();
  }, [id]);
  // Update task details
  const updateTask = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const tasks: Goal[] = JSON.parse(storedTasks);
        const updatedTasks = tasks.map((t) => (t.id === task?.id ? { ...t, ...editedTask } : t));
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        router.push('/'); // Navigate back to home page
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (!task) {
    // Handle case where task is not found
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Task not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? (
          <TextInput
            style={styles.editableText}
            value={editedTask.title || ''}
            onChangeText={(text) => setEditedTask({ ...editedTask, title: text })}
          />
        ) : (
          task.title
        )}
      </Text>
      {task.description && (
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <Text style={styles.description}>
            {isEditing ? (
              <TextInput
                style={styles.editableText}
                value={editedTask.description || ''}
                onChangeText={(text) => setEditedTask({ ...editedTask, description: text })}
              />
            ) : (
              task.description
            )}
          </Text>
        </TouchableOpacity>
      )}
{date.length > 2 && (
  <TouchableOpacity onPress={() => setIsEditing(true)}>
  <Text style={styles.text}>
    {isEditing ? (
      <TextInput
        style={styles.editableText}
        value={editedTask.targetDate ? editedTask.targetDate.toLocaleDateString() : ''}
        onChangeText={(text) => setEditedTask({ ...editedTask, targetDate: new Date(text) })}
      />
    ) : (
      // Use nullish coalescing operator and convert to Date
      date
    )}
  </Text>
</TouchableOpacity>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set your desired background color here
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    marginBottom: 10,
  },
  text: {
    marginBottom: 10,
  },
  editableText: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    textAlign: 'center',
  },
});
