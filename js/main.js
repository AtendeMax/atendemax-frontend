const atendimentoApi = window.AtendimentoApi;

const app = document.getElementById('app');

if (!app) {
  throw new Error('Elemento principal da aplicacao nao foi encontrado.');
}

if (!atendimentoApi?.cadastrarCliente || !atendimentoApi?.getFila) {
  throw new Error('API de atendimento nao foi carregada corretamente.');
}

app.innerHTML = `
  <section class="layout-grid" aria-label="Cadastro e fila de espera">
    <article class="panel card">
      <h2>Cadastrar cliente</h2>
      <form id="cliente-form" class="form-grid">
        <label for="nome">Nome</label>
        <input id="nome" name="nome" type="text" placeholder="Ex.: Joao Silva" maxlength="120" required />

        <label for="tipo">Tipo</label>
        <select id="tipo" name="tipo" required>
          <option value="normal">Normal</option>
          <option value="preferencial">Preferencial</option>
        </select>

        <button type="submit" id="submit-btn">Adicionar na fila</button>
      </form>
      <p id="feedback" class="feedback" role="status" aria-live="polite"></p>
    </article>

    <article class="panel card">
      <div class="panel-header">
        <h2>Fila de espera</h2>
        <button type="button" id="refresh-btn" class="btn-secondary">Atualizar</button>
      </div>
      <p id="fila-meta" class="fila-meta">Total de clientes: 0</p>
      <div class="table-wrapper">
        <table aria-label="Clientes na fila de espera">
          <thead>
            <tr>
              <th>Posicao</th>
              <th>ID</th>
              <th>Nome</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody id="fila-body">
            <tr>
              <td colspan="4" class="empty-row">Carregando fila...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
`;

const form = document.getElementById('cliente-form');
const nomeInput = document.getElementById('nome');
const tipoInput = document.getElementById('tipo');
const submitBtn = document.getElementById('submit-btn');
const refreshBtn = document.getElementById('refresh-btn');
const feedback = document.getElementById('feedback');
const filaMeta = document.getElementById('fila-meta');
const filaBody = document.getElementById('fila-body');

function setFeedback(message, type = 'info') {
  feedback.textContent = message;
  feedback.className = `feedback ${type}`;
}

function setLoadingSubmit(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? 'Cadastrando...' : 'Adicionar na fila';
}

function renderFila(fila) {
  const total = Number(fila?.total || 0);
  const clientes = Array.isArray(fila?.clientes) ? fila.clientes : [];

  filaMeta.textContent = `Total de clientes: ${total}`;

  if (clientes.length === 0) {
    filaBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-row">Nenhum cliente na fila.</td>
      </tr>
    `;
    return;
  }

  filaBody.innerHTML = clientes
    .map(
      (cliente) => `
        <tr>
          <td>${cliente.posicao}</td>
          <td>${cliente.id}</td>
          <td>${cliente.nome}</td>
          <td>
            <span class="tag ${cliente.tipo === 'preferencial' ? 'preferencial' : 'normal'}">
              ${cliente.tipo}
            </span>
          </td>
        </tr>
      `
    )
    .join('');
}

async function carregarFila() {
  refreshBtn.disabled = true;
  try {
    const fila = await atendimentoApi.getFila();
    renderFila(fila);
  } catch (error) {
    filaBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-row">Nao foi possivel carregar a fila.</td>
      </tr>
    `;
    setFeedback(error.message || 'Erro ao buscar fila.', 'error');
  } finally {
    refreshBtn.disabled = false;
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome = nomeInput.value.trim();
  const tipo = tipoInput.value;

  if (!nome) {
    setFeedback('Informe o nome do cliente.', 'error');
    return;
  }

  if (tipo !== 'normal' && tipo !== 'preferencial') {
    setFeedback('Tipo invalido. Use normal ou preferencial.', 'error');
    return;
  }

  setLoadingSubmit(true);
  setFeedback('');

  try {
    const response = await atendimentoApi.cadastrarCliente({ nome, tipo });
    setFeedback(response?.message || 'Cliente adicionado a fila com sucesso.', 'success');
    form.reset();
    tipoInput.value = 'normal';
    await carregarFila();
  } catch (error) {
    setFeedback(error.message || 'Erro ao cadastrar cliente.', 'error');
  } finally {
    setLoadingSubmit(false);
  }
});

refreshBtn.addEventListener('click', () => {
  carregarFila();
});

carregarFila();
