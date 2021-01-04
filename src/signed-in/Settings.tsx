import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';
import {
  Banner,
  Button,
  Divider,
  Paragraph,
  TextInput,
  Title,
  Appbar
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import {translate} from '../components/translationService'
function EditProfile(props) {
  const user = auth().currentUser;

  const [error, setError] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [displayName, setDisplayName] = useState(
    user ? user.displayName || '' : '',
  );
  const [savingPassword, setSavingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (error) {
      Alert.alert('Create Account - Error', error);
    }
  }, [error]);

  async function signOut() {
    GoogleSignin.configure({
      scopes: ['profile', 'email'],
      // TODO change me
      webClientId:
        '93667482372-6l32bpnbnge3vro5dvhgrf2flddbhkc4.apps.googleusercontent.com',
    });
    setSigningOut(true);
    await GoogleSignin.signOut();
    await auth().signOut();
  }

  async function handleDisplayName() {
    if (!user) {
      return;
    }

    if (!savingName) {
      try {
        setSavingName(true);
        await user.updateProfile({
          displayName,
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setSavingName(false);
      }
    }
  }

  async function handlePassword() {
    if (!user || !user.email) {
      return;
    }
    if (!savingPassword) {
      try {
        setSavingPassword(true);
        await auth().signInWithEmailAndPassword(user.email, currentPassword);
        await user.updatePassword(newPassword);
      } catch (e) {
        setError(e.message);
      } finally {
        setSavingPassword(false);
      }
    }
  }

  if (!user) {
    return null;
  }
  
  function isDrawerOpen(){
    return useIsDrawerOpen();
  }

  return (
    <ScrollView style={styles.container}>
      
      <Appbar.Header>
        <Appbar.Action
            icon="menu"
            onPress={() => {
              
                props.navigation.openDrawer();
              
              }
              
            }
          />
          <Appbar.Content title="" />
        </Appbar.Header>
      
      
      <View style={styles.content}>
        <Title>{translate('passwordUpdateTitle')}</Title>
        <Paragraph>{translate('passwordUpdateDescription')}</Paragraph>
        <TextInput
          secureTextEntry
          style={styles.input}
          mode="outlined"
          label={translate('passwordUpdateCurrentHolder')}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          secureTextEntry
          style={styles.input}
          mode="outlined"
          label={translate('passwordUpdateNewHolder')}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          secureTextEntry
          style={styles.input}
          mode="outlined"
          label={translate('passwordConfirmHolder')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button
          disabled={!currentPassword || !newPassword || !confirmPassword}
          mode="outlined"
          loading={savingPassword}
          onPress={handlePassword}
          style={styles.button}>
            {translate('updateButton')}
          </Button>
      </View>
      <Divider />
      <View style={[styles.content, styles.actions]}>
        <Button
          mode="contained"
          loading={signingOut}
          onPress={() => (signingOut ? null : signOut())}
          style={[styles.button, styles.maxWidth]}>
            {translate('signoutButton')}
          </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  maxWidth: {
    width: '100%',
  },
  content: {
    padding: 16,
  },
  banner: {
    backgroundColor: '#ffebee',
  },
  input: {
    marginTop: 20,
  },
  button: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  actions: {
    backgroundColor: '#F6F7F8',
  },
});

export default EditProfile;
