(function () {
  const MOCK_FILA = {
    total: 3,
    clientes: [
      {
        id: 101,
        nome: 'Ana Souza',
        tipo: 'preferencial',
        status: 'aguardando',
        posicao: 1
      },
      {
        id: 102,
        nome: 'Carlos Lima',
        tipo: 'normal',
        status: 'em_atendimento',
        posicao: 2,
        horario_inicio: '2026-06-04T12:30:00Z'
      },
      {
        id: 103,
        nome: 'Marina Alves',
        tipo: 'normal',
        status: 'aguardando',
        posicao: 3
      }
    ]
  };

  const MOCK_HISTORICO = {
    total: 4,
    clientes: [
      {
        id: 201,
        nome: 'Roberto Dias',
        tipo: 'normal',
        status: 'concluido',
        horario_inicio: '2026-06-04T10:00:00Z',
        horario_conclusao: '2026-06-04T10:15:00Z'
      },
      {
        id: 202,
        nome: 'Paula Nunes',
        tipo: 'preferencial',
        status: 'cancelado',
        horario_inicio: '2026-06-04T10:20:00Z',
        horario_conclusao: null
      },
      {
        id: 203,
        nome: 'Fernanda Rocha',
        tipo: 'normal',
        status: 'concluido',
        horario_inicio: '2026-06-04T10:35:00Z',
        horario_conclusao: '2026-06-04T10:52:00Z'
      },
      {
        id: 204,
        nome: 'Joao Pedro',
        tipo: 'preferencial',
        status: 'concluido',
        horario_inicio: '2026-06-04T11:10:00Z',
        horario_conclusao: '2026-06-04T11:22:00Z'
      }
    ]
  };

  function applyHistoricoFiltersMock(clientes, filtros) {
    if (!filtros) {
      return clientes;
    }

    const normalized = filtros.startsWith('?') ? filtros.slice(1) : filtros;
    const params = new URLSearchParams(normalized);
    const tipo = params.get('tipo');
    const status = params.get('status');

    return clientes.filter((cliente) => {
      const matchesTipo = !tipo || cliente.tipo === tipo;
      const matchesStatus = !status || cliente.status === status;
      return matchesTipo && matchesStatus;
    });
  }

  window.AtendimentoApiMock = {
    fila: MOCK_FILA,
    historico: MOCK_HISTORICO,
    applyHistoricoFilters: applyHistoricoFiltersMock
  };
})();
