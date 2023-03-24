import React from 'react'
import { View,Text,StyleSheet } from 'react-native'

export default function TeamDetails() {
  return (
    <View style={styles.container}>
        <Text style={{fontSize:30,fontWeight:'bold',}}>Team Details</Text>
        <Text style={{fontWeight:'bold'}}>Comming soon</Text>
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