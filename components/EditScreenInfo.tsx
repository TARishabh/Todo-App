import React from 'react';
import { StyleSheet } from 'react-native';

import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

import Colors from '@/constants/Colors';

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Open up the code for this screen:
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)">
          <MonoText>{path}</MonoText>
        </View>

        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Change any of the text, save the file, and your app will automatically update.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <ExternalLink
          style={styles.helpLink}
          href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Tap here if your app doesn't automatically update after making changes
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});


// import React from 'react';
// import { Pressable, View, Text, StyleSheet, useColorScheme } from 'react-native';
// import { Link } from 'expo-router';
// import { Goal } from '@/assets/data/tasks';
// import { useFonts ,Montserrat_600SemiBold,} from '@expo-google-fonts/montserrat';


// // TODO sort karna hai recent to least recent
// // TODO DELETE KA BUTTON DENA HAI
// // TODO INFO KI JAGEH MODE KA BUTTON DENA HAI, LIGHT OR DARK KA
// // TODO search ka option dena hai
// // TODO mic ka option dena hai to create task
// // TODO agar kisi task ka time exceed ho jaaye to alarm baj jaana chaiye (if this not possible, then us task ko alag hi top pe highlight karde, ki ye bacha hua hai)
// // TODO designing karni hai 


// // TODO add font
// // TODO add perfect colors for dark mode on index.tsx

// type ItemType = {
//   item: Goal
// }

// const GoalsListItem = ({ item }: ItemType) => {
//   let [fontsLoaded] = useFonts({Montserrat_600SemiBold,});
//   const colorScheme = useColorScheme()
//   const backgroundColor = colorScheme === 'dark' ? '#000000' : '#F4F5F7';
//   const textColor = colorScheme === 'dark' ? 'white' : 'black';

//   return fontsLoaded && (
//     <Link href={`/${item.id}`} asChild>
//       <Pressable style={styles.goalItem}>
//           <View>
//             <Text style={[styles.goalTitle,{color:textColor}]}>{item.title}</Text>
//           </View>
//           <View>
//             <Text style={[styles.goalTargetDate, {color:textColor}]}>
//               {item.targetDate.toLocaleDateString()}
//             </Text>
//           </View>
//           <View>
//           {item.description && (
//             <Text style={[styles.goalDescription , {color:textColor}]}>{item.description}</Text>
//           )}
//           </View>
//       </Pressable>
//     </Link>
//   );
// }
// const styles = StyleSheet.create({
//   goalItem: {
//     width:'93%'
//   },
//   goalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: '2%',
//     marginStart:1,
//     marginLeft:7,
//     fontFamily:'Montserrat_600SemiBold'
//   },
//   goalDescription: {
//     fontSize: 14,
//     marginLeft:5,
//     fontFamily:'Montserrat_600SemiBold'
//   },
//   goalTargetDate: {
//     fontSize: 13,
//     marginTop: 5,
//     position: 'absolute', // Position absolutely
//     top: 0, // Align to the top
//     right: 10, // Align to the right
//     marginRight:10,
//     fontWeight:'bold',
//     fontFamily:'Montserrat_600SemiBold'
//   },
// });

// export default GoalsListItem;
