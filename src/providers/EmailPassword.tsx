import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {Alert, Image, StyleSheet, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {translate} from '../components/translationService'
function EmailPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (error) {
      Alert.alert('Sign In - Error', error);
    }
  }, [error]);

  async function attemptSignIn() {
    if (!email || !password) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      switch (e.code) {
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('No user found or wrong password.');
          break;
        default:
          console.error(e);
          break;
      }
      setLoading(false);
    }
  }

  return (
    <View style={styles.form}>
      <Image
        style={styles.icon}
        source={{
          uri:
            'https://www.pinclipart.com/picdir/big/333-3331099_morocco-flag-icon-circle-clipart.png',
        }}
      />
      <TextInput
        defaultValue={email}
        label={translate('emailHolder')}
        underlineColor="#fff"
        theme={maskTheme}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />
      <TextInput
        autoCapitalize="none"
        secureTextEntry
        defaultValue={password}
        label={translate('passwordHolder')}
        underlineColor="#fff"
        theme={maskTheme}
        onChangeText={setPassword}
      />
      <Button
        style={styles.button}
        icon="lock"
        mode={loading ? 'text' : 'outlined'}
        onPress={() => (loading ? null : attemptSignIn())}
        theme={maskTheme}
        loading={loading}>
        {loading ? translate('signingin') : translate('signinButton')}
      </Button>
    </View>
  );
}

const maskTheme = {
  dark: true,
  colors: {
    text: '#fff',
    primary: '#fff',
    background: 'transparent',
    placeholder: '#fff',
  },
};

const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    padding: 10,
    width: 65,
    height: 65,
  },
  form: {
    flex: 1,
    padding: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  button: {
    marginVertical: 20,
  },
});

export default EmailPassword;
