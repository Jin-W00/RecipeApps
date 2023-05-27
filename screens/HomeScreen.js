import { Dimensions, FlatList, Image, ImageBackground, PixelRatio, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth} from 'firebase/auth'
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../firebase'
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { SearchBar } from 'react-native-elements';

const HomeScreen = ({navigation}) => {
  // const navigation = useNavigation()
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const db = getFirestore(app);
  const recipeRef = collection(db, 'recipes');
  const [ recipes, setRecipes ] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState([]);
  const [modelVisible, setModelVisible] = useState(false);
  const [status, setStatus] = useState("All")
  const [datalist, setDatalist] = useState(recipes) 

  const limitText = (text, limit) => {
    if (text.length <= limit) {
      return text;
    }
    return text.slice(0, limit) + '...';
  }

  useEffect(() => {
      const fetchData = async () => {
        onSnapshot(recipeRef, (querySnapshot) => {
          const recipes = [];
          querySnapshot.forEach((doc) => {
            const { recipeName, recipeType, ingredients, desc, step1, step2, step3, image } = doc.data();
            recipes.push({
              id: doc.id,
              recipeName,
              recipeType,
              ingredients,
              desc,
              step1,
              step2,
              step3,
              image
            });
          });
          setRecipes(recipes);
          setDatalist(recipes)
        });
      };

      fetchData();
    }, []);


    const searchFilterFunction = (text) => {
      if (text) {
        setModelVisible(true)
        const newDataName = recipes.filter(function (item) {
          const itemData = item.recipeName
            ? item.recipeName.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        const newDataType = recipes.filter(function (item) {
          const itemData = item.recipeType
            ? item.recipeType.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setFilter(newDataName.concat(newDataType));
        setSearch(text);
      } else {
        setModelVisible(true)
        setFilter(recipes);
        setSearch(text);
      }
    };

    const setStatusFilter = status =>{
      if (status !== "All")
        {
            setDatalist([...recipes.filter(e=>e.recipeType === status)])
        } else{
            setDatalist(recipes)
        }
  
        setStatus(status)
    }

  return (
    <ImageBackground source={require('../SVG/homeBg.png')}  style={styles.bgImage}>
      <View style={styles.dummyBox1}/>
      <ScrollView style={styles.container}> 
            <SwiperFlatList
              autoplay
              autoplayLoop
              autoplayLoopKeepAnimation
              showPagination
              data={recipes}
              paginationStyle={{marginBottom:height*1.05}}
              renderItem={({item}) => (
                  <View>
                      <View style={styles.swiper}>
                        <Image style={styles.image} source={{uri:item.image}} />
                      </View>
                      <View style={styles.firstSectionContainer}>
                        <View style={{flex:0.8}}>
                        <Text style={{marginTop:height*0.01, marginLeft:width*0.05, ...styles.title}}>{item.recipeName}</Text>
                        <Text style={{marginTop:height*0.001, marginLeft:width*0.05, ...styles.desc}}>{item.recipeType}</Text>
                        </View>
                        <TouchableOpacity style={styles.firstSectionContainer} onPress={() => navigation.navigate('Recipe', {item})}>
                        <Text style={{marginTop:height*0.018, ...styles.subTitle}}>View Here</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={{marginTop:height*0.002, marginLeft:width*0.05, ...styles.desc}}>{limitText(item.desc, 70)}</Text>
                  </View>
                    )}
              />
              <View style={{marginTop:height*0.03}}>
                <SearchBar
                    round
                    inputStyle={{backgroundColor: 'white'}}
                    containerStyle={{marginLeft:width*0.04, ...styles.searchContainer}}
                    inputContainerStyle={{backgroundColor: '#f56d15'}}
                    searchIcon={styles.searchIcons}
                    clearIcon={styles.searchIcons}
                    onChangeText={(text) => searchFilterFunction(text)}
                    onClear={() => {searchFilterFunction(''), setModelVisible(false)}}
                    placeholder="Search Your Desired Recipe..."
                    value={search}
                    />
                <FlatList
                    data={filter}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent = {() => <View style={{marginLeft:width*0.08, ...styles.seperatorContainer}}/>}
                    renderItem={({item}) => 
                                modelVisible === true?
                                <View style={{marginLeft:width*0.08, ...styles.resultContainer}}>
                                    <Text style={{marginTop:height*0.014, marginLeft:width*0.02, ...styles.resultRes}} onPress={() => navigation.navigate('Recipe', {item})}>
                                      {item.recipeName}
                                    </Text>
                                  
                                    <Text style={{marginTop:height*0.014, marginLeft:width*0.01, ...styles.resultRes}} onPress={() => navigation.navigate('Recipe', {item})}>
                                      - {item.recipeType}
                                    </Text>
                                </View>:null
                                }
                  />
              </View>

              <View style={styles.firstSectionContainer}>
            <Text style={{marginLeft:width*0.05, ...styles.subTitle}}>Categories</Text>
            <TouchableOpacity style={styles.firstSectionContainer} onPress={() => setStatusFilter("All")}>
              <Text style={{marginLeft:width*0.44, ...styles.category}}>All Categories</Text>
            </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:height*0.02, marginLeft:width*0.04, ...styles.firstSectionContainer}}>
          <TouchableOpacity onPress={() => setStatusFilter("Malaysian Food")}>
            <Text style={{marginLeft:width*0.005, ...styles.catTitle}}>Malaysian Food</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStatusFilter("Indian Food")}>
            <Text style={{marginLeft:width*0.08, ...styles.catTitle}}>Indian Food</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStatusFilter("Chinese Food")}>
            <Text style={{marginLeft:width*0.08, ...styles.catTitle}}>Chinese Food</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStatusFilter("Western Food")}>
            <Text style={{marginLeft:width*0.08, ...styles.catTitle}}>Western Food</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStatusFilter("Japanese Food")}>
            <Text style={{marginLeft:width*0.08, ...styles.catTitle}}>Japanese Food</Text>
          </TouchableOpacity>
        </ScrollView>

              <View style={{marginTop:height*0.05, }}>
                <Text style={{marginLeft:width*0.05, ...styles.subTitle}}>Latest Recipes</Text>
                <FlatList
                  data={datalist}
                  horizontal={true}
                  renderItem={({item}) => 
                              <TouchableOpacity style={{marginTop:height*0.02, marginLeft:width*0.05, ...styles.recipeContainer}} onPress={() => navigation.navigate('Recipe', {item})}>
                                  <Image style={{... styles.recipeImage}} source={{uri:item.image}} />
                                  <Text style={{marginTop:height*0.01, ...styles.title}}>{item.recipeName}</Text>
                                  <Text style={{marginTop:height*0.001, ...styles.desc}}>{item.recipeType}</Text>
                              </TouchableOpacity>
                              }
                  />
              </View>

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
    flex:0.13,
  },

  swiper: {
    width: width,
    height: height * 0.23,
  },

  image: {
    width: width,
    height: height * 0.228,
  },

  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight:'bold'
  },

  subTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight:'bold'
  },

  firstSectionContainer: {
    flexDirection:'row'
  },

  desc: {
    color: '#fff',
    maxWidth: width*0.7,
    fontSize: 14,
  },

  searchContainer: {
    width:width*0.9,
    backgroundColor: 'transparent',
    borderWidth: 0, //no effect
    shadowColor: 'transparent', //no effect
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },

  searchIcons: {
    size: 24,
    color:'white'
  },

  seperatorContainer:{
    width: width*0.82, 
    height: height*0.005, 
    backgroundColor: '#transparent'
  },

  resultContainer: {
    flexDirection:'row',
    width:width*0.82,
    height:height*0.05,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },

  resultRes: {
    color: '#fff',
    fontSize: 14,
  },

  category:{
    color: '#f56d15',
    fontSize: 16,
    fontWeight:'bold'
  },

  catTitle:{
    textAlign:'center',
    color: '#fff',
    fontSize: 14,
    fontWeight:'bold',
    maxWidth: width*0.18,
  },

  recipeContainer: {
    width:width*0.5,
    height:height*0.6,
  },

  recipeImage: {
    width: width *0.5,
    height: height * 0.4,
    borderRadius:15
  },
  
})