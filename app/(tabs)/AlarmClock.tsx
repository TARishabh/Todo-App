// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
// import * as Notifications from "expo-notifications";
// import { useEffect, useState, useRef } from "react";
// import { LogBox } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// LogBox.ignoreLogs(["new NativeEventEmitter"]);
// LogBox.ignoreAllLogs();

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldPlaySound: false,
//     shouldShowAlert: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function AlarmClock() {
//     const notificationListener = useRef<Notifications.Subscription>();
//     const [notification, setNotification] = useState<Notifications.Notification>();
//     const [hourr, setHour] = useState<string>("");
//     const [minutee, setMinute] = useState<string>("");
//     const [ampm, setAmpm] = useState<string>("");
//     const [notificationId, setNotificationId] = useState<string>("none");
  
//     useEffect(() => {
//       getData();
//       notificationListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
//         console.log("Notification response received:", response);
//       });
//       return () => {
//         Notifications.removeNotificationSubscription(notificationListener.current!);
//       };
//     }, []);
  

//   let date = new Date();
//   date.setSeconds(date.getSeconds() + 5);

//   async function scheduleNotificationsHandler() {
//     console.log(notificationId);
//     if (notificationId === "none") {
//       var newHourr = parseInt(hourr);
//       if (ampm === "pm") {
//         newHourr = newHourr + 12;
//       }
//       const identifier = await Notifications.scheduleNotificationAsync({
//         content: {
//           title: "Alarm",
//           body: "It is time to wake up!",
//           data: { data: "Your morning alarm data" },
//         },
//         trigger: {
//           hour: newHourr,
//           minute: parseInt(minutee),
//           repeats: true,
//         },
//       });
//       setAmpm("");
//       setHour("");
//       setMinute("");
//       console.log(date);
//       console.log(identifier);
//       setNotificationId(identifier);
//       storeData(identifier);
//     } else {
//       alert("Turn off alarm before starting a new one");
//       setAmpm("");
//       setHour("");
//       setMinute("");
//       console.log(notificationId);
//       console.log("not working");
//     }
//   }

//   async function turnOffAlarm() {
//     console.log(notificationId);
//     if (notificationId !== "none") {
//       await Notifications.cancelAllScheduledNotificationsAsync();
//       const resetValue = "none";
//       await setNotificationId(resetValue);
//       storeData(resetValue);
//     } else {
//       alert("Alarm already turned off");
//       console.log(notificationId);
//     }
//   }

//   async function setAlarmFor1223AM() {
//     const newHour = 0; // 12 AM
//     const newMinute = 26; // 23 minutes
//     const newAMPMMark = "am";
  
//     const identifier = await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "Alarm",
//         body: "It's time to wake up!",
//         data: { data: "Your morning alarm data" },
//       },
//       trigger: {
//         hour: newHour,
//         minute: newMinute,
//         repeats: true,
//       },
//     });
  
//     setNotificationId(identifier);
//     storeData(identifier);
//   }

//   async function storeData(id: string) {
//     try {
//       const savedValues = id;
//       const jsonValue = await AsyncStorage.setItem(
//         "currentAlarmId",
//         JSON.stringify(savedValues)
//       );
//       return jsonValue;
//     } catch (e) {
//       alert(e);
//     }
//   }

//   async function getData() {
//     try {
//       const jasonValue = await AsyncStorage.getItem("currentAlarmId");
//       const jasonValue2 = JSON.parse(jasonValue!);
//       setNotificationId(jasonValue2);
//     } catch (e) {
//       alert(e);
//     }
//   }

//   return (
//     <View style={styles.container}>
// <Pressable style={styles.button} onPress={setAlarmFor1223AM}>
//   <Text style={styles.buttonText}>Set Alarm for 12:23 AM</Text>
// </Pressable>

//       <Text style={styles.header}>Alarm App</Text>
//       <TextInput
//         style={styles.textInput}
//         placeholder="Enter hour"
//         value={hourr}
//         onChangeText={(text) => setHour(text)}
//       />
//       <TextInput
//         style={styles.textInput}
//         placeholder="Enter minute"
//         value={minutee}
//         onChangeText={(text) => setMinute(text)}
//       />
//       <TextInput
//         style={styles.textInput}
//         placeholder="Enter am or pm"
//         value={ampm}
//         onChangeText={(text) => setAmpm(text)}
//       />
//       <Pressable style={styles.button} onPress={scheduleNotificationsHandler}>
//         <Text style={styles.buttonText}>Turn on Alarm</Text>
//       </Pressable>
//       <Pressable style={styles.button} onPress={turnOffAlarm}>
//         <Text style={styles.buttonText}>Turn off Alarm</Text>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   header: {
//     color: "green",
//     margin: 20,
//     fontSize: 60,
//     fontWeight: "bold",
//   },
//   button: {
//     width: "70%",
//     backgroundColor: "green",
//     borderRadius: 18,
//     margin: 15,
//     padding: 5,
//   },
//   buttonText: {
//     color: "white",
//     textAlign: "center",
//     fontSize: 35,
//     fontWeight: "bold",
//   },
//   textInput: {
//     fontSize: 30,
//     margin: 5,
//   },
// });

