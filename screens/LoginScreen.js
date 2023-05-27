import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ImageBackground, Dimensions, PixelRatio } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../firebase'
import { useNavigation } from '@react-navigation/native'


const LoginScreen = () => {
    //parameters
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

    //auth - signin/up
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)

    useEffect(()=>{
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          navigation.replace("Home");
        }
      });
      return unsubscribe;
    }, [])

    const handleLogin = () => {
      signInWithEmailAndPassword(auth, email, password).then((userCredential)=>{
         //For login log reference, usually won't apply log in workplace
        console.log("Signed in!")
        const user = userCredential.user;
        console.log(user)
      }).catch(error=>{
        console.log(error)
        })
    };

  return (
    <ImageBackground source={require('../SVG/auth.png')}   style={{ ...styles.bgImage}}>
    <KeyboardAvoidingView style={{...styles.container}} behavior="padding">
     <View style={{...styles.dummyBox1}}/>
    <Text style={{...styles.title}} allowFontScaling={false}>Login</Text>
    <Text style={{...styles.subTitle}} allowFontScaling={false}>Sign in to continue</Text>
       <View style={styles.inputContainer}>
       <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
       </View>
       <View style={styles.buttonContainer}>

        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={{marginTop: height*0.02, ...styles.signText}}>NO ACCOUNT?</Text>
        <Text style={{...styles.signText}}>SIGNUP NOW!</Text>
        </TouchableOpacity>

        </View>
    </KeyboardAvoidingView>
    </ImageBackground>
  
  )
}

export default LoginScreen
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
    bgImage: {
      flex: 1,
      // width: '100%',
      // height: '100%',
    },

    container: {
      flex: 1,
      alignItems: 'center',
    },

    dummyBox1:{
      flex: 0.67, 
      width: width
    },

    title: {
      fontSize: responsiveScale(700),
      fontWeight:'bold',
      color: '#000',
      textAlign:'center',
      // backgroundColor:'#f0f0f0',
    },
  
    subTitle:{
      flex: 0.05,
      fontSize: responsiveScale(200),
      opacity:0.5,
      fontWeight:'bold',
      color: '#000',
      textAlign:'center',
    },
      
    inputContainer: {
      width: '80%',
      paddingVertical: 12,
    },
    
    input: {
      backgroundColor: '#a6a6a6',
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderRadius: 10,
      marginTop: 25,
    },

    buttonContainer: {
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 25,
    },

    button: {
      backgroundColor: '#0782F9',
      width: '100%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },

    buttonOutline: {
      backgroundColor: 'white',
      marginTop: 5,
      borderColor: '#0782F9',
      borderWidth: 2,
    },

    buttonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 16,
    },

    buttonOutlineText: {
      color: '#0782F9',
      fontWeight: '700',
      fontSize: 16,
    },
    
    signText:{
      fontSize: 14,
      opacity:0.5,
      fontWeight:'bold',
      color: '#f56d15',
      textAlign:'center',
    },
})

