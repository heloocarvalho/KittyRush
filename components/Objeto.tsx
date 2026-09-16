import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ASSETS } from '../assets';

export default function Objeto({kind,x,y}:{kind:'poca'|'pedra'|'tronco';x:number;y:number}) {
  return (
    <View style={[styles.wrap,{left:x,top:y}]}>
      <Image source={ASSETS[kind]} style={styles.img} resizeMode="contain" />
    </View>
  );
}
const styles=StyleSheet.create({
  wrap:{position:'absolute',width:72,height:55,zIndex:4},
  img:{width:'100%',height:'100%'}
});
