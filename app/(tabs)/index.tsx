import { FlatList, StyleSheet, TouchableOpacity, useColorScheme, View,Platform, } from 'react-native';
import { View as ThemedView } from '@/components/Themed';
import GoalsListItem from '@/components/GoalListItem';
import { Button, Checkbox, Text } from 'react-native-paper'; // Assuming you're using React Native Paper for Checkbox
import { useState, useMemo, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNewTask } from '@/providers/newTaskContext';
import { useToggleDarkMode } from '@/providers/modeContext';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
// import { Button as RNButton  } from 'react-native';
import { useFonts ,Roboto_400Regular,Roboto_700Bold} from '@expo-google-fonts/roboto';



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
  const [today, setToday] = useState(new Date());
  let [fontsLoaded] = useFonts({Roboto_400Regular,Roboto_700Bold});
  const [show,setShow] = useState(false)
  const [date, setDate] = useState(today)
  const [text,setText] = useState('Empty')
  const [mode, setMode] = useState<'date' | 'time' | 'datetime'>('date');
  const { newTaskAdded, setNewTaskAdded } = useNewTask();
  const [selectedGoals, setSelectedGoals] = useState<CheckboxState>({}); // State for selected goals
  const [allGoals, setAllGoals] = useState<Goal[]>(); // State for all goals (combined)
  const date_obj = new Date(today);
  // Format the date object to the desired format (YYYY/MM/DD)
  const formatted_date = date_obj.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const formattedYear = formatted_date.slice(0,4)
  const formattedMonth = formatted_date.slice(5,7)
  const formattedDay = formatted_date.slice(8,10)
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const colorScheme = useColorScheme();
  const {isDarkMode} = useToggleDarkMode()
  const backgroundColor = isDarkMode === true ? '#111111' : '#F4F5F7';
  const GoalListItemBackgroundColor = isDarkMode === true ? '#212121' : '#FFFFFF';
  const HeadingFontStyle = 'Roboto_700Bold'


  const handleCheckboxPress = async (goal: Goal) => {
    setSelectedGoals((prevSelectedGoals) => ({
      ...prevSelectedGoals,
      [goal.id]: !prevSelectedGoals[goal.id], // Toggle selection based on previous state
    }));
  
    // Update the goal's isCompleted property to true in the frontend state
    if (allGoals){
      const updatedGoals = allGoals.map((g) => {
        if (g.id.toString() === goal.id.toString()) {
          return { ...g, isCompleted: true };
        }
        return g;
      });
      const uncompletedGoals = updatedGoals.filter((goal) => !goal.isCompleted);
      setAllGoals(uncompletedGoals);
  }
  
    // Filter out completed goals
  
  
    // Update task in backend storage
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const tasks: Goal[] = JSON.parse(storedTasks);
        const updatedTasks = tasks.map((t) => {
          if (t.id.toString() === goal.id.toString()) {
            return { ...t, isCompleted: true };
          }
          return t;
        });
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      }
    } catch (error) {
      console.error('Error updating task in AsyncStorage:', error);
    }
  
    // Update newTaskAdded flag
    setNewTaskAdded(true);
  };
  const fetchTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (!storedTasks) {
        return; // No tasks stored, nothing to do
      }
  
      let retrievedTasks;
      try {
        retrievedTasks = JSON.parse(storedTasks);
      } catch (error) {
        console.error('Error parsing stored tasks:', error);
        return; // Handle potential parsing errors
      }
  
      // Check if it's a single object or an array
      if (!Array.isArray(retrievedTasks)) {
        retrievedTasks = [retrievedTasks]; // Wrap single object in an array
      }
  
      // Convert date strings to Date objects in the required format
      const formattedTasks = retrievedTasks.map((task) => ({
        ...task,
        targetDate: new Date(task.date),
      }));
      const upcomingGoalsTest = formattedTasks.filter((task) => task.isCompleted === false);

      setAllGoals(upcomingGoalsTest);
    } catch (error) {
      console.error('Error retrieving tasks:', error);
    }
  };
  useEffect(() => {
    if (newTaskAdded) {
      fetchTasks();
      setSelectedGoals({})
      setNewTaskAdded(false); // Reset the flag after fetching tasks
    }
  }, [newTaskAdded, setNewTaskAdded]);

  useEffect(() => {
    fetchTasks(); // Fetch tasks on component mount
    setSelectedGoals({})
  }, []);

  const onChange = (event:DateTimePickerEvent,selectedDate:Date) =>{
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios')
    setDate(currentDate);
    setSelectedDate(currentDate);
    let tempDate = new Date(currentDate)
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear() 
    let fTime = 'Hours: ' + tempDate.getHours() + ' | Minutes: ' + tempDate.getMinutes()
    setText(fDate + '\n' + fTime)

    console.log(fDate)
  }
  const showMode = (currentMode: 'date' | 'time' | 'datetime') =>{
    setShow(true)
    setMode(currentMode)
  }
  // const formattedDate = selectedDate.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); // Format date
  const formattedDate = selectedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const textColor = isDarkMode === true ? 'white' : 'black';

  const renderItem = ({ item }: { item: Goal }) => (
    <View style={[styles.goalItemContainer,{ backgroundColor:GoalListItemBackgroundColor }]}>
      <View style={styles.checkbox}>
      <Checkbox status={selectedGoals[item.id] ? 'checked' : 'unchecked'} onPress={() => handleCheckboxPress(item)} />
      </View>
      <GoalsListItem item={item} />

    </View>
  );

  return fontsLoaded && (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <View style={styles.dateAndCalendar}>
        {selectedDate.toDateString() === today.toDateString() ? ( // Compare selected date with today's date
          <Text style={{ color:textColor,marginLeft: '5%', fontSize: 30, fontWeight: 'bold', fontFamily: HeadingFontStyle }}>Today's Tasks</Text>
        ) : (
          <Text style={{ color:textColor,marginLeft: '5%', fontSize: 30, fontWeight: 'bold', fontFamily: HeadingFontStyle }}>{formattedDate.replaceAll('/','-')}</Text>
        )}
        <Button onPress={() => showMode('date')}>
          <FontAwesome5 name="calendar" size={24} color={textColor} />
        </Button>
      </View>
      <FlatList data={allGoals} renderItem={renderItem} contentContainerStyle={styles.contentContainer} />
      <Link href={'/CreateTask'} asChild>
        <Button onLongPress={async () => await AsyncStorage.removeItem('isFirstVisit')} style={styles.addButton}>
          <FontAwesome5 style={[styles.addButtonText]} name="plus" size={24} color="white" />
        </Button>
      </Link>
      {show && (
        <DateTimePicker
          testID='dateTimePicker'
          value={date}
          mode={mode}
          is24Hour={true}
          display='default'
          onChange={onChange}
          minimumDate={new Date(parseInt(formattedYear), parseInt(formattedMonth) - 1, parseInt(formattedDay))}
        />
      )}
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  dateAndCalendar:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    paddingTop:10,
  },
  container: {
    flex: 1,
    marginTop:'auto',
  },
  contentContainer: {
    padding: 10,
    gap:10
  },
  goalItemContainer: {
    flexDirection: 'row', // Arrange checkbox and goal item horizontally
    alignItems: 'center', // Align checkbox and goal item vertically
    borderColor:'grey',
    width:'auto',
    height:80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    padding:10,
    margin:8
  },
  addButton: {
    position: 'absolute', // Position absolutely for bottom right corner
    bottom: 20, // Customize button placement from bottom
    right: 20, // Customize button placement from right
    backgroundColor: '#5B04BC', // Customize button color
    padding: 12,
    borderRadius: 50, // TODO make it more round
  },
  addButtonText: {
    color: 'white', // Customize button text color
    fontWeight: '700',
  },
  checkbox:{
    // backgroundColor:'black',
    // height:'100%',
    alignItems:'center',
    borderRadius:10
  }
});
