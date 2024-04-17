import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Goal } from '@/assets/data/tasks';

// TODO sort karna hai recent to least recent
// TODO DELETE KA BUTTON DENA HAI
// TODO INFO KI JAGEH MODE KA BUTTON DENA HAI, LIGHT OR DARK KA
// TODO search ka option dena hai
// TODO mic ka option dena hai to create task
// TODO agar kisi task ka time exceed ho jaaye to alarm baj jaana chaiye (if this not possible, then us task ko alag hi top pe highlight karde, ki ye bacha hua hai)
// TODO designing karni hai 


type ItemType = {
  item: Goal
}

const GoalsListItem = ({ item }: ItemType) => {
  return (
    <Link href={`/${item.id}`} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.goalItem,
          {
            backgroundColor: pressed ? '#DDDDDD' : '#FFFFFF',
            shadowColor: pressed ? '#5804BC' : '#7700FF',
          },
        ]}
      >
        <View>
          <Text style={styles.goalTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.goalDescription}>{item.description}</Text>
          )}
          <Text style={styles.goalTargetDate}>
            Target Date: {item.targetDate.toLocaleDateString()}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  goalItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0000FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  goalDescription: {
    fontSize: 14,
  },
  goalTargetDate: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default GoalsListItem;
