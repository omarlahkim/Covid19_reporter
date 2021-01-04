import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { StyleSheet, View, Image, Text, Alert, RefreshControlBase, PermissionsAndroid, Picker, ScrollView, I18nManager } from 'react-native';
import {
  Avatar,
  Caption,
  FAB,
  Headline,
  Subheading,
  Theme,
  Title,
  withTheme,
  Paragraph,
  TextInput,
  Button,
  Modal,
  Appbar,
  ActivityIndicator
} from 'react-native-paper';
import moment from 'moment';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/storage';
import RNPickerSelect from 'react-native-picker-select';
import { translate } from '../components/translationService.js'
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationParams } from 'react-navigation';
import { UserContext } from '../App';
import Hero from '../components/Hero';
import Provider from '../components/Provider';
import Facebook from '../providers/Facebook';
import Google from '../providers/Google';
import { getProviders } from '../util/helpers';
import ImagePicker from 'react-native-image-picker';
import Dialog from "react-native-dialog";
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Transition } from 'react-native-reanimated';
import Spinner from 'react-native-loading-spinner-overlay';
import MapPicker from '../components/MapPicker/index'

export interface Props {
  theme: Theme;
  navigation: NavigationParams;
  imageUri?: Object
  chosenLocation?: Object


}
interface State {
  imageUri: string
  chosenLocation: object
  isModalVisible: boolean
  comment: string
  category: string
  number: string
  loading: boolean
  success: boolean

}

class AlerteCovid extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      imageUri: '',
      chosenLocation: {},
      isModalVisible: false,
      comment: "",
      category: 'Rassemblement',
      number: '2 a 10',
      loading: false,
      success:false
    }
  }

  pickImage = async () => {
    const options = {
      title: translate('selectImage'),
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      takePhotoButtonTitle: translate('takePhotoButtonTitle'),
      chooseFromLibraryButtonTitle: translate('chooseFromLibraryButtonTitle'),
      cancelButtonTitle: translate('backButton'),
    };
    ImagePicker.showImagePicker(options, async (response) => {
      //console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = response.uri;

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        await this.setState({
          imageUri: source,
        });
        //console.log('Image added successfully to the state of the application')


      }
    });
  }
  uriToBlob = (uri) => {

    return new Promise((resolve, reject) => {

      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };

      // this helps us get a blob
      xhr.responseType = 'blob';

      xhr.open('GET', uri, true);
      xhr.send(null);

    });

  }
  resetState = async ()=>{
    await this.setState({
      imageUri: '',
      chosenLocation: {},
      isModalVisible: false,
      comment: "",
      category: 'Rassemblement',
      number: '2 a 10',
      loading: false,
    })

  }
  sendButtonClicked = async (coords: Object) => {
    await this.saveCoords(coords);
    await this.showCommentModal();
  }
  sendReport = async () => {
    await this.hideCommentModal();
    await this.startLoading();
    await this.addDataToFirebase();
    await this.stopLoading();
    
    if (this.state.success==true){
      await this.resetState()
      await setTimeout(()=>Alert.alert(translate('sentReport')),1000)
    }
    await this.resetState();
   
  }
  saveCoords = async (coords: Object) => {
    await this.setState({
      chosenLocation: coords
    })
  }
  showCommentModal = async () => {

    await this.setState({
      isModalVisible: true
    })
  }
  hideCommentModal = async () => {
    await this.setState({
      isModalVisible: false
    })
  }
  startLoading = async () => {

    await this.setState({
      loading: true
    })
  }
  stopLoading = async () => {
    await this.setState({
      loading: false
    })
  }
  setComment = async (commentText: string) => {
    await this.setState({
      comment: commentText
    })
  }
  addDataToFirebase = async () => {
    var reportedLocation = this.state.chosenLocation;
    var comment = this.state.comment;
    var imageUri = this.state.imageUri;
    var timeOfCreation = moment().unix();
    await firebase.firestore().collection('reports').add({
      comment,
      reportedLocation,
      timeOfCreation
    }).then(async ref => {
      if (imageUri != '') {
        const ext = this.state.imageUri.split('.').pop(); // Extract image extension
        await firebase.storage().ref('reports').child(ref.id + '.' + ext).putFile(imageUri)
      }
    }).then(res => this.setState({success:true})).catch(err => Alert.alert('Something went wrong'))
  }


  render() {


    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.loading}
        />
        <Appbar.Header>
          <Appbar.Action
            icon="menu"
            onPress={() => { this.props.navigation.openDrawer(); }}
          />
          <Appbar.Content title={translate('reports')} />
        </Appbar.Header>

        <MapPicker
          buttonText={translate('sendReportButton')}
          buttonStyle={styles.locButton}
          onLocationSelect={({ latitude, longitude }) => { this.sendButtonClicked({ latitude, longitude }); }}
        />
        {this.state.imageUri=='' ? null : <Image source={{uri:this.state.imageUri == '' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Black_colour.jpg/1200px-Black_colour.jpg': this.state.imageUri }} style={styles.uploadAvatar} />}

        

        <FAB
          color="#fff"
          style={[styles.fab, { backgroundColor: this.props.theme.colors.primary }]}
          icon="photo"
          onPress={this.pickImage}
        />
        
        <Modal  onDismiss={this.hideCommentModal} visible={this.state.isModalVisible}>

          <KeyboardAwareScrollView>

            <ScrollView style={{ backgroundColor: 'white', padding: I18nManager.isRTL ? 0 : 30 }}>
              <View style={{ height: 30 }} />

              <Title>{translate('categoryTitle')}</Title>
              <Paragraph>
                {translate('categoryDescription')}
              </Paragraph>
              <Picker
                selectedValue={this.state.category}
                onValueChange={async (value) => { await this.setState({ category: value }); }}
              >
                <Picker.Item label={translate("Rassemblement")} value="Rassemblement" />
                <Picker.Item label={translate("Inflation")} value="Inflation" />
                <Picker.Item label={translate("Agression")} value="Agression" />

              </Picker>

              <Title>{translate('numberTitle')}</Title>
              <Paragraph>
                {translate('numberDescription')}
              </Paragraph>
              <Picker

                selectedValue={this.state.number}
                onValueChange={async (value) => { await this.setState({ number: value }); }}

              >
                <Picker.Item label={translate('option1')} value="2 a 10" />
                <Picker.Item label={translate('option2')} value="10 a 30" />
                <Picker.Item label={translate('option3')} value="30 ou plus" />

              </Picker>
              <Title>{translate('commentTitle')}</Title>
              <Paragraph>
                {translate('commentDescription')}
              </Paragraph>
              <TextInput
                multiline={true}
                style={styles.input}
                mode="flat"
                label={translate("commentHolder")}
                placeholder={translate("commentHolder")}
                value={this.state.comment}
                numberOfLines={3}
                onChangeText={(Text) => { this.setComment(Text) }}
              />
              <Button style={styles.hideButton} color='#136207' mode="contained" onPress={() => { this.sendReport() }}>
                {translate('saveButton')}
              </Button>
              <Button color='#9b1c31' style={styles.hideButton} mode="contained" onPress={() => { this.hideCommentModal() }}>
                {translate('backButton')}
              </Button>

              <View style={{ flex: 1, height: 70 }} />
            </ScrollView>
          </KeyboardAwareScrollView>
        </Modal>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  uploadAvatar: {
    position: 'absolute',
    margin: 10,
    left: 0,
    bottom: 20,
    width: 100,
    height: 120,
    opacity: 1,
    borderRadius:4,

  },
  hideButton: {
    marginTop: 20
  },
  cancelButton: {
    marginTop: 20
  },
  content: {
    paddingHorizontal: 20,
  },
  profile: {
    marginTop: -50,
    paddingVertical: 10,
  },
  avatar: {
    borderColor: '#fff',
    borderWidth: 5,
    elevation: 4,
  },
  input: {
    marginTop: 20,
  },
  providers: {
    backgroundColor: '#F6F7F8',
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 30,
    padding: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 30,
    bottom: 30,
  },
  fabRefresh: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 180,
  },
  fabSettings: {
    position: 'absolute',
    margin: 16,
    right: 0,
    top: 100,
  },

  locButton: {
    backgroundColor: '#9b1c31',

  },
  center: {
    width: '100%',
    alignItems: 'center',
  },
});

export default withTheme(AlerteCovid);
