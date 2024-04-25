import React, { useEffect, useState } from 'react';
import { Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from 'expo-router';
import { View, Image, StyleSheet } from 'react-native'; // Import StyleSheet from react-native
import { LinearGradient } from 'expo-linear-gradient';

const Index = () => {
  const router = useRouter(); // Initialize useRouter hook

  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null); // Initialize state with null

  useEffect(() => {
    const checkIsNewUser = async () => {
      const storedValue = await AsyncStorage.getItem('isFirstVisit');
      if (storedValue !== null) {
        setIsFirstVisit(storedValue === 'true'); // Update state based on storage
      } else {
        setIsFirstVisit(true); // Treat as first visit if storage value is null
      }
    };

    checkIsNewUser();
  }, []); // Only run the effect once on component mount

  const handleOnPress = async () => {
    await AsyncStorage.setItem('isFirstVisit', 'false'); // Set flag for future visits
    router.push('/(tabs)/'); // Redirect to tabs after button click
  };

  return (
    <LinearGradient
      colors={['rgb(181, 239, 249)', 'rgb(254, 254, 254)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {isFirstVisit === null ? (
          <Text>Loading...</Text>
        ) : isFirstVisit ? (
          <View style={styles.content}>
            <Image
              source={require('../assets/images/getStartedPage-removebg-preview.png')}
              style={styles.image}
            />
            <Text style={styles.heading}>Welcome to Go Task</Text>
            <Text style={styles.description}>
              The way to get started is to quit talking and begin doing
            </Text>
              <LinearGradient // Apply the gradient inside the Button component
                colors={['#1464c4', '#2198d6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 10 }} // Set style for gradient container
              >
            <Button
              onPress={handleOnPress}
              style={[styles.button, { backgroundColor: 'transparent' }]} // Remove default background color
              labelStyle={{ color: 'white' }}
              mode="contained"
            >
                <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>Get Started</Text>
            </Button>
              </LinearGradient>
          </View>
        ) : (
          <Redirect href={'/(tabs)/'} /> // Redirect old users directly
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginTop: '20%',
    alignItems: 'center',
  },
  image: {
    aspectRatio: 1,
    alignSelf: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    width: 350,
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default Index;
