// services/saude.js
import axios from "axios";

// const API_URL = import.meta.env.VITE_DEV_API; 
const API_URL = import.meta.env.VITE_PROD_API; 

export async function enviarSintomas(dados) {
  try {
    const response = await axios.post(`${API_URL}/principal`, dados, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erro ao enviar sintomas." };
  }
}
export async function finalizarAtendimento(dados) {
  try {
    const response = await axios.post(`${API_URL}/finalizar`, dados, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erro ao finalizar atendimento." };
  }
}
