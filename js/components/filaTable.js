(function () {
  function createFilaTable(onRefresh, onChamarProximo, onCancelarCliente, onConcluirAtendimento) {
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
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="fila-body">
            <tr>
              <td colspan="6" class="empty-row">Carregando fila...</td>
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

    filaBody.addEventListener('click', (event) => {
      const cancelButton = event.target.closest('.js-cancelar-cliente');
      if (cancelButton) return cancelAction(cancelButton);

      const concludeButton = event.target.closest('.js-concluir-cliente');
      if (concludeButton) return concludedAction(concludeButton);

      return;
    });

    function cancelAction(cancelButton) {
      const clientName = cancelButton.dataset.clientName;

      let confirmation = confirm(`Deseja cancelar o atendimento de ${clientName}?`);
      if (!confirmation) return;

      const clientId = cancelButton.dataset.clientId;

      if (typeof onCancelarCliente === 'function') {
        onCancelarCliente(clientId);
      }
    }

    function concludedAction(concludeButton) {
      const clientId = concludeButton.dataset.clientId;

      if (typeof onConcluirAtendimento === 'function') {
        onConcluirAtendimento(clientId);
      }
    }

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
            <td colspan="6" class="empty-row">Nenhum cliente na fila.</td>
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
                <span class="tag ${cliente.tipo.toLowerCase()}">
                  ${cliente.tipo}
                </span>
              </td>
              <td>
                <span class="tag ${status}">${status === 'em_atendimento' ? 'Em Atendimento' : status}</span>
              </td>
              <td>
                ${status === "em_atendimento"
                ? `
                    <button
                      type="button"
                      class="btn-concluir js-concluir-cliente"
                      data-client-id="${cliente.id}"
                    >
                      Concluir
                    </button>
                  `
                : `
                    <button
                      type="button"
                      class="btn-cancelar js-cancelar-cliente"
                      data-client-id="${cliente.id}"
                      data-client-name="${cliente.nome}"
                    >
                      Cancelar
                    </button>
                  `
              }
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
          <td colspan="6" class="empty-row">Nao foi possivel carregar a fila.</td>
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
