(function () {
  function createFilaTable(onRefresh, onChamarProximo) {
    const container = document.createElement('article');
    container.className = 'panel card';
    container.innerHTML = `
      <div class="panel-header">
        <h2>Fila de espera</h2>
        <div class="actions">
          <button type="button" id="refresh-btn" class="btn-secondary">Atualizar</button>
          <button type="button" id="chamar-proximo-btn" class="btn-secondary">Chamar Proximo</button>
        </div>
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
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="fila-body">
            <tr>
              <td colspan="5" class="empty-row">Carregando fila...</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    const refreshBtn = container.querySelector('#refresh-btn');
    const chamarProximoBtn = container.querySelector('#chamar-proximo-btn');
    const filaMeta = container.querySelector('#fila-meta');
    const filaBody = container.querySelector('#fila-body');

    refreshBtn.addEventListener('click', () => {
      onRefresh();
    });

    chamarProximoBtn.addEventListener('click', () => {
      if (typeof onChamarProximo === 'function') {
        onChamarProximo();
      }
    });

    function setLoading(isLoading) {
      refreshBtn.disabled = isLoading;
      chamarProximoBtn.disabled = isLoading;
    }

    function render(fila) {
      const total = Number(fila?.total || 0);
      const clientes = Array.isArray(fila?.clientes) ? fila.clientes : [];

      filaMeta.textContent = `Total de clientes: ${total}`;

      if (clientes.length === 0) {
        filaBody.innerHTML = `
          <tr>
            <td colspan="5" class="empty-row">Nenhum cliente na fila.</td>
          </tr>
        `;
        return;
      }

      filaBody.innerHTML = clientes
        .map(
          (cliente) => {
            const status = cliente.status ? cliente.status.toLowerCase() : 'aguardando';

            return `
            <tr>
              <td>${cliente.posicao}</td>
              <td>${cliente.id}</td>
              <td>${cliente.nome}</td>
              <td>
                <span class="tag ${cliente.tipo === 'preferencial' ? 'preferencial' : 'normal'}">
                  ${cliente.tipo}
                </span>
              </td>
              <td>
                <span class="tag ${status}">${status}</span>
              </td>
            </tr>
          `;
          }
        )
        .join('');
    }

    function renderError() {
      filaBody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-row">Nao foi possivel carregar a fila.</td>
        </tr>
      `;
    }

    return {
      element: container,
      setLoading,
      render,
      renderError
    };
  }

  window.AtendeMaxComponents = window.AtendeMaxComponents || {};
  window.AtendeMaxComponents.createFilaTable = createFilaTable;
})();
