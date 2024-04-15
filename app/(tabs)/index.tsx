import { FlatList, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { upcomingGoals } from '@/assets/data/tasks'; // Assuming data structure
import { Text, View as ThemedView } from '@/components/Themed';
import GoalsListItem from '@/components/GoalListItem';
import { Button, Checkbox } from 'react-native-paper'; // Assuming you're using React Native Paper for Checkbox
import { useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNewTask } from '@/providers/newTaskContext';

interface Goal {
  id: number;
  title: string;
  description?: string; // Optional description field
  targetDate: Date;
  isCompleted: boolean; // If you need to track completion state
}

type CheckboxState = {
  [key: number]: boolean; // Maps goal IDs to their selected state (checked/unchecked)
};

export default function TabOneScreen() {
  const { newTaskAdded, setNewTaskAdded } = useNewTask();
  const [selectedGoals, setSelectedGoals] = useState<CheckboxState>({}); // State for selected goals
  const [allGoals, setAllGoals] = useState<Goal[]>(upcomingGoals); // State for all goals (combined)

  const useBackgroundColor = () => {
    const colorScheme = useColorScheme();

    const backgroundColor = useMemo(() => {
      return colorScheme === 'dark' ? 'black' : 'white';
    }, [colorScheme]);

    return backgroundColor;
  };

  const backgroundColor = useBackgroundColor();

  const handleCheckboxPress = (goal: Goal) => {
    setSelectedGoals((prevSelectedGoals) => ({
      ...prevSelectedGoals,
      [goal.id]: !prevSelectedGoals[goal.id], // Toggle selection based on previous state
    }));
  };

  const fetchTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (!storedTasks) {
        return; // No tasks stored, nothing to do
      }
  
      let retrievedTasks;
      try {
        retrievedTasks = JSON.parse(storedTasks);
      } catch (error) {
        console.error('Error parsing stored tasks:', error);
        return; // Handle potential parsing errors
      }
      console.log(retrievedTasks)
  
      // Check if it's a single object or an array
      if (!Array.isArray(retrievedTasks)) {
        retrievedTasks = [retrievedTasks]; // Wrap single object in an array
      }
  
      // Convert date strings to Date objects in the required format
      const formattedTasks = retrievedTasks.map((task: any) => ({
        ...task,
        targetDate: new Date(task.date),
      }));
  
      // Assign unique IDs to each task
      const tasksWithIds = formattedTasks.map((task: any, index: number) => ({
        ...task,
        id: index + 5, // Assuming IDs start from 1
      }));
      
      console.log(tasksWithIds)
      setAllGoals([...upcomingGoals, ...tasksWithIds]);
    } catch (error) {
      console.error('Error retrieving tasks:', error);
    }
  };
  useEffect(() => {
    if (newTaskAdded) {
      fetchTasks();
      setNewTaskAdded(false); // Reset the flag after fetching tasks
    }
  }, [newTaskAdded, setNewTaskAdded]);

  useEffect(() => {
    fetchTasks(); // Fetch tasks on component mount
  }, []);

  const renderItem = ({ item }: { item: Goal }) => (
    <View style={styles.goalItemContainer}>
      <Checkbox status={selectedGoals[item.id] ? 'checked' : 'unchecked'} onPress={() => handleCheckboxPress(item)} />
      <GoalsListItem item={item} />
    </View>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <FlatList data={allGoals} renderItem={renderItem} contentContainerStyle={styles.contentContainer} />
      <Link href={'/CreateTask'} asChild>
        <Button style={styles.addButton}>
          <FontAwesome5 style={styles.addButtonText} name="plus" size={24} color="white" />
        </Button>
      </Link>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:'auto',
  },
  contentContainer: {
    padding: 10,
    gap:10
  },
  goalItemContainer: {
    flexDirection: 'row', // Arrange checkbox and goal item horizontally
    alignItems: 'center', // Align checkbox and goal item vertically
  },
  addButton: {
    position: 'absolute', // Position absolutely for bottom right corner
    bottom: 20, // Customize button placement from bottom
    right: 20, // Customize button placement from right
    backgroundColor: '#5B04BC', // Customize button color
    padding: 10,
    borderRadius: 50, // TODO make it more round
  },
  addButtonText: {
    color: 'white', // Customize button text color
    fontWeight: '900',
  },
});
