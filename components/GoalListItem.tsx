import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Goal } from '@/assets/data/tasks';
import { useFonts ,Roboto_400Regular,} from '@expo-google-fonts/roboto';
import { useToggleDarkMode } from '@/providers/modeContext';
import { FontAwesome5 } from '@expo/vector-icons';

type ItemType = {
  item: Goal
}

const GoalsListItem = ({ item }: ItemType) => {
  let [fontsLoaded] = useFonts({Roboto_400Regular,});
  const {isDarkMode} = useToggleDarkMode()
  const textColor = isDarkMode === true ? 'white' : 'black';

  return fontsLoaded && (
    <Link href={`/${item.id}`} asChild>
      <Pressable style={styles.goalItem}>
        <View style={styles.dateAndTitle}>
          <Text style={[styles.goalTitle,{color:textColor,}]}>{item.title}</Text>
          <Text style={[styles.goalTargetDate, {color:textColor}]}>
            {item.targetDate.toLocaleDateString()}
          </Text>
        </View>
        <FontAwesome5 name="chevron-right" size={24} style={styles.icon} />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  dateAndTitle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft:'2%'
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 1,
    marginTop: 2,
    // marginLeft: 7,
    fontFamily: 'Roboto_400Regular',
  },
  goalTargetDate: {
    fontSize: 13,
    fontWeight: 'bold',
    opacity: 0.5,
    fontFamily: 'Roboto_400Regular',
    // marginLeft: '.5%',
  },
  icon: {
    marginLeft: 10, // Adjust the margin as needed
  },
});

export default GoalsListItem;
