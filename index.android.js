/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ListView,
  TouchableHighlight
} from 'react-native';
import JourneyList from './components/JourneyList';

const AUTO_COMPLETE_API = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?';
const API_KEY = 'AIzaSyA9THtJDf8dBNdq6sLKHdq87B3vVbQpz28';
const JOURNEY_LIST_API = 'https://tabitsunagi.com/journey/load?';
export default class tabitsunagi extends Component {
  constructor(props) {
    super(props);
    
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.fetchPredictions = this.fetchPredictions.bind(this);
    this.onPressPrediction = this.onPressPrediction.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.state = {
      text: '',
      placeId: '',
      predictions: this.ds.cloneWithRows([]),
      isOpen: false,
      journeys: []
    };
  }

  onSearch() {
    this.fetchJourneyList(this.state.placeId);
  };

  fetchPredictions(text) {
    this.setState({ text });
    const url = `${AUTO_COMPLETE_API}input=${text}&type=geocode&language=en&key=${API_KEY}`;
    fetch(url)
      .then(res => res.json())
      .then((res) => {
        this.setState({ 
          predictions: this.ds.cloneWithRows(res.predictions),
          isOpen: res.predictions.length > 0,
          placeId: res.predictions.length > 0 ? res.predictions[0].place_id : ''
        });
      })
      .catch(err => console.error(err));
  }

  fetchJourneyList(placeId) {
    const url = `${JOURNEY_LIST_API}spots=${placeId}&start=30&fuzzy=true&months=1,2,3,4,5,6,7,8,9,10,11,12&day=any`;
    fetch(url)
      .then(res => res.json())
      .then((res) => {
        this.setState({
          journeys: res.journeys
        });
      })
      .catch(err => console.error(err));
  }

  onPressPrediction(prediction) {
    this.setState({
      text: prediction.description,
      placeId: prediction.place_id,
      isOpen: false
    });
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight onPress={() => this.onPressPrediction(rowData)}>
        <Text style={{ margin: 10 }}>
          {rowData.description}
        </Text>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Tabitsunagi!
        </Text>
        <Text style={styles.instructions}>
          To get started, enter your destination
        </Text>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center'
        }}>
          <View style={{ flex: 4 }}>
            <TextInput
              style={{
                height: 40,
              }}
              value={this.state.text}
              placeholder="Taipei 101, Tokyo...."
              onChangeText={this.fetchPredictions}
            />
            {
              this.state.isOpen ?
                <View style={{
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: '#841584'
                }}>
                  <ListView
                    dataSource={this.state.predictions}
                    renderRow={this.renderRow}
                  />
                </View> : null
            }
          </View>
          <View style={{ height: 40, flex: 1 }}>
            <Button
              onPress={this.onSearch}
              title="Search"
              color="#841584"
            />
          </View>
        </View>
        <JourneyList journeys={this.state.journeys} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('tabitsunagi', () => tabitsunagi);
