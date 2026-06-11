const BASE_URL = 'http://localhost:8000';
const ENABLE_GET_MOCK = false;
const mockApi = window.AtendimentoApiMock || {};

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
  if (ENABLE_GET_MOCK) {
    const mockFila = mockApi.fila || { total: 0, clientes: [] };
    return {
      ...mockFila,
      clientes: [...(mockFila.clientes || [])]
    };
  }

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

async function chamarProximo() {
  const response = await fetch(`${BASE_URL}/fila/chamar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return parseResponse(response, 'Erro ao chamar próximo da fila.');
}

async function cancelarCliente(clienteId) {
  const response = await fetch(`${BASE_URL}/clientes/${clienteId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return parseResponse(response, 'Erro ao cancelar cliente.');
}

async function concluirAtendimento(clienteId) {
  const response = await fetch(`${BASE_URL}/atendimentos/${clienteId}/concluir`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return parseResponse(response, 'Erro ao concluir atendimento.');
}

async function getHistorico(filtros = '') {
  if (ENABLE_GET_MOCK) {
    const mockHistorico = mockApi.historico || { total: 0, clientes: [] };
    const applyFilters =
      typeof mockApi.applyHistoricoFilters === 'function'
        ? mockApi.applyHistoricoFilters
        : (clientes) => clientes;

    const clientesFiltrados = applyFilters(mockHistorico.clientes || [], filtros);
    return {
      total: clientesFiltrados.length,
      clientes: clientesFiltrados
    };
  }

  const query = typeof filtros === 'string' ? filtros : '';
  const response = await fetch(`${BASE_URL}/historico${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return parseResponse(response, 'Erro ao buscar histórico.');
}

window.AtendimentoApi = {
  getFila,
  cadastrarCliente,
  chamarProximo,
  cancelarCliente,
  concluirAtendimento,
  getHistorico
};
