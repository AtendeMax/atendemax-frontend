const app = document.getElementById('app');

if (!window.initFilaPage) {
  throw new Error('Pagina de fila nao foi carregada corretamente.');
}

window.initFilaPage({
  mountElement: app,
  api: window.AtendimentoApi
});
