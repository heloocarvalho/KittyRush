import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';

type Personagem = 'kitty' | 'kuromi';

export default function Escolha() {
  const [selected, setSelected] = useState<Personagem>('kitty');
  const { width } = useWindowDimensions();

  const pequeno = width < 900;

  const kittyRosto = require('../assets/kitty.png');
  const kuromiRosto = require('../assets/kuromi.png');

  const kittyInteira = require('../assets/kittyfull.png');
  const kuromiInteira = require('../assets/kuromifull.png');

  function continuar() {
    router.push({
      pathname: '/corrida',
      params: {
        personagem: selected,
      },
    });
  }

  return (
    <ImageBackground
      source={require('../assets/fundo.png')}
      style={styles.tela}
      resizeMode="cover"
    >

      {/* TÍTULO */}
      <View style={styles.titulo}>
        <Text style={styles.tituloPequeno}>
          ESCOLHA SUA
        </Text>

        <Text style={styles.tituloGrande}>
          PERSONAGEM
        </Text>
      </View>

      {/* PERSONAGENS + CARDS */}
      <View
        style={[
          styles.area,
          pequeno && styles.areaPequena,
        ]}
      >

        {/* KITTY INTEIRA */}
        <Image
          source={kittyInteira}
          style={[
            styles.personagem,
            styles.kittyFull,
          ]}
          resizeMode="contain"
        />

        {/* CARD KITTY */}
        <Pressable
          onPress={() => setSelected('kitty')}
          style={[
            styles.card,
            selected === 'kitty' && styles.cardSelecionadoKitty,
          ]}
        >
          <View style={styles.areaRosto}>
            <Image
              source={kittyRosto}
              style={styles.rosto}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.nome}>
            HELLO KITTY
          </Text>

          {selected === 'kitty' && (
            <Text style={styles.escolhida}>
              ✓ ESCOLHIDA
            </Text>
          )}
        </Pressable>

        {/* CARD KUROMI */}
        <Pressable
          onPress={() => setSelected('kuromi')}
          style={[
            styles.card,
            selected === 'kuromi' && styles.cardSelecionadoKuromi,
          ]}
        >
          <View style={styles.areaRosto}>
            <Image
              source={kuromiRosto}
              style={styles.rosto}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.nome}>
            KUROMI
          </Text>

          {selected === 'kuromi' && (
            <Text style={styles.escolhida}>
              ✓ ESCOLHIDA
            </Text>
          )}
        </Pressable>

        {/* KUROMI INTEIRA */}
        <Image
          source={kuromiInteira}
          style={[
            styles.personagem,
            styles.kuromiFull,
          ]}
          resizeMode="contain"
        />

      </View>

      {/* BOTÃO CORRER */}
      <Pressable
        onPress={continuar}
        style={({ pressed }) => [
          styles.botao,
          pressed && styles.botaoPressionado,
        ]}
      >
        <Text style={styles.textoBotao}>
          CORRER!
        </Text>
      </Pressable>

      {/* VOLTAR */}
      <Pressable
        onPress={() => router.back()}
        style={styles.voltar}
      >
        <Text style={styles.textoVoltar}>
          VOLTAR
        </Text>
      </Pressable>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  titulo: {
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 5,
  },

  tituloPequeno: {
    fontSize: 13,
    fontWeight: '900',
    color: '#75485B',
    letterSpacing: 2,
    marginBottom: 3,
  },

  tituloGrande: {
    fontSize: 40,
    fontWeight: '900',
    color: '#E83F68',
    textShadowColor: '#FFFFFF',
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 0,
  },

  area: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    zIndex: 5,
  },

  areaPequena: {
    transform: [{ scale: 0.82 }],
  },

  personagem: {
    width: 120,
    height: 210,
  },

  kittyFull: {
    marginRight: -4,
  },

  kuromiFull: {
    marginLeft: -4,
  },

  card: {
    width: 205,
    height: 225,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,

    shadowColor: '#654655',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  cardSelecionadoKitty: {
    borderColor: '#EF7099',
    backgroundColor: '#FFF1F6',
    transform: [{ scale: 1.03 }],
  },

  cardSelecionadoKuromi: {
    borderColor: '#8B6AC8',
    backgroundColor: '#F5F0FF',
    transform: [{ scale: 1.03 }],
  },

  areaRosto: {
    width: 150,
    height: 135,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  rosto: {
    width: 130,
    height: 120,
  },

  nome: {
    marginTop: 8,
    fontSize: 17,
    fontWeight: '900',
    color: '#633B4D',
  },

  escolhida: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '900',
    color: '#E34F79',
  },

  botao: {
    marginTop: 15,
    backgroundColor: '#EF88AA',
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#9F4D6A',
    paddingVertical: 10,
    paddingHorizontal: 38,
    zIndex: 5,
  },

  botaoPressionado: {
    transform: [{ scale: 0.96 }],
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
  },

  voltar: {
    marginTop: 6,
    padding: 6,
    zIndex: 5,
  },

  textoVoltar: {
    color: '#744B5C',
    fontSize: 11,
    fontWeight: '900',
  },
});