/**
 * CopaDoMundo
 * -----------
 * Classe com domínio "Copa do Mundo":
 * 5 padrões criacionais + 6 estruturais + 9 comportamentais = 20 métodos testáveis.
 * Pensada para prática de testes unitários (Arrange/Act/Assert + mocks).
 */

class CopaDoMundo {
  constructor() {
    this._torcedores = []; // usado pelo Observer
    this._placaresSalvos = []; // usado pelo Memento
    this._cacheBandeiras = new Map(); // usado pelo Flyweight
  }

  // ============================================================
  // CRIACIONAIS (5)
  // ============================================================

  /**
   * 1) SINGLETON
   * Garante que só exista um "torneio" ativo por instância da classe.
   * Teste sugerido: duas chamadas devem retornar a MESMA referência (toBe).
   */
  obterTorneioAtivo() {
    if (!CopaDoMundo._torneioAtivo) {
      CopaDoMundo._torneioAtivo = { nome: 'Copa do Mundo', ano: 2026, criadoEm: Date.now() };
    }
    return CopaDoMundo._torneioAtivo;
  }

  /**
   * 2) FACTORY METHOD
   * Cria uma seleção a partir do nome e da confederação.
   * Teste sugerido: confederações válidas + erro para confederação desconhecida.
   */
  criarSelecao(nome, confederacao) {
    const confederacoesValidas = ['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'];
    if (!nome) {
      throw new Error('Nome da seleção é obrigatório');
    }
    if (!confederacoesValidas.includes(confederacao)) {
      throw new Error(`Confederação inválida: ${confederacao}`);
    }
    return { nome, confederacao, pontos: 0, gols: 0 };
  }

  /**
   * 3) ABSTRACT FACTORY
   * Cria a família de uniformes (titular e reserva) de uma seleção coerentes com o tema de cores.
   * Teste sugerido: verificar que ambos os uniformes retornam a mesma paleta de cor base.
   */
  criarFamiliaUniformes(corBase) {
    const coresValidas = ['verde-amarelo', 'azul-branco', 'vermelho-branco'];
    if (!coresValidas.includes(corBase)) {
      throw new Error(`Cor base inválida: ${corBase}`);
    }
    return {
      titular: { corBase, tipo: 'titular' },
      reserva: { corBase, tipo: 'reserva' },
    };
  }

  /**
   * 4) BUILDER
   * Monta a súmula (boletim) de uma partida passo a passo, a partir de uma configuração.
   * Teste sugerido: config parcial (usa defaults) e config completa com gols/cartões.
   */
  construirSumulaPartida({ mandante = '', visitante = '', gols = [], cartoes = [] } = {}) {
    const partes = [`${mandante} x ${visitante}`];
    gols.forEach((gol) => partes.push(`Gol: ${gol.jogador} (${gol.minuto}')`));
    cartoes.forEach((cartao) => partes.push(`Cartão ${cartao.tipo}: ${cartao.jogador} (${cartao.minuto}')`));
    return partes.join('\n');
  }

  /**
   * 5) PROTOTYPE
   * Clona profundamente a tabela de classificação (sem manter referência compartilhada).
   * Teste sugerido: alterar o clone e garantir que a tabela original não muda.
   */
  clonarTabelaClassificacao(tabela) {
    if (!Array.isArray(tabela)) {
      throw new Error('Tabela de classificação deve ser um array');
    }
    return JSON.parse(JSON.stringify(tabela));
  }

  // ============================================================
  // ESTRUTURAIS (6)
  // ============================================================

  /**
   * 6) ADAPTER
   * Converte um resultado no formato "antigo" (usado em edições passadas) para o novo formato.
   * Teste sugerido: mapeamento de campos e ausência de campos opcionais (pênaltis).
   */
  adaptarResultadoAntigo(resultadoAntigo) {
    if (!resultadoAntigo || !resultadoAntigo.time_casa || !resultadoAntigo.time_fora) {
      throw new Error('Resultado antigo inválido: times são obrigatórios');
    }
    return {
      mandante: resultadoAntigo.time_casa,
      visitante: resultadoAntigo.time_fora,
      placar: [resultadoAntigo.gols_casa ?? 0, resultadoAntigo.gols_fora ?? 0],
      penaltis: resultadoAntigo.penaltis ?? null,
    };
  }

  /**
   * 7) COMPOSITE
   * Soma o total de gols de uma "árvore" de fases do torneio (grupo -> jogos, ou fase -> subfases).
   * Teste sugerido: fase simples com jogos, fase composta com subfases aninhadas, fase vazia.
   */
  calcularTotalGolsDaFase(fase) {
    if (!fase) return 0;
    if (Array.isArray(fase.subfases)) {
      return fase.subfases.reduce((soma, subfase) => soma + this.calcularTotalGolsDaFase(subfase), 0);
    }
    if (Array.isArray(fase.jogos)) {
      return fase.jogos.reduce((soma, jogo) => soma + jogo.golsCasa + jogo.golsFora, 0);
    }
    return 0;
  }

  /**
   * 8) DECORATOR
   * Aplica uma cadeia de "decoradores" ao nome de uma seleção (ex.: emoji de bandeira, apelido, título).
   * Teste sugerido: sem decoradores (retorna o nome original), um decorador, vários em ordem.
   */
  decorarNomeSelecao(nome, decoradores = []) {
    return decoradores.reduce((atual, decorador) => decorador(atual), nome);
  }

  /**
   * 9) FACADE
   * Orquestra o processamento completo de uma partida: calcula vencedor e atualiza pontos.
   * Teste sugerido: cenários de vitória, empate e derrota; testar com spyOn nos métodos internos.
   */
  processarPartidaCompleta(golsCasa, golsFora) {
    const vencedor = this.determinarVencedor(golsCasa, golsFora);
    const pontosCasa = this.calcularPontosPorResultado(vencedor, 'casa');
    const pontosFora = this.calcularPontosPorResultado(vencedor, 'fora');
    return { vencedor, pontosCasa, pontosFora };
  }

  /**
   * 10) FLYWEIGHT
   * Reaproveita objetos de bandeira compartilhados em vez de recriá-los a cada chamada.
   * Teste sugerido: duas chamadas com o mesmo país devem retornar a MESMA referência.
   */
  obterBandeiraCompartilhada(pais) {
    if (!this._cacheBandeiras.has(pais)) {
      this._cacheBandeiras.set(pais, { pais, criadoEm: Date.now() });
    }
    return this._cacheBandeiras.get(pais);
  }

  /**
   * 11) PROXY
   * Controla o acesso de um usuário a uma área restrita do estádio (ex.: zona mista, VIP).
   * Teste sugerido: usuário autorizado, não autorizado, usuário inválido/nulo.
   */
  acessarAreaRestrita(usuario, area) {
    if (!usuario || !usuario.credenciais) {
      throw new Error('Usuário inválido');
    }
    if (!usuario.credenciais.includes(area)) {
      throw new Error(`Acesso negado à área: ${area}`);
    }
    return { area, acessadoPor: usuario.nome };
  }

  // ============================================================
  // COMPORTAMENTAIS (9)
  // ============================================================

  /**
   * 12) CHAIN OF RESPONSIBILITY
   * Simula a revisão de um lance por uma cadeia de árbitros (campo -> VAR -> comitê).
   * Teste sugerido: primeiro árbitro decide, nenhum decide (retorna null), decisão no meio da cadeia.
   */
  revisarLancePorCadeia(lance, arbitros = []) {
    for (const arbitro of arbitros) {
      const decisao = arbitro(lance);
      if (decisao !== undefined && decisao !== null) {
        return decisao;
      }
    }
    return null;
  }

  /**
   * 13) COMMAND
   * Executa um "comando" de substituição de jogador e mantém histórico de comandos executados.
   * Teste sugerido: verificar retorno de executar() e que o histórico cresce a cada chamada.
   */
  executarComandoSubstituicao(comando) {
    if (!comando || typeof comando.executar !== 'function') {
      throw new Error('Comando inválido: precisa ter um método executar()');
    }
    const resultado = comando.executar();
    this._placaresSalvos.push({ comando: comando.nome ?? 'anonimo', resultado });
    return resultado;
  }

  /**
   * 14) ITERATOR
   * Cria um iterador manual sobre a lista de jogos de uma rodada (hasNext/next).
   * Teste sugerido: percorrer toda a rodada, rodada vazia, chamar next() além do fim.
   */
  criarIteradorJogos(jogos = []) {
    let indice = 0;
    return {
      hasNext: () => indice < jogos.length,
      next: () => {
        if (indice >= jogos.length) {
          throw new Error('Não há mais jogos nesta rodada');
        }
        return jogos[indice++];
      },
    };
  }

  /**
   * 15) MEDIATOR
   * Centraliza a comunicação entre patrocinadores e a organização do torneio.
   * Teste sugerido: mensagem chega a todos os participantes exceto o remetente; lista vazia.
   */
  mediarComunicacaoPatrocinio(remetente, mensagem, participantes = []) {
    return participantes
      .filter((participante) => participante !== remetente)
      .map((participante) => ({ para: participante, de: remetente, mensagem }));
  }

  /**
   * 16) MEMENTO
   * Salva e restaura o placar de uma partida (útil para simular reversão de gol anulado no VAR).
   * Teste sugerido: salvar N placares e restaurar o último; restaurar sem histórico lança erro.
   */
  salvarPlacar(placar) {
    this._placaresSalvos.push(this.clonarTabelaClassificacao([placar])[0]);
    return this._placaresSalvos.length;
  }

  restaurarUltimoPlacar() {
    if (this._placaresSalvos.length === 0) {
      throw new Error('Nenhum placar salvo para restaurar');
    }
    return this._placaresSalvos.pop();
  }

  /**
   * 17) OBSERVER
   * Registra torcedores (callbacks) e os notifica quando um evento do jogo acontece (ex.: gol).
   * Teste sugerido: mockar a função do torcedor (jest.fn()) e verificar toHaveBeenCalledWith.
   */
  registrarTorcedor(callback) {
    this._torcedores.push(callback);
  }

  notificarTorcedores(evento) {
    this._torcedores.forEach((torcedor) => torcedor(evento));
    return this._torcedores.length;
  }

  /**
   * 18) STATE
   * Transiciona a fase de uma seleção no torneio conforme o resultado da partida.
   * Teste sugerido: cobrir todas as transições válidas e uma transição inválida (erro).
   */
  transicionarFaseSelecao(faseAtual, resultado) {
    const transicoes = {
      grupos: { classificou: 'oitavas', eliminado: 'eliminada' },
      oitavas: { classificou: 'quartas', eliminado: 'eliminada' },
      quartas: { classificou: 'semifinal', eliminado: 'eliminada' },
      semifinal: { classificou: 'final', eliminado: 'terceiro-lugar' },
      final: { classificou: 'campea', eliminado: 'vice' },
    };
    const proximaFase = transicoes[faseAtual]?.[resultado];
    if (!proximaFase) {
      throw new Error(`Transição inválida: ${resultado} a partir de ${faseAtual}`);
    }
    return proximaFase;
  }

  /**
   * 19) STRATEGY
   * Ordena a classificação de um grupo usando um critério de desempate intercambiável.
   * Teste sugerido: testar com dois critérios diferentes (saldo de gols vs. gols marcados).
   */
  ordenarClassificacaoComEstrategia(selecoes, estrategiaDeCriterio) {
    if (typeof estrategiaDeCriterio !== 'function') {
      throw new Error('Estratégia de critério deve ser uma função');
    }
    return [...selecoes].sort(estrategiaDeCriterio);
  }

  /**
   * 20) TEMPLATE METHOD
   * Define o "esqueleto" da validação de um gol (validar impedimento -> processar VAR -> formatar),
   * permitindo customizar apenas a etapa de checagem do VAR.
   * Teste sugerido: mockar `checagemVar` e verificar que a validação sempre roda antes.
   */
  executarFluxoValidacaoGol(golInfo, checagemVar) {
    if (!golInfo || !golInfo.jogador) {
      throw new Error('Informações do gol são obrigatórias');
    }
    if (typeof checagemVar !== 'function') {
      throw new Error('Checagem do VAR deve ser uma função');
    }
    const resultadoVar = checagemVar(golInfo);
    return `[gol de ${golInfo.jogador}: ${resultadoVar}]`;
  }

  // ------------------------------------------------------------
  // Métodos auxiliares (usados pelo Facade, também testáveis isoladamente)
  // ------------------------------------------------------------
  determinarVencedor(golsCasa, golsFora) {
    if (golsCasa > golsFora) return 'casa';
    if (golsFora > golsCasa) return 'fora';
    return 'empate';
  }

  calcularPontosPorResultado(vencedor, lado) {
    if (vencedor === 'empate') return 1;
    return vencedor === lado ? 3 : 0;
  }
}

module.exports = CopaDoMundo;
