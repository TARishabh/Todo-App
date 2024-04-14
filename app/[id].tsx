import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

export default function test() {

    const {id} = useLocalSearchParams();
  return (
    <View>
      <Text>test {id}</Text>
    </View>
  )
}