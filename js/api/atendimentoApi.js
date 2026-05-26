const BASE_URL = 'http://127.0.0.1:8000';

async function parseResponse(response, fallbackMessage) {
  if (response.ok) {
    return response.status === 204 ? null : response.json();
  }

  let message = fallbackMessage;
  try {
    const data = await response.json();
    if (data?.detail) {
      message = Array.isArray(data.detail)
        ? data.detail.map((item) => item.msg || String(item)).join(', ')
        : String(data.detail);
    } else if (data?.message) {
      message = data.message;
    }
  } catch {}

  throw new Error(message);
}

async function getFila() {
  const response = await fetch(`${BASE_URL}/fila`);
  return parseResponse(response, 'Erro ao buscar fila de atendimento.');
}

async function cadastrarCliente(payload) {
  const response = await fetch(`${BASE_URL}/clientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return parseResponse(response, 'Erro ao cadastrar cliente.');
}

window.AtendimentoApi = {
  getFila,
  cadastrarCliente
};
