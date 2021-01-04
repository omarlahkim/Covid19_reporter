import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import {Button, HelperText, Paragraph, TextInput} from 'react-native-paper';
import {translate} from '../components/translationService'

function CreateAccount() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');

  const [help, setHelp] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (error) {
      Alert.alert('Create Account - Error', error);
    }
  }, [error]);

  useEffect(() => {
    if (password === confirm) {
      setHelp('');
    } else if (password && confirm && password !== confirm) {
      setHelp('Passwords do not match.');
    }
  }, [password, confirm]);

  async function handleCreate() {
    try {
      setLoading(true);
      setError('');
      await auth().createUserWithEmailAndPassword(email, password);
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
    <ScrollView style={styles.container}>
      <Paragraph>
        {translate('createAccountDescription')}
      </Paragraph>
      <TextInput
        style={styles.input}
        mode="outlined"
        label={translate('emailHolder')}
        value={email}
        onChangeText={setEmail}
        theme={inputTheme}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        secureTextEntry
        style={styles.input}
        mode="outlined"
        label={translate('passwordHolder')}
        value={password}
        onChangeText={setPassword}
        theme={inputTheme}
      />
      <TextInput
        secureTextEntry
        style={styles.input}
        mode="outlined"
        label={translate('passwordConfirmHolder')}
        value={confirm}
        onChangeText={setConfirm}
        theme={inputTheme}
      />
      <HelperText type="error" visible={!!help}>
        {help}
      </HelperText>
      <Button
        loading={loading}
        disabled={!email || !password || !confirm || !!help}
        onPress={() => (loading ? null : handleCreate())}>
        {loading ? translate('creatingAccountTitle') : translate('createAccountTitle')}
      </Button>
    </ScrollView>
  );
}

const inputTheme = {
  colors: {
    background: '#fff',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  input: {
    marginVertical: 10,
  },
});

export default CreateAccount;
