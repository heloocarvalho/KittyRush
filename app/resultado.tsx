import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ASSETS } from '../assets';

export default function Resultado() {
  const params = useLocalSearchParams<{venceu?:string; player?:string}>();
  const venceu = params.venceu === '1';
  const player = params.player === 'kuromi' ? 'kuromi' : 'kitty';

  return (
    <View style={styles.screen}>
      <Image source={ASSETS.fundo} style={styles.bg} resizeMode="cover" />
      <View style={styles.card}>
        <Image source={ASSETS[player==='kitty'?'kittycar':'kuromicar']} style={styles.car} resizeMode="contain" />
        <Text style={styles.emoji}>{venceu ? '🏆' : '💗'}</Text>
        <Text style={styles.title}>{venceu ? 'VOCÊ VENCEU!' : 'VOCÊ PERDEU!'}</Text>
        <Text style={styles.text}>{venceu ? 'Você chegou primeiro à linha de chegada!' : 'A rival chegou primeiro. Tente de novo!'}</Text>

        <Pressable onPress={() => router.replace('/escolha')} style={styles.button}>
          <Text style={styles.buttonText}>JOGAR NOVAMENTE</Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/')} style={styles.home}>
          <Text style={styles.homeText}>TELA INICIAL</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles=StyleSheet.create({
  screen:{flex:1,backgroundColor:'#a6ddf0',alignItems:'center',justifyContent:'center',overflow:'hidden'},
  bg:{position:'absolute',width:'100%',height:'100%'},
  card:{width:'90%',maxWidth:520,backgroundColor:'rgba(255,255,255,.94)',borderRadius:32,borderWidth:4,borderColor:'#fff',padding:22,alignItems:'center',shadowColor:'#75485c',shadowOpacity:.22,shadowRadius:15,elevation:8},
  car:{width:190,height:100},
  emoji:{fontSize:42,marginTop:-6},
  title:{fontSize:36,fontWeight:'900',color:'#e64068',textAlign:'center',textShadowColor:'#fff',textShadowOffset:{width:2,height:2},textShadowRadius:0},
  text:{fontSize:14,fontWeight:'700',color:'#69495a',textAlign:'center',marginTop:7},
  button:{marginTop:20,backgroundColor:'#ef89aa',borderRadius:24,borderWidth:3,borderColor:'#a84d6d',paddingVertical:11,paddingHorizontal:28},
  buttonText:{color:'#fff',fontWeight:'900',fontSize:16},
  home:{padding:8,marginTop:5},homeText:{color:'#755064',fontWeight:'800',fontSize:11}
});
