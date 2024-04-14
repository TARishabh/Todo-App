import React from 'react'
import { Stack } from 'expo-router'
import { Text, View as ThemedView } from '@/components/Themed';
import { StyleSheet } from 'react-native';

export default function CreateTask() {
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{
        title: `Create Task`, headerTitleAlign: 'center', headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor:'white'
      }} />
      <Text>CreateTask</Text>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    marginTop: 'auto',
  },
})