import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { upcomingGoals } from '@/assets/data/tasks'; // Assuming data structure

interface Goal {
  id: number;
  title: string;
  description?: string; // Optional description field
  targetDate: Date;
  isCompleted: boolean; // If you need to track completion state
}

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams(); // Get task ID from URL parameters

  // Find the specific goal based on ID
  const goal = upcomingGoals.find((goal) => goal.id.toString() === id.toString());

  if (!goal) {
    // Handle case where no goal is found
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Task not found.</Text>
      </View>
    );
  }

  // Destructure goal properties
  const { title, description, targetDate, isCompleted } = goal;

  // Format target date (optional, adjust as needed)
  const formattedDate = targetDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      <Text style={styles.text}>Target Date: {formattedDate}</Text>
      <Text style={styles.text}>Completed: {isCompleted ? 'Yes' : 'No'}</Text>
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
    color: '#000', // Set your desired text color here
  },
  description: {
    marginTop: 10,
    marginBottom: 10,
    color: '#808080', // Set your desired text color here
  },
  text: {
    color: '#000', // Set your desired text color here
  },
});
