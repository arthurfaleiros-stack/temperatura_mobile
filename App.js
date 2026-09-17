import { useState } from "react";
import { View, Button, StyleSheet, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/screens/HomeScreen";
import UpdateTemp from "./src/screens/UpdateTemp";

export default function App() {

  
  const [tela, setTela] = useState("home");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {tela === "home" ? (
        <View style={styles.areaCentral}>
         
          <HomeScreen />

          
          <View style={styles.areaBotao}>
            <Button
              title="Atualizar Temperatura"
              onPress={function () { setTela("update"); }}
              color="#3498DB"
            />
          </View>
        </View>
      ) : (
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
    alignItems: "center",
    justifyContent: "center",
  },
  
  areaBotao: {
    marginTop: 24,
    width: 240,
  },
});
