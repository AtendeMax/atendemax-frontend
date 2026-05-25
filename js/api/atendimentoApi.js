/**
 * atendimentoApi.js
 * Camada de comunicação com a API de atendimentos.
 * Todas as chamadas HTTP ficam centralizadas aqui.
 */

const BASE_URL = 'http://localhost:3000/api';

export async function getFila() {
  const response = await fetch(`${BASE_URL}/fila`);
  if (!response.ok) throw new Error('Erro ao buscar fila de atendimento.');
  return response.json();
}
