import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { TextInput, View, TouchableOpacity, StyleSheet, Modal, Platform, Button, Pressable, KeyboardAvoidingView } from 'react-native';
import { Text, View as ThemedView } from '@/components/Themed';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNewTask } from '@/providers/newTaskContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useToggleDarkMode } from '@/providers/modeContext';
import { useFonts, Roboto_400Regular, Roboto_700Bold, Roboto_900Black } from '@expo-google-fonts/roboto';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Goal {
  id: number;
  title: string;
  description?: string; // Optional description field
  targetDate: Date;
  isCompleted: boolean; // If you need to track completion state
  time:string
}



export default function UpdateTask() {
    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
      const [editedTask, setEditedTask] = useState<Partial<Goal>>({});
    
  let [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold, Roboto_900Black });
  const [task, setTask] = useState<Goal | null>(null);
  const { setNewTaskAdded } = useNewTask();
  const { isDarkMode } = useToggleDarkMode()
  const backgroundColor = isDarkMode === true ? '#111111' : '#F4F5F7';
  const GoalListItemBackgroundColor = isDarkMode === true ? '#212121' : '#FFFFFF';
  const textColor = isDarkMode === true ? 'white' : 'black';
  const [text, setText] = useState('Empty');
  const today = new Date()
  const date_obj = new Date(today);
  // Format the date object to the desired format (YYYY/MM/DD)
  const formatted_date = date_obj.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const formattedYear = formatted_date.slice(0, 4)
  const formattedMonth = formatted_date.slice(5, 7)
  const formattedDay = formatted_date.slice(8, 10)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(today)
  const [mode, setMode] = useState<'date' | 'time' | 'datetime'>('date');
  const [show, setShow] = useState(false)
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState('Personal');
  const onChange = (event: DateTimePickerEvent, selectedDate: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios')
    setDate(currentDate);
    let tempDate = new Date(currentDate)
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear()
    let fTime = 'Hours: ' + tempDate.getHours() + ' | Minutes: ' + tempDate.getMinutes()
    // console.log(`${tempDate.getHours()}:${tempDate.getMinutes()}`)
    setText(fDate + '\n' + fTime)
    // console.log(fTime)

    // console.log(fDate + '(' + fTime + ')')
  }

  const fetchTask = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        const foundTask = tasks.find((eachTask: Goal) => eachTask.id.toString() === id.toString());
        if (foundTask) {
          setTask(foundTask);
          const extractedDate = foundTask?.date ? new Date(foundTask.date) : new Date();
          setDate(extractedDate);
          setEditedTask({ ...foundTask }); // Initialize editedTask with current task details
        }
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };
  useEffect(() => {
    fetchTask();
  }, [id]);
  

  const showMode = (currentMode: 'date' | 'time' | 'datetime') => {
    setShow(true)
    setMode(currentMode)
  }


  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours; // Ensure double digits for hours
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Ensure double digits for minutes
    // const meridiem = hours < 12 ? 'AM' : 'PM'; // Determine if it's morning or afternoon
    return `${formattedHours}:${formattedMinutes}`; // Combine hours, minutes, and meridiem
  };
  const sizes = ['Personal', 'Work'];

  return fontsLoaded && (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor }]} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ThemedView style={{ flex: 1, justifyContent: 'space-between', backgroundColor: backgroundColor }}>
        <Stack.Screen
          options={{
            title: `Create New Task`,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: 'transparent',
            },
            headerBackground: () => (
              <View style={{ flex: 1 }}>
                <LinearGradient
                  colors={['#1464c4', '#2198d6']} // Colors converted from RGB to HEX
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              </View>
            ),
            headerTintColor: 'white'
          }}
        />
        <View>
          <View style={{ marginBottom: 6 }}>
            <Text style={{ color: textColor, marginBottom: '2%', marginLeft: '2%', fontSize: 25, marginTop: '2%', fontWeight: 'bold', fontFamily: 'Roboto_900Black' }}>Task Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: GoalListItemBackgroundColor, borderColor: 'grey', width: '93%', marginLeft: '4%', color: textColor, }]}
              placeholder="Add Title"
              placeholderTextColor={textColor}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <Text style={{ color: textColor, marginTop: '2%', marginBottom: '2%', marginLeft: '2%', fontSize: 25, fontWeight: 'bold', fontFamily: 'Roboto_900Black' }}>Category</Text>

          <View style={{ width: '100%', height: 50, flexDirection: 'row', marginBottom: 15 }}>
            {sizes.map((size) => (
              <Pressable onPress={() => setSelectedSize(size)} key={size} style={{ borderRadius: 10, marginLeft: '4%', marginRight: '8%', height: '100%', width: '40%' }}>
                {selectedSize === size ? (
                  <LinearGradient
                    colors={['#1464c4', '#2198d6']} // Colors converted from RGB to HEX
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>{size}</Text>
                  </LinearGradient>
                ) : (
                  <View style={{ flex: 1, borderRadius: 10, backgroundColor: GoalListItemBackgroundColor, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 20 }}>{size}</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
            <View>
              <Text style={{ color: textColor, marginTop: '2%', marginBottom: '2%',marginLeft:'11%', fontSize: 25, fontWeight: 'bold', fontFamily: 'Roboto_900Black' }}>Date</Text>
            </View>
            <View>
              <Text style={{ color: textColor, marginTop: '2%', marginBottom: '2%', marginRight: '30%', fontSize: 25, fontWeight: 'bold', fontFamily: 'Roboto_900Black' }}>Time</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            {/* Date Input */}
            <View style={{ backgroundColor: GoalListItemBackgroundColor, flexDirection: 'row', alignItems: 'center', borderRadius: 10, width: '40%', marginLeft: '4%', marginRight: '8%' }}>
              <Pressable onPress={() => showMode('date')} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ color: textColor, opacity: 0.9, height: 50, width: '75%', fontSize: 16, marginLeft: '5%' }}
                  placeholder='Date'
                  value={date.toLocaleDateString().slice(0, 10)}
                  editable={false} // Disable editing to prevent keyboard from showing
                />
                <FontAwesome5 name="calendar" size={24} color={textColor} style={{ marginRight: 10 }} />
              </Pressable>
            </View>

            {/* Time Input */}
            <View style={{ backgroundColor: GoalListItemBackgroundColor, flexDirection: 'row', alignItems: 'center', borderRadius: 10, width: '40%', marginLeft: '4%', marginRight: '8%', }}>
              <Pressable onPress={() => showMode('time')} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ color: textColor, opacity: 0.9, height: 50, width: '75%', fontSize: 17, marginLeft: '8%', marginRight: '3%' }}
                  placeholder='Time'
                  value={formatTime(date)}
                  editable={false} // Disable editing to prevent keyboard from showing
                />
                <FontAwesome5 name="clock" size={24} color={textColor} style={{ position: 'absolute', right: 0, marginRight: 10 }} />
              </Pressable>
            </View>
          </View>

          <Text style={{ color: textColor, marginBottom: '3%', marginLeft: '3%', fontSize: 25, marginTop: '2%', fontWeight: 'bold', fontFamily: 'Roboto_900Black' }}>Description</Text>
          <TextInput
            style={[styles.input, { backgroundColor: GoalListItemBackgroundColor, borderRadius: 10, width: '93%', marginLeft: '4%', color: textColor, height: '35%', textAlignVertical: 'top' }]}
            placeholder="Add Description"
            placeholderTextColor={textColor}
            value={description}
            onChangeText={setDescription}
            multiline={true}
          />
        </View>
        <View style={{ marginBottom: 20, }}>
          <Pressable onPress={UpdateTask} style={{ borderRadius: 10, width: 'auto' }}>
            {({ pressed }) => (
              <LinearGradient
                colors={['#1464c4', '#2198d6']} // Adjust gradient colors as needed
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  opacity: pressed ? 0.8 : 1, // Adjust opacity on press
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Create Task</Text>
              </LinearGradient>
            )}
          </Pressable>
        </View>

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
    </KeyboardAvoidingView>
  );

}

// TEST COMMIT

const styles = StyleSheet.create({
  sizeText: {
    fontSize: 15,
    fontWeight: '400'
  },
  size: {
    backgroundColor: 'gainsboro',
    alignItems: 'center',
    // aspectRatio: 1,
    justifyContent: 'center',
    flexDirection: 'row', // Display items in a row horizontally
    marginRight: 10, // Add spacing between items
  },
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set background color as desired
    padding: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#eee', // Adjust background color as desired
  },
  submitButton: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
});


// TODO sort karna hai recent to least recent
// TODO INFO KI JAGEH MODE KA BUTTON DENA HAI, LIGHT OR DARK KA -> DONE
// TODO search ka option dena hai
// TODO mic ka option dena hai to create task
// TODO agar kisi task ka time exceed ho jaaye to alarm baj jaana chaiye (if this not possible, then us task ko alag hi top pe highlight karde, ki ye bacha hua hai)
// TODO designing karni hai
// TODO give a delete icon to delete all tasks, or specific tasks.

// TODO add font
// TODO add perfect colors for dark mode on index.tsx

