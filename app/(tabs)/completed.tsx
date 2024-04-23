import { FlatList, StyleSheet, useColorScheme } from 'react-native';
import { View as ThemedView, View } from '@/components/Themed';
import { Link } from 'expo-router';
import { Button, Checkbox } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import GoalsListItem from '@/components/GoalListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const { newTaskAdded, setNewTaskAdded } = useNewTask();
  const [allGoals, setAllGoals] = useState<Goal[]>();
  const [selectedGoals, setSelectedGoals] = useState<CheckboxState>({});
  const GoalListItemBackgroundColor = colorScheme === 'dark' ? '#212121' : '#FFFFFF';


  const useBackgroundColor = () => {
    const colorScheme = useColorScheme();

    const backgroundColor = useMemo(() => {
      return colorScheme === 'dark' ? 'black' : 'white';
    }, [colorScheme]);

    return backgroundColor;
  };

  const backgroundColor = useBackgroundColor();

  const handleCheckboxPress = async (goal: Goal) => {
    // this commented code gives the full transition of selecting the task
    setSelectedGoals((prevSelectedGoals) => ({
      ...prevSelectedGoals,
      [goal.id]: !prevSelectedGoals[goal.id], // Toggle selection based on previous state
    }));
  
    // Update the goal's isCompleted property to true in the frontend state
    if (allGoals){
      const updatedGoals = allGoals.map((g) => {
        if (g.id.toString() === goal.id.toString()) {
          return { ...g, isCompleted: false };
        }
        return g;
      });
      const uncompletedGoals = updatedGoals.filter((goal) => !goal.isCompleted);
      setAllGoals(uncompletedGoals);
  }

    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const tasks: Goal[] = JSON.parse(storedTasks);
        const updatedTasks = tasks.map((t) => {
          if (t.id.toString() === goal.id.toString()) {
            return { ...t, isCompleted: false };
          }
          return t;
        });
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      }
    } catch (error) {
      console.error('Error updating task in AsyncStorage:', error);
    }
  
    // Update newTaskAdded flag
    setNewTaskAdded(true);
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
  
      // Check if it's a single object or an array
      if (!Array.isArray(retrievedTasks)) {
        retrievedTasks = [retrievedTasks]; // Wrap single object in an array
      }
  
      // Convert date strings to Date objects in the required format
      const formattedTasks = retrievedTasks.map((task) => ({
        ...task,
        targetDate: new Date(task.date),
      }));
      const upcomingGoalsTest = formattedTasks.filter((task) => task.isCompleted === true);

      setAllGoals(upcomingGoalsTest);
    } catch (error) {
      console.error('Error retrieving tasks:', error);
    }
  };

  useEffect(() => {
    if (newTaskAdded) {
      fetchTasks();
      setSelectedGoals({});
      setNewTaskAdded(false); // Reset the flag after fetching tasks
    }
  }, [newTaskAdded, setNewTaskAdded]);

  useEffect(() => {
    setSelectedGoals({});
    fetchTasks(); // Fetch tasks on component mount
  }, []);

  const renderItem = ({ item }: { item: Goal }) => (
    <View style={[styles.goalItemContainer,{ backgroundColor:GoalListItemBackgroundColor }]}>
      <Checkbox status={selectedGoals[item.id] ? 'checked' : 'unchecked'} onPress={() => handleCheckboxPress(item)} />
      <GoalsListItem item={item} />
    </View>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <FlatList data={allGoals} renderItem={renderItem} contentContainerStyle={styles.contentContainer} />
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
    borderColor:'grey',
    width:'auto',
    height:80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    padding:10,
    margin:8
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
