import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import {Theme, withTheme} from 'react-native-paper';
import Profile from './Profile';
import Settings from './Settings';
import AlerteCovid from './AlerteCovid';
import {translate} from '../components/translationService'
import { Transition } from 'react-native-reanimated';

interface Props {
  theme: Theme;
}

const Drawer = createDrawerNavigator();

function SignedInStack({theme}: Props) {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="AlerteCovid"
        >

        <Drawer.Screen name={translate("reports")} component={AlerteCovid} />
        
        {/* <Drawer.Screen name={translate("statistics")} component={Settings} />
        <Drawer.Screen name={translate("advices")} component={Settings} />
        <Drawer.Screen name={translate("news")} component={Settings} />
         */}
        <Drawer.Screen
          
          name={translate("profile")}
          component={Profile}
        />
        

        <Drawer.Screen name={translate("settings")}component={Settings} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default withTheme(SignedInStack);
