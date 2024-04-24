import React, { useEffect, useState } from 'react';
import { Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from 'expo-router';

const Index = () => {
  const router = useRouter(); // Initialize useRouter hook

  const [isFirstVisit, setIsFirstVisit] = useState(true); // Assume first visit initially

  useEffect(() => {
    const checkIsNewUser = async () => {
      const storedValue = await AsyncStorage.getItem('isFirstVisit');
    //   console.log('storedValue:', storedValue); // Log retrieved value
      setIsFirstVisit(storedValue === null); // Update state based on storage
    };

    checkIsNewUser();
  }, []); // Only run the effect once on component mount

  const handleOnPress = async () => {
    await AsyncStorage.setItem('isFirstVisit', 'false'); // Set flag for future visits
    router.push('/'); // Redirect to home page after button click
  };

//   console.log('isFirstVisit (after effect):', isFirstVisit); // Log state for debugging

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
