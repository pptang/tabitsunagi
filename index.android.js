import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import SearchPage from './components/SearchPage';
import JourneySchedule from './components/JourneySchedule';
import SpotList from './components/SpotList';

const App = StackNavigator({
  SearchPage: { screen: SearchPage },
  JourneySchedule: { screen: JourneySchedule },
  SpotList: { screen: SpotList }
});

AppRegistry.registerComponent('tabitsunagi', () => App);
