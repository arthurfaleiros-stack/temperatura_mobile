import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getUltimaTemperatura } from "../services/api";

// Valor máximo de temperatura antes de entrar em ALERTA
const TEMPERATURA_LIMITE = 20.0;

export default function HomeScreen() {

  // Guarda o valor atual da temperatura (começa como null)
  const [temperatura, setTemperatura] = useState(null);

  // Guarda o status atual: "Aguardando...", "NORMAL" ou "ALERTA"
  const [status, setStatus] = useState("Aguardando...");

  // Guarda a mensagem de erro caso a requisição falhe
  const [erro, setErro] = useState(null);

  // Define a cor do badge: vermelho para alerta, verde para normal
  let corStatus = "#2ECC71"; // verde por padrão
  if (status === "ALERTA" || status === "ALERTA!!!") {
    corStatus = "#E74C3C"; // vermelho
  }

  // Atualiza o valor e define o status de acordo com a regra
  function atualizarTemperatura(valor) {
    setTemperatura(valor);

    if (valor > TEMPERATURA_LIMITE) {
      setStatus("ALERTA");
    } else {
      setStatus("NORMAL");
    }
  }

  // Busca a temperatura no feed do Adafruit IO
  async function buscarTemperatura() {
    try {
      const resposta = await getUltimaTemperatura();

      // Converte o valor retornado para número decimal
      const valor = parseFloat(resposta.data.value);

      setErro(null); // limpa qualquer erro anterior
      atualizarTemperatura(valor);

    } catch (error) {
      console.log("Erro ao buscar temperatura:", error);
      setErro("Não foi possível buscar a temperatura.");
    }
  }

  // Executa uma vez ao abrir a tela
  useEffect(function () {

    // Busca imediatamente
    buscarTemperatura();

    // Continua buscando a cada 3 segundos (3000ms)
    const intervalo = setInterval(buscarTemperatura, 3000);

    // Cancela o intervalo quando o componente for desmontado
    return function () {
      clearInterval(intervalo);
    };

  }, []);

  // Formata o texto da temperatura para exibição
  let textoTemperatura = "Carregando...";
  if (temperatura != null) {
    textoTemperatura = temperatura.toFixed(2) + "°C";
  }

  return (
    <View style={styles.container}>

      {/* Título da tela */}
      <Text style={styles.titulo}>Monitor de Temperatura</Text>

      {/* Mensagem de erro caso a API falhe */}
      {erro != null && (
        <Text style={styles.erro}>{erro}</Text>
      )}

      {/* Exibição da temperatura */}
      <Text style={styles.temperatura}>{textoTemperatura}</Text>

      {/* Badge com o status (NORMAL / ALERTA) */}
      <View style={[styles.statusBox, { backgroundColor: corStatus }]}>
        <Text style={styles.statusTexto}>{status}</Text>
      </View>

      {/* Mensagem em destaque quando atingir o limite de temperatura */}
      {status === "ALERTA" && (
        <Text style={styles.avisoAlerta}>
          ⚠️ Temperatura acima do limite de {TEMPERATURA_LIMITE}°C!
        </Text>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  temperatura: {
    fontSize: 48,
    marginBottom: 20,
    color: "#2C3E50",
  },
  statusBox: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 12,
  },
  statusTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  avisoAlerta: {
    color: "#E74C3C",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 6,
    textAlign: "center",
  },
  erro: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});