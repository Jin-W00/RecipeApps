import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, PixelRatio } from 'react-native';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './firebase'

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import RecipeScreen from './screens/RecipeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const [focused, setFocused] = useState(null)

  const limitText = (text, limit) => {
    if (text.length <= limit) {
      return text;
    }
    return text.slice(0, limit) + '...';
  }

  return (
  <NavigationContainer>
      <Stack.Navigator screenOptions={{headerTransparent: true, animationEnabled: false, headerLeft: ()=> null,}}>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={HomeScreen} 
         options={({ navigation}) => ({
          headerTitle: ()=>(
            <View style={styles.container}>
                <TouchableOpacity style={{ marginLeft:width*0.03, marginTop:height*0.027, ...styles.title}} onPress={() => {setFocused('Home'), navigation.navigate('Home')}}>
                  <Text style={{ fontWeight:{focused} === 'Home'?'bold':'normal', ...styles.titleText}}>Recipe Apps</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {auth.signOut().then(() => {navigation.replace("Login")}).catch(error => alert(error.message))}} style={styles.button}>
                  <Text style={styles.buttonText}>{limitText(auth.currentUser?.email, 5)}</Text>
                </TouchableOpacity>
            </View>
            )})}/>

         <Stack.Screen name="Recipe" component={RecipeScreen} 
         options={({navigation}) => ({
          headerTitle: ()=>(
            <View style={styles.container}>
                <TouchableOpacity style={{ ...styles.title}} onPress={() => {setFocused('Home'), navigation.navigate('Home')}}>
                  <Text style={{ fontWeight:{focused} === 'Home'?'bold':'normal', ...styles.titleText}}>Recipe Apps</Text>
                </TouchableOpacity>
            </View>
            ), 
            headerTintColor: '#ffffff'
            })}/>
            
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height)
const BASE_SIZE = 16; 
const screenWidth = width < height ? width : height;
const scale = screenWidth / 375; 
const fontScale = PixelRatio.getFontScale(); 

const responsiveScale = size => {
  const newSize = size * scale * fontScale / BASE_SIZE; 
  return Math.round(PixelRatio.roundToNearestPixel(newSize)); 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    flexDirection:'row', 
  },

  title:{
    flex:0.9,
  },

  titleText:{
    fontSize: 19,
     color: 'white'
  },
  
  button: {
    backgroundColor: '#0782F9',
    width: '30%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop:height*0.02,
    paddingVertical: height*0.01
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
