import React from 'react'
import { View,Text,StyleSheet } from 'react-native'

export default function TeamDetails({route}) {
  const { teamName } = route.params;
  return (
    <View style={styles.container}>
        <Text style={{fontWeight:'bold'}}>{teamName}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
  },
})