// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React, { Component } from 'react';
import { Image, View, Text, TextInput, Switch, SectionList, Modal, TouchableOpacity, Picker } from 'react-native';

import Data from 'appcenter-data';

import SharedStyles from '../SharedStyles';
import DataTabBarIcon from '../assets/data.png';

export default class DataScreen extends Component {
  static navigationOptions = {
    tabBarIcon: () => <Image style={{ width: 24, height: 24 }} source={DataTabBarIcon} />,
    tabBarOnPress: ({ defaultHandler, navigation }) => {
      // Allow consequent presses to refresh the screen.
      const refreshScreen = navigation.getParam('refreshData');
      if (refreshScreen) {
        refreshScreen();
      }
      defaultHandler();
    }
  }

  // Screen's state.
  state = {
    dataEnabled: false,
    createDocModalVisible: false,
    docTtl: 60,
    docId: "",
    docType: "",
    docKey: "",
    docValue: "",
  }

  async componentDidMount() {
    // Sync the module toggle.
    await this.refreshToggle();

    // Add a way to refresh the screen when the tab is pressed.
    this.props.navigation.setParams({
      refreshScreen: this.refreshToggle.bind(this)
    });
  }

  async refreshToggle() {
    const dataEnabled = await Data.isEnabled();
    this.setState({ dataEnabled });
  }

  setCreateDocModalVisible(visible) {
    this.setState({createDocModalVisible: visible});
  }

  render() {
    const switchRenderItem = ({ item: { title, value, toggle } }) => (
      <View style={SharedStyles.item}>
        <Text style={SharedStyles.itemTitle}>{title}</Text>
        <Switch value={this.state[value]} onValueChange={toggle} />
      </View>
    );

    const DocTtlRenderItem = ({ item: { title, value, toggle } }) => (
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <View style={{flex:.25}}>
          <Text style={SharedStyles.itemTitle}>{title}</Text>
        </View>
        <View style={{flex:.75}}>
          <Picker
            selectedValue={this.state.docTtl}
            style={{flex:1}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({docTtl: itemValue})
            }>
            <Picker.Item label="Default" value="60" />
            <Picker.Item label="No Cache" value="0" />
            <Picker.Item label="2 seconds" value="2" />
            <Picker.Item label="Infinite" value="-1" />
          </Picker>
        </View>
      </View>
    );

    const DocTypeRenderItem = ({ item: { title, value, toggle } }) => (
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <View style={{flex:.25}}>
          <Text style={SharedStyles.itemTitle}>{title}</Text>
        </View>
        <View style={{flex:.75}}>
          <Picker
            selectedValue={this.state.docType}
            style={{flex:1}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({docType: itemValue})
            }>
            <Picker.Item label="String" value="string" />
            <Picker.Item label="Boolean" value="bool" />
            <Picker.Item label="Long" value="long" />
            <Picker.Item label="Double" value="double" />
            <Picker.Item label="Datetime" value="datetime" />
          </Picker>
        </View>
      </View>
    );

    const DocIdRenderItem = ({ item: { title, value, toggle } }) => (
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <View style={{flex:.25}}>
          <Text style={SharedStyles.itemTitle}>{title}</Text>
        </View>
        <View style={{flex:.75}}>
          <TextInput
              onChangeText={(docId) => this.setState({docId})}
              value={this.state.docId}
            />
        </View>
      </View>
    );

    const DocValueRenderItem = ({ item: { title, value, toggle } }) => (
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <View style={{flex:.25}}>
          <Text style={SharedStyles.itemTitle}>{title}</Text>
        </View>
        <View style={{flex:.75}}>
          <TextInput
              onChangeText={(docValue) => this.setState({docValue})}
              value={this.state.docValue}
            />
        </View>
      </View>
    );

    const DocKeyRenderItem = ({ item: { title, value, toggle } }) => (
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <View style={{flex:.25}}>
          <Text style={SharedStyles.itemTitle}>{title}</Text>
        </View>
        <View style={{flex:.75}}>
          <TextInput
              onChangeText={(docKey) => this.setState({docKey})}
              value={this.state.docKey}
            />
        </View>
      </View>
    );

   const actionRenderItem = ({ item: { title, action } }) => (
      <TouchableOpacity style={SharedStyles.item} onPress={action}>
        <Text style={SharedStyles.itemButton}>{title}</Text>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.createDocModalVisible}>
          <View style={{marginTop: 22}}>
              <SectionList
                renderItem={({ item }) => <Text style={[SharedStyles.item, SharedStyles.itemTitle]}>{item}</Text>}
                keyExtractor={(item, index) => item + index}
                sections={[
                  {
                    data: [
                      {
                        title: 'Time to Live',
                        value: 'docTtl'
                      },
                    ],
                    renderItem: DocTtlRenderItem
                  },
                  {
                    data: [
                      {
                        title: 'ID',
                        value: 'docId'
                      },
                    ],
                    renderItem: DocIdRenderItem
                  },
                  {
                    data: [
                      {
                        title: 'Key',
                        value: 'docKey'
                      },
                    ],
                    renderItem: DocKeyRenderItem
                  },
                  {
                    data: [
                      {
                        title: 'Type',
                        value: 'docType'
                      },
                    ],
                    renderItem: DocTypeRenderItem
                  },
                  {
                    data: [
                      {
                        title: 'Value',
                        value: 'docValue'
                      },
                    ],
                    renderItem: DocValueRenderItem
                  },
                ]}
              />
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <View style={{flex:.5}}>
                <TouchableOpacity
                  onPress={async () => {
                    // TODO: remove this before merging. For testing ONLY!
                    Data.setTokenExchangeUrl("https://token-exchange-mbaas-integration.dev.avalanch.es/v0.1");
                    const createResult = 
                            await Data.create(
                              this.state.docId, 
                              this.state.value, 
                              Data.DefaultPartitions.USER_DOCUMENTS, 
                              new Data.WriteOptions(this.state.docTtl));
                    console.log('Successful create', createResult);
                    this.setCreateDocModalVisible(!this.state.createDocModalVisible);
                  }}>
                  <Text style={[SharedStyles.itemButton]}>Create</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex:.5}}>
                <TouchableOpacity
                    onPress={() => {
                      this.setCreateDocModalVisible(!this.state.createDocModalVisible);
                    }}>
                    <Text style={[SharedStyles.itemButton]}>Cancel</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
    );

    return (
      <View style={SharedStyles.container}>
        <SectionList
          renderItem={({ item }) => <Text style={[SharedStyles.item, SharedStyles.itemTitle]}>{item}</Text>}
          renderSectionHeader={({ section: { title } }) => <Text style={SharedStyles.header}>{title}</Text>}
          keyExtractor={(item, index) => item + index}
          sections={[
            {
              title: 'Settings',
              data: [
                {
                  title: 'Data Enabled',
                  value: 'dataEnabled',
                  toggle: async () => {
                    await Data.setEnabled(!this.state.dataEnabled);
                    const dataEnabled = await Data.isEnabled();
                    this.setState({ dataEnabled });
                  }
                },
              ],
              renderItem: switchRenderItem
            },
            {
              title: 'Actions',
              data: [
                {
                  title: 'Create a new document',
                  value: 'createNewDocument',
                  action: () => {
                    this.setCreateDocModalVisible(true);
                  }
                },
              ],
              renderItem: actionRenderItem
            },
          ]}
        />
      </View>
    );
  }
}