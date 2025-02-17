import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Platform,
  Switch,
} from 'react-native';

import {Avatar} from 'react-native-paper';
import {th} from 'date-fns/locale';
import {format} from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import axios from 'axios';

import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';
import {globeStyles} from '../styles/globle';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SaveATKScreen = ({navigation}) => {
  const [image, setImage] = React.useState({});
  const [profile, setProfile] = React.useState({});
  const [isEnabled, setIsEnabled] = React.useState(false);

  const onChange = val => {
    setIsEnabled(!val);
  };

  const getProfile = async () => {
    const idcard = await AsyncStorage.getItem('userIdcard');
    const photo = await AsyncStorage.getItem('userPhoto');
    setProfile({
      idcard,
      photo
    });
  };

  React.useEffect(() => {
    getProfile();
  }, []);

  const openCamera = async () => {
    if (Platform.OS === 'ios') {
      launchCamera({includeBase64}, async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = {uri: response.assets[0].base64};
          await setImage(source.uri);
          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        }
      });
    } else if (Platform.OS === 'android') {
      launchCamera({includeBase64: true}, async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = {
            uri: response.assets[0].uri,
            base64: 'data:image/jpeg;base64,' + response.assets[0].base64,
          };
          await setImage(source);
          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        }
      });
    }
  };

  const onUpload = async () => {
    const urlUpload = 'http://pmtechapp.lnw.mn/heal_api/atk.php';
    const resp = await axios.post(urlUpload, {
      file_attachment:image.base64,
      customer_idcard: profile.idcard,
    });
    navigation.navigate('Profile')
    console.log(resp.data)
  };
  return (
    <View style={{flex: 1}}>
      <ImageBackground
        source={require('../assets/background_gray.jpg')}
        style={{
          flex: 1,
          ...Platform.select({
            ios: {paddingTop: 30},
          }),
        }}
        resizeMode="cover">
        <View style={{paddingHorizontal: 20, paddingTop: 20}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={require('../assets/back.png')}
                style={{width: 50, height: 50}}
              />
            </TouchableOpacity>
            <Text style={[styles.text, globeStyles.fontBold]}>MY PROFILE</Text>
            {/* <TouchableOpacity> */}
            <Image
              // source={require('../assets/setting.png')}
              style={{width: 50, height: 50}}
            />
            {/* </TouchableOpacity> */}
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{alignItems: 'center'}}>
              <Avatar.Image
                source={{
                  uri: profile.photo,
                }}
                size={50}
              />
              <Text style={[globeStyles.font, {fontSize: 15}]}>
                {format(new Date(), 'dd MMMM yyyy', {locale: th})}
              </Text>
            </View>
            <TouchableOpacity
              style={{marginTop: 25}}
              onPress={() => {
                navigation.navigate('SaveATK');
              }}>
              <Image
                source={require('../assets/scan.png')}
                style={{width: 200, height: 50}}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={globeStyles.cardlayout}>
          <Text />
          <View style={[globeStyles.cardinside]}>
            <View style={{alignItems: 'center'}}>
              <Text style={[styles.text, globeStyles.fontBold,{marginBottom:40}]}>
                บันทึกประวัติ ATK
              </Text>
              <Image
              
                source={image.uri ? {uri:image.uri} : require('../assets/atk_negative11.jpg')}
                style={{
                  height: 200,
                  width: 200,
                  alignItems: 'center',
                  justifyContent: 'center',
                  resizeMode:'contain'
                }}
                imageStyle={{borderRadius: 15}}
              />
              <View style={{flexDirection: 'row'}}>
                {/* <TouchableOpacity
                  style={[
                    {
                      borderTopStartRadius: 25,
                      borderBottomStartRadius: 25,
                    },
                    styles.button,
                    isEnabled
                      ? {backgroundColor: '#FF0000'}
                      : {backgroundColor: '#FF8888'},
                  ]}
                  onPress={() => {
                    onChange(isEnabled);
                  }}>
                  <Text style={globeStyles.fontWhite}>ติดเชื้อ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    {
                      borderTopEndRadius: 25,
                      borderBottomEndRadius: 25,
                    },
                    styles.button,
                    isEnabled
                      ? {backgroundColor: '#86FF99'}
                      : {backgroundColor: '#048200'},
                  ]}
                  onPress={() => {
                    onChange(isEnabled);
                  }}>
                  <Text style={globeStyles.fontWhite}>ไม่ติดเชื้อ</Text>
                </TouchableOpacity> */}
              </View>
              <View style={{flexDirection: 'row', marginTop: 50}}>
                <TouchableOpacity
                  style={[
                    {
                      width: 125,
                      height: 50,
                      backgroundColor: '#fff',
                      borderRadius: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    styles.shadow,
                  ]}
                  onPress={openCamera}>
                  <Text style={[globeStyles.font]}>เปิดกล้อง</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    {
                      width: 125,
                      height: 50,
                      backgroundColor: '#287094',
                      borderRadius: 50,
                      marginStart: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    styles.shadow,
                  ]}
                  onPress={onUpload}>
                  <Text style={[globeStyles.fontWhite]}>บันทึก</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
  },
  borderBot: {
    borderBottomWidth: 1,
    width: '90%',
    alignSelf: 'center',
    borderColor: '#287094',
  },
  flexRow: {
    flexDirection: 'row',
    paddingVertical: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
  },
  input: {
    borderColor: '#287094',
    borderBottomWidth: 1,
    width: '90%',
  },
  button: {
    width: 125,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:25
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
});

export default SaveATKScreen;
