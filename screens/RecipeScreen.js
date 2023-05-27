import { Dimensions, FlatList, Image, ImageBackground, PixelRatio, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth} from 'firebase/auth'
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { SearchBar } from 'react-native-elements';

const HomeScreen = ({route}) => {
 const recipes = route.params?.item

  return (
    <ImageBackground source={require('../SVG/homeBg.png')}  style={styles.bgImage}>
      <View style={styles.dummyBox1}/>
        <ScrollView>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={{uri:recipes.image}} />
            </View>

            <View>
                <Text style={{marginTop:height*0.01, marginLeft:width*0.05, ...styles.title}}>{recipes.recipeName}</Text>
                <Text style={{marginLeft:width*0.05, ...styles.subTitle}}>{recipes.recipeType}</Text>
            </View>

            <Text style={{marginTop:height*0.04, marginLeft:width*0.05, ...styles.desc}}>{recipes.desc}</Text>

            <Text style={{marginTop:height*0.05, marginLeft:width*0.05, ...styles.steps}}>Steps</Text>
            <Text style={{marginTop:height*0.02, marginLeft:width*0.05, ...styles.desc}}>1. {recipes.step1}</Text>
            <Text style={{marginTop:height*0.02, marginLeft:width*0.05, ...styles.desc}}>2. {recipes.step2}</Text>
            <Text style={{marginTop:height*0.02, marginLeft:width*0.05, ...styles.desc}}>3. {recipes.step3}</Text>

        </ScrollView>
    </ImageBackground>
  
  )
}

export default HomeScreen

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
  },

  bgImage: {
    flex: 1,
  },

  dummyBox1: {
    flex:0.38,
  },

  imageContainer: {
    width: width,
    height: height * 0.23,
  },

  image: {
    width: width,
    height: height * 0.228,
  },

  title: {
    color: '#fff',
    fontSize: responsiveScale(600),
    fontWeight:'bold'
  },

  subTitle: {
    color: '#fff',
    fontSize: responsiveScale(300),
    fontWeight:'600'
  },

  firstSectionContainer: {
    flexDirection:'row'
  },

  desc: {
    color: '#fff',
    maxWidth: width*0.9,
    fontSize: responsiveScale(250),
  },

  steps: {
    color: '#fff',
    maxWidth: width*0.7,
    fontSize: responsiveScale(250),
    fontWeight: 'bold',
  },

  
  
})