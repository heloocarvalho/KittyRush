import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ASSETS } from '../assets';
import { META } from '../jogo/regras';

export default function Barra({
  player,
  rival,
  compact,
}: {
  player: number;
  rival: number;
  compact?: boolean;
}) {
  const p = Math.min(1, player / META);
  const r = Math.min(1, rival / META);

  return (
    <View style={[styles.wrap, compact && styles.compact]}>
      
      <View style={styles.top}>
        <Text style={styles.label}>PROGRESSO</Text>
      </View>

      <View style={styles.track}>

        {/* PROGRESSO DO JOGADOR */}
        <View
          style={[
            styles.line,
            {
              width: `${Math.max(2, p * 100)}%`,
            },
          ]}
        />

        {/* ÍCONE DA KITTY */}
        <Image
          source={ASSETS.kitty}
          style={[
            styles.marker,
            {
              left: `${p * 100}%`,
            },
          ]}
          resizeMode="contain"
        />

        {/* ÍCONE DA KUROMI */}
        <Image
          source={ASSETS.kuromi}
          style={[
            styles.marker,
            {
              left: `${r * 100}%`,
            },
          ]}
          resizeMode="contain"
        />

        {/* CHEGADA */}
        <View style={styles.flag}>
          <Text style={styles.flagText}>🏁</Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '55%',
    maxWidth: 620,
  },

  compact: {
    width: '48%',
  },

  top: {
    alignItems: 'center',
  },

  label: {
    fontSize: 9,
    fontWeight: '900',
    color: '#70465b',
    marginBottom: 3,
  },

  track: {
    height: 18,
    borderRadius: 10,
    backgroundColor: '#f5dff0',
    borderWidth: 2,
    borderColor: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
  },

  line: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#ef9fbd',
    borderRadius: 8,
  },

  marker: {
    position: 'absolute',
    top: -7,
    width: 28,
    height: 28,
    marginLeft: -14,
  },

  flag: {
    position: 'absolute',
    right: 1,
    top: -5,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  flagText: {
    fontSize: 18,
  },
});