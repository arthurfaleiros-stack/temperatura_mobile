import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { postTemperatura } from "../services/api";

// UpdateTemp recebe o setTela do App.js para poder voltar para a Home
export default function UpdateTemp({ setTela }) {

  // Guarda o texto digitado pelo usuário no campo
  const [valorDigitado, setValorDigitado] = useState("");

  // Controla se a requisição está em andamento (true = enviando)
  const [enviando, setEnviando] = useState(false);

  // Guarda mensagem de erro para exibir na tela caso a API falhe
  const [mensagemErro, setMensagemErro] = useState(null);

  // Função chamada ao clicar no botão "Enviar"
  async function handleEnviar() {

    // Converte vírgula para ponto e transforma em número decimal
    const valor = parseFloat(valorDigitado.replace(",", "."));

    // Validação: impede o envio se o campo estiver vazio ou não for número
    if (valorDigitado.trim() === "" || isNaN(valor)) {
      Alert.alert("Valor inválido", "Digite um número válido. Ex: 25.5");
      return;
    }

    // Ativa o indicador de carregamento e limpa erro anterior
    setEnviando(true);
    setMensagemErro(null);

    try {
      // Envia o novo valor para o Adafruit IO
      await postTemperatura(valor);
      console.log("Temperatura enviada com sucesso:", valor);

      // Limpa o campo digitado
      setValorDigitado("");

      
      setTela("home");

    } catch (error) {
      console.log("Erro ao enviar temperatura:", error);
      setMensagemErro("Erro ao enviar. Verifique sua conexão e tente novamente.");
    }

    setEnviando(false);
  }

  function handleVoltar() {
    setValorDigitado("");
    setMensagemErro(null);
    setTela("home");
  }

  return (
    <View style={styles.container}>

      
      <Text style={styles.titulo}>Atualizar Temperatura</Text>

      <Text style={styles.label}>Digite a nova temperatura (°C):</Text>

      <TextInput
        style={styles.input}
        value={valorDigitado}
        onChangeText={setValorDigitado}
        placeholder="Ex: 25.5"
        keyboardType="numeric"
      />

      
      {enviando === true && (
        <ActivityIndicator size="large" color="#2ECC71" style={styles.loading} />
      )}

      
      {enviando === false && (
        <View style={styles.botaoWrapper}>
          <Button
            title="Enviar"
            onPress={handleEnviar}
            color="#2ECC71"
          />
        </View>
      )}

      {/* Mensagem de erro caso a API falhe */}
      {mensagemErro != null && (
        <Text style={styles.erro}>{mensagemErro}</Text>
      )}

      {/* Botão para voltar à tela principal */}
      <View style={styles.areaVoltar}>
        <Button
          title="Voltar"
          onPress={handleVoltar}
          color="#999"
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 24,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    fontSize: 18,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  botaoWrapper: {
    width: "100%",
  },
  loading: {
    marginVertical: 8,
  },
  erro: {
    color: "red",
    marginTop: 12,
    textAlign: "center",
  },
  areaVoltar: {
    marginTop: 20,
    width: "100%",
  },
});
