import React, { Component } from 'react';
import {
  View,
  Text,
  ListView,
  TouchableHighlight,
  Image
} from 'react-native';

import { JOURNEY_SCHEDULE_API } from '../utils/constants';
import Separator from './ListViewSeparator';

export default class JourneyList extends Component {
  constructor(props) {
    super(props);
    this.renderJourney = this.renderJourney.bind(this);
    this.fetchJourneySchedule = this.fetchJourneySchedule.bind(this);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  onPressJourney(journey) {
    this.fetchJourneySchedule(journey.id);
  }

  fetchJourneySchedule(journeyId) {
    const url = `${JOURNEY_SCHEDULE_API}${journeyId}`;
    fetch(url)
      .then(res => res.json())
      .then((res) => {
        this.props.navigate('JourneySchedule', {
          title: res.journey.title,
          journey: res.journey
        });
      })
      .catch(err => console.error(err));
  }

  renderJourney(journey) {
    return (
      <TouchableHighlight onPress={() => this.onPressJourney(journey)}
        underlayColor='#009688'>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Image source={{ uri: journey.picture }}
            style={{ width: 75, height: 75 }}/>
          <Text style={{ margin: 10 }}>
            {journey.title}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const { journeys } = this.props;

    return (
      <View>
        <ListView
          dataSource={this.ds.cloneWithRows(journeys)}
          renderRow={this.renderJourney}
          renderSeparator={Separator}
          enableEmptySections={true}
        />
      </View>
    );
  }
}
