import * as React from 'react';
import { useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import './App.css';
import './Screens/Login-Screen/Login'
import {Login} from './Screens/Login-Screen/Login'
import {CreateAccount} from './Screens/CreateAccount-Screen/CreateAccount'
import {Feed} from './Screens/Feed/Feed'
import {Profile} from './Screens/Profile-Screen/Profile';

const Stack = createNativeStackNavigator();

function App() {
  
  return (
    <div className="App">
      <NavigationContainer>

        <Stack.Navigator>
          <Stack.Screen 
            name='Login' 
            component={Login} 
            options= {{title: 'Login'}}
          />
          <Stack.Screen 
            name='CreateAccount' 
            component={CreateAccount} 
            options= {{title: 'Create Account'}}
          />
          <Stack.Screen 
            name='Feed' 
            component={Feed} 
            options= {{title: 'Feed'}}
          />
          <Stack.Screen 
            name='Profile' 
            component={Profile} 
            options= {{title: 'Profile'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </div>
  );
}

export default App;
