import axios from "axios";
import { AIO_USERNAME, AIO_KEY, FEED_NAME } from "../config/adafruitConfig";


const api = axios.create({
  baseURL: "https://io.adafruit.com/api/v2/" + AIO_USERNAME + "/feeds/",
  headers: {
    "X-AIO-Key": AIO_KEY,
    "Content-Type": "application/json",
  },
});

// Busca o último valor registrado no feed de temperatura
function getUltimaTemperatura() {
  return api.get(FEED_NAME + "/data/last");
}

// Envia um novo valor de temperatura para o feed
function postTemperatura(valor) {
  return api.post(FEED_NAME + "/data", { value: String(valor) });
}

// Objeto para garantir compatibilidade se alguém usar export default
const adafruit = {
  getUltimaTemperatura: getUltimaTemperatura,
  postTemperatura: postTemperatura,
};

export default adafruit;
export { getUltimaTemperatura, postTemperatura };