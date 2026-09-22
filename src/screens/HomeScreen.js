import { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
} from "react-native";
import { getUltimaTemperatura } from "../services/api";

const TEMPERATURA_LIMITE = 20.0;

export default function HomeScreen({ setTela }) {
  
  const [temperatura, setTemperatura] = useState(null);

 
  const [status, setStatus] = useState("Aguardando...");

  
  const [erro, setErro] = useState(null);

  
  const [historico, setHistorico] = useState([]);

  
  useEffect(() => {
    if (temperatura === null) return;

    setHistorico((antigas) => {
      
      if (antigas[0] !== temperatura) {
        return [temperatura, ...antigas];
      }
      return antigas;
    });
  }, [temperatura]);

  
  async function buscarTemperatura() {
    try {
      const resposta = await getUltimaTemperatura();
      const valor = parseFloat(resposta.data.value);

      setErro(null);
      setTemperatura(valor);

      if (valor > TEMPERATURA_LIMITE) {
        setStatus("ALERTA");
      } else {
        setStatus("NORMAL");
      }
    } catch (error) {
      console.log("Erro ao buscar temperatura:", error);
      setErro("Não foi possível buscar a temperatura.");
    }
  }


  useEffect(() => {
    buscarTemperatura();
    const intervalo = setInterval(buscarTemperatura, 3000);

    return () => clearInterval(intervalo);
  }, []);

  
  const corStatus = status === "ALERTA" ? "#E74C3C" : "#2ECC71";

  
  const textoTemperatura = temperatura != null ? temperatura.toFixed(2) + "°C" : "Carregando...";

  
  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Monitor de Temperatura</Text>

      {erro != null && <Text style={styles.erro}>{erro}</Text>}

      <Text style={styles.temperatura}>{textoTemperatura}</Text>

      <View style={[styles.statusBox, { backgroundColor: corStatus }]}>
        <Text style={styles.statusTexto}>{status}</Text>
      </View>

     
      {status === "ALERTA" && (
        <Text style={styles.avisoAlerta}>
           Temperatura acima do limite de {TEMPERATURA_LIMITE}°C!
        </Text>
      )}

      {/* Botão no centro para registrar nova temperatura */}
      <View style={styles.areaBotaoCentro}>
        <Button
          title="Registrar Nova Temperatura"
          onPress={function () {
            if (setTela) {
              setTela("update");
            }
          }}
          color="#3498DB"
        />
      </View>

      
      <Text style={styles.subtitulo}>Histórico de Temperaturas:</Text>

      
      <FlatList
        style={styles.lista}
        data={historico}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemHistorico}>
            <Text style={styles.itemTexto}>{item.toFixed(2)}°C</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vazioTexto}>Nenhuma temperatura no histórico.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2C3E50",
  },
  temperatura: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#2C3E50",
  },
  statusBox: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginBottom: 10,
  },
  statusTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  avisoAlerta: {
    color: "#E74C3C",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  erro: {
    color: "#E74C3C",
    marginBottom: 10,
    textAlign: "center",
  },
  areaBotaoCentro: {
    marginVertical: 16,
    width: 240,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#34495E",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  lista: {
    width: "100%",
  },
  itemHistorico: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  itemTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  vazioTexto: {
    fontSize: 14,
    color: "#95A5A6",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
});