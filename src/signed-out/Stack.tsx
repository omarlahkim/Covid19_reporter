import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Theme, withTheme} from 'react-native-paper';
import CreateAccount from './CreateAccount';
import ForgotPassword from './ForgotPassword';
import PhoneSignIn from './PhoneSignIn';
import SignIn from './SignIn';

import { translate } from '../components/translationService';

interface Props {
  theme: Theme;
}

const Stack = createStackNavigator();

function SignedOutStack({theme}: Props) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.accent,
        }}>
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateAccount"
          options={{title: translate('createAccountTitle')}}
          component={CreateAccount}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{title: translate('forgotPasswordTitle')}}
        />
        <Stack.Screen name="PhoneSignIn" component={PhoneSignIn} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default withTheme(SignedOutStack);
