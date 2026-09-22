import { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/screens/HomeScreen";
import UpdateTemp from "./src/screens/UpdateTemp";

export default function App() {

  
  const [tela, setTela] = useState("home");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Mantemos a tela principal montada para preservar o estado do histórico */}
      <View style={[styles.areaCentral, tela !== "home" && styles.telaOculta]}>
        <HomeScreen setTela={setTela} />
      </View>

      {tela === "update" && (
        <UpdateTemp setTela={setTela} />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  areaCentral: {
    flex: 1,
    width: "100%",
  },
  telaOculta: {
    display: "none",
  },
});
