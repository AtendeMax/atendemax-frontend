(function () {
  function createCadastroForm() {
    const container = document.createElement('article');
    container.className = 'panel card';
    container.innerHTML = `
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
    `;

    const form = container.querySelector('#cliente-form');
    const nomeInput = container.querySelector('#nome');
    const tipoInput = container.querySelector('#tipo');
    const submitBtn = container.querySelector('#submit-btn');
    const feedback = container.querySelector('#feedback');

    function setFeedback(message, type) {
      feedback.textContent = message;
      feedback.className = type ? `feedback ${type}` : 'feedback';
    }

    function setLoading(isLoading) {
      submitBtn.disabled = isLoading;
      submitBtn.textContent = isLoading ? 'Cadastrando...' : 'Adicionar na fila';
    }

    function getValues() {
      return {
        nome: nomeInput.value.trim(),
        tipo: tipoInput.value
      };
    }

    function reset() {
      form.reset();
      tipoInput.value = 'normal';
    }

    return {
      element: container,
      form,
      setFeedback,
      setLoading,
      getValues,
      reset
    };
  }

  window.AtendeMaxComponents = window.AtendeMaxComponents || {};
  window.AtendeMaxComponents.createCadastroForm = createCadastroForm;
})();
