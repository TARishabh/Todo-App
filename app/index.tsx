import React, { useEffect, useState } from 'react';
import { Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from 'expo-router';

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
    <>
      {isFirstVisit === null ? ( // Show loading state while fetching
        <Text>Loading...</Text>
      ) : isFirstVisit ? (
        <Button onPress={handleOnPress} style={{ marginTop: '50%' }}>
          Get Started
        </Button>
      ) : (
        <Redirect href={'/(tabs)/'} /> // Redirect old users directly
      )}
    </>
  );
};

export default Index;
