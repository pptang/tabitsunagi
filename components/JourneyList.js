import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  ListView,
  TouchableHighlight
} from 'react-native';

const JOURNEY_API = 'https://tabitsunagi.com/journey/';
export default class JourneyList extends Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  onPressJourney(journey) {
    this.fetchJourney(journey.id);
  }

  fetchJourney(id) {
    const url = `${JOURNEY_API}${id}`;
    fetch(url)
      .then(res => res.json())
      .then((res) => {
        Alert.alert(res.journey.journeySpots[0].title);
      })
      .catch(err => console.error(err));
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight onPress={() => this.onPressJourney(rowData)}>
        <Text style={{ margin: 10 }}>
          {rowData.title}
        </Text>
      </TouchableHighlight>
    );
  }

  render() {
    const { journeys } = this.props;

    return (
      <View>
        <ListView
          dataSource={this.ds.cloneWithRows(journeys)}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}