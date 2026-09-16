import { router } from "expo-router";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Inicio() {
  return (
    <ImageBackground
      source={require("../assets/capa.png")}
      style={styles.tela}
      resizeMode="cover"
    >
      <View style={styles.conteudo}>
        <Pressable style={styles.botao} onPress={() => router.push("/escolha")}>
          <Text style={styles.texto}>PLAY</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  conteudo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 340,
  },

  botao: {
    backgroundColor: "#FF6FA8",
    paddingVertical: 15,
    paddingHorizontal: 55,
    borderRadius: 30,

    borderWidth: 3,
    borderColor: "#FFFFFF",

    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  texto: {
    fontSize: 27,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});
