(function () {
  function initFilaPage(options) {
    const mountElement = options?.mountElement;
    const api = options?.api;
    const createCadastroForm = window.AtendeMaxComponents?.createCadastroForm;
    const createFilaTable = window.AtendeMaxComponents?.createFilaTable;

    if (!mountElement) {
      throw new Error('Elemento principal da aplicacao nao foi encontrado.');
    }

    if (!api?.cadastrarCliente || !api?.getFila || !api?.chamarProximo) {
      throw new Error('API de atendimento nao foi carregada corretamente.');
    }

    if (!createCadastroForm || !createFilaTable) {
      throw new Error('Componentes da tela nao foram carregados corretamente.');
    }

    mountElement.innerHTML = '';

    const layout = document.createElement('section');
    layout.className = 'layout-grid';
    layout.setAttribute('aria-label', 'Cadastro e fila de espera');

    let filaTable;
    const cadastroForm = createCadastroForm();

    async function carregarFila() {
      filaTable.setLoading(true);
      try {
        const fila = await api.getFila();
        filaTable.render(fila);
      } catch (error) {
        filaTable.renderError();
        cadastroForm.setFeedback(error.message || 'Erro ao buscar fila.', 'error');
      } finally {
        filaTable.setLoading(false);
      }
    }

    async function chamarProximoDaFila() {
      filaTable.setLoading(true);
      cadastroForm.setFeedback('');

      try {
        const response = await api.chamarProximo();
        cadastroForm.setFeedback(response?.message || 'Proximo cliente chamado com sucesso.', 'success');
        await carregarFila();
      } catch (error) {
        cadastroForm.setFeedback(error.message || 'Erro ao chamar proximo cliente.', 'error');
      } finally {
        filaTable.setLoading(false);
      }
    }

    async function cancelarClienteDaFila(clienteId) {
      filaTable.setLoading(true);
      cadastroForm.setFeedback('');

      try {
        const response = await api.cancelarCliente(clienteId);
        cadastroForm.setFeedback(response?.message || 'Cliente cancelado com sucesso.', 'success');
        await carregarFila();
      } catch (error) {
        cadastroForm.setFeedback(error.message || 'Erro ao cancelar cliente.', 'error');
      } finally {
        filaTable.setLoading(false);
      }
    }

    filaTable = createFilaTable(
      () => {
        carregarFila();
      },
      () => {
        chamarProximoDaFila();
      },
      (clienteId) => {
        cancelarClienteDaFila(clienteId)
      }
    );

    cadastroForm.form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const { nome, tipo } = cadastroForm.getValues();

      if (!nome) {
        cadastroForm.setFeedback('Informe o nome do cliente.', 'error');
        return;
      }

      if (tipo !== 'normal' && tipo !== 'preferencial') {
        cadastroForm.setFeedback('Tipo invalido. Use normal ou preferencial.', 'error');
        return;
      }

      cadastroForm.setLoading(true);
      cadastroForm.setFeedback('');

      try {
        const response = await api.cadastrarCliente({ nome, tipo });
        cadastroForm.setFeedback(response?.message || 'Cliente adicionado a fila com sucesso.', 'success');
        cadastroForm.reset();
        await carregarFila();
      } catch (error) {
        cadastroForm.setFeedback(error.message || 'Erro ao cadastrar cliente.', 'error');
      } finally {
        cadastroForm.setLoading(false);
      }
    });

    layout.appendChild(cadastroForm.element);
    layout.appendChild(filaTable.element);
    mountElement.appendChild(layout);

    carregarFila();
  }

  window.initFilaPage = initFilaPage;
})();
