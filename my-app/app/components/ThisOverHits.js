import React,  from 'react';
import { View, Text } from 'react-native';

export default function ThisOverHits(props) {
  const dotArray = new Array(6 - props.scores.length).fill('·');
  const displayArray = [...props.scores, ...dotArray];

  return (
    <View style={{ 
      flexDirection: 'row',
      justifyContent: 'center',
      marginLeft: 25,
      marginTop: 30,
      marginRight: 25,
      marginBottom: 20,
    }}>
      <View >
        <Text 
          style={{color:'#666666', fontSize: 22, fontWeight: '900' }}>
          {
            displayArray.map((item, index) =>
            <Text key={index}>{item}{'     '}</Text> )
          }
        </Text>
      </View>
    </View>
  );
}