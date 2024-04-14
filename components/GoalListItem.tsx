import { Text, View } from '@/components/Themed';
import { Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Assuming you're using React Navigation
import { Goal } from '@/assets/data/tasks';
import { Link, useSegments } from 'expo-router';

type itemType = {
    item: Goal
}

const GoalsListItem = ({ item}: itemType) => {
  const navigation = useNavigation();



  return (
    <Link href={`/${item.id}`} asChild>
      <Pressable style={styles.goalItem}>
        <Text style={styles.goalTitle}>{item.title}</Text>
        {item.description && <Text style={styles.goalDescription}>{item.description}</Text>}
        <Text style={styles.goalTargetDate}>Target Date: {item.targetDate.toLocaleDateString()}</Text>
      </Pressable>
    </Link>
  );
};


const styles = StyleSheet.create({
    goalItem: {
      flex:1,
      backgroundColor: 'black', // White background
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      // Remove flex and max width styles for natural stacking
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2, // Border width for visibility
      borderColor: '#FC8019', // Dark orange border color
    },
    goalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#fff', // White text
    },
    goalDescription: {
      fontSize: 14,
      color: '#fff', // White text
    },
    goalTargetDate: {
      fontSize: 12,
      color: '#fff', // White text
      marginTop: 5,
    },
  });

export default GoalsListItem;