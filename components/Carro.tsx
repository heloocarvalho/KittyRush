import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ASSETS } from '../assets';

export default function Carro({kind,x,y,jumping}:{kind:'kitty'|'kuromi';x:number;y:number;jumping:boolean}) {
  return (
    <View style={[styles.wrap,{left:x,top:y},jumping&&styles.jump]}>
      <Image source={ASSETS[kind==='kitty'?'kittycar':'kuromicar']} style={styles.car} resizeMode="contain" />
    </View>
  );
}
const styles=StyleSheet.create({
  wrap:{position:'absolute',width:160,height:100,zIndex:10},
  car:{width:'100%',height:'100%'},
  jump:{transform:[{translateY:-54},{rotate:'-3deg'}]}
});
