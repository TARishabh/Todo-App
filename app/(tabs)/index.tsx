import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { upcomingGoals } from '@/assets/data/tasks'; // Assuming data structure
import { Text, View as ThemedView } from '@/components/Themed';
import GoalsListItem from '@/components/GoalListItem';
import { Button, Checkbox } from 'react-native-paper'; // Assuming you're using React Native Paper for Checkbox
import { useState } from 'react';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

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
  const [selectedGoals, setSelectedGoals] = useState<CheckboxState>({}); // State for selected goals

  const handleCheckboxPress = (goal: Goal) => {
    setSelectedGoals((prevSelectedGoals) => ({
      ...prevSelectedGoals,
      [goal.id]: !prevSelectedGoals[goal.id], // Toggle selection based on previous state
    }));
  };

  const renderItem = ({ item }: { item: Goal }) => (
    <View style={styles.goalItemContainer}>
      <Checkbox status={selectedGoals[item.id] ? 'checked' : 'unchecked'} onPress={() => handleCheckboxPress(item)} />
      <GoalsListItem item={item} />
    </View>
  );


  return (
    <ThemedView style={styles.container}>
      <FlatList data={upcomingGoals} renderItem={renderItem} contentContainerStyle={styles.contentContainer} />
      <Link href={'/CreateTask'} asChild>
      <Button style={styles.addButton}>
      <FontAwesome5 style={styles.addButtonText} name="plus" size={24} color="white"/>
      </Button>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
    backgroundColor: '#FC8019', // Customize button color
    padding: 10,
    borderRadius: 50, // TODO make it more round
  },
  addButtonText: {
    color: 'white', // Customize button text color
    fontWeight: '900',
  },
});
