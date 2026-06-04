(function () {
  function createHistoricoTable(onRefresh) {
    const container = document.createElement('article');
    container.className = 'panel card historico-full-width';
    container.innerHTML = `
      <div class="panel-header">
        <h2>Histórico</h2>
        <div class="actions">
          <label class="filtro-group" for="filtro-tipo">
            <select id="filtro-tipo" class="filtro">
              <option value="">Todos os tipos</option>
              <option value="normal">Normal</option>
              <option value="preferencial">Preferencial</option>
            </select>
          </label>
          <label class="filtro-group" for="filtro-status">
            <select id="filtro-status" class="filtro">
              <option value="">Todos os status</option>
              <option value="cancelado">Cancelado</option>
              <option value="concluido">Concluído</option>
            </select>
          </label>
          <button type="button" id="refresh-btn" class="btn-secondary">Atualizar</button>
          <button type="button" id="clear-filters-btn" class="btn-secondary">Limpar Filtros</button>
        </div>
      </div>
      <p id="fila-meta" class="fila-meta">Total: 0</p>
      <div class="table-wrapper">
        <table aria-label="Clientes no histórico">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Horário de início</th>
              <th>Horário de conclusão</th>
            </tr>
          </thead>
          <tbody id="fila-body">
            <tr>
              <td colspan="6" class="empty-row">Carregando histórico...</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    const refreshBtn = container.querySelector('#refresh-btn');
    const cleanFiltersBtn = container.querySelector('#clear-filters-btn');
    const filaMeta = container.querySelector('#fila-meta');
    const filaBody = container.querySelector('#fila-body');
    const filtroTipo = container.querySelector('#filtro-tipo');
    const filtroStatus = container.querySelector('#filtro-status');

    function buildFiltrosQuery() {
      const params = new URLSearchParams();

      if (filtroTipo?.value) {
        params.set('tipo', filtroTipo.value);
      }

      if (filtroStatus?.value) {
        params.set('status', filtroStatus.value);
      }

      const query = params.toString();
      return query ? `?${query}` : '';
    }

    refreshBtn.addEventListener('click', () => {
      onRefresh(buildFiltrosQuery());
    });

    cleanFiltersBtn.addEventListener('click', () => {
      if (filtroTipo) {
        filtroTipo.value = '';
      }

      if (filtroStatus) {
        filtroStatus.value = '';
      }

      onRefresh('');
    });

    filtroTipo?.addEventListener('change', () => {
      onRefresh(buildFiltrosQuery());
    });

    filtroStatus?.addEventListener('change', () => {
      onRefresh(buildFiltrosQuery());
    });

    function setLoading(isLoading) {
      refreshBtn.disabled = isLoading;
      cleanFiltersBtn.disabled = isLoading;

      if (filtroTipo) {
        filtroTipo.disabled = isLoading;
      }

      if (filtroStatus) {
        filtroStatus.disabled = isLoading;
      }
    }

    function render(fila) {
      const total = Number(fila?.total || 0);
      const clientes = Array.isArray(fila?.clientes) ? fila.clientes : [];

      filaMeta.textContent = `Total: ${total}`;

      if (clientes.length === 0) {
        filaBody.innerHTML = `
          <tr>
            <td colspan="6" class="empty-row">Nenhum atendimento registrado.</td>
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
              <td>
                ${cliente.horario_inicio ? new Date(cliente.horario_inicio).toLocaleString() : '-'}
              </td>
              <td>
                ${cliente.horario_conclusao ? new Date(cliente.horario_conclusao).toLocaleString() : '-'}
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
          <td colspan="6" class="empty-row">Nao foi possivel carregar o histórico.</td>
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
  window.AtendeMaxComponents.createHistoricoTable = createHistoricoTable;
})();
