import React, {Fragment} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Theme, withTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NavigationParams} from 'react-navigation';
import Hero from '../components/Hero';
import ProviderButton from '../components/ProviderButton';
import EmailPassword from '../providers/EmailPassword';
import Facebook from '../providers/Facebook';
import Google from '../providers/Google';
import { translate } from '../components/translationService';

interface Props {
  navigation: NavigationParams;
  theme: Theme;
}


function SignIn({navigation, theme}: Props) {
  
  return (
    <Fragment>
      <Hero
        height={330}
        colors={['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.3)']}
        image={
          'https://www.rdl.gouv.qc.ca/sites/default/files/news/COVID-19.jpg'
        }>
        <EmailPassword />
      </Hero>

      <View style={[styles.fab, {backgroundColor: theme.colors.primary}]}>
        <Icon name="arrow-down" color="#fff" size={23} />
      </View>

      <View style={styles.center}>
        <Button
          color="#9e9e9e"
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.button}>
          {translate('forgotButton')}
        </Button>
        <Button
          mode="contained"
          icon="add"
          onPress={() => navigation.navigate('CreateAccount')}
          style={styles.button}>
          {translate('createAccountButton')}
        </Button>

        <View
          style={[styles.divider, {backgroundColor: theme.colors.primary}]}
        />

        <Facebook />
        <Google />
        <ProviderButton
          type="phone"
          onPress={() => navigation.navigate('PhoneSignIn')}>
          {translate('signinPhone')}
        </ProviderButton>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 6,
    marginTop: -25,
  },
  button: {
    marginVertical: 5,
    width: 300,
  },
  divider: {
    width: 300,
    marginVertical: 20,
    height: StyleSheet.hairlineWidth,
  },
});

export default withTheme(SignIn);
