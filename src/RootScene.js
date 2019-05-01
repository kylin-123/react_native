import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'

const data = []

for (let i = 0; i < 1000; i++) {
  data.push({ key: `Julie-${i}` })
}

export default class FlatListBasics extends Component {
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
})
