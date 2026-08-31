const CopaDoMundo = require("../src/CopaDoMundo");

describe("CopaDoMundo - Singleton (obterTorneioAtivo)", () => {
  test("deve retornar sempre a mesma instância de torneio", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act
    const primeiraChamada = copa.obterTorneioAtivo();
    const segundaChamada = copa.obterTorneioAtivo();

    // Assert
    expect(segundaChamada).toBe(primeiraChamada);
    expect(primeiraChamada.nome).toBe("Copa do Mundo");
  });
});

describe("CopaDoMundo - Factory Method (criarSelecao)", () => {
  test("deve criar uma seleção válida com pontos e gols zerados", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act
    const selecao = copa.criarSelecao("Brasil", "CONMEBOL");

    // Assert
    expect(selecao).toEqual({ nome: "Brasil", confederacao: "CONMEBOL", pontos: 0, gols: 0 });
  });

  test("deve lançar erro quando o nome não é informado", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act & Assert
    expect(() => copa.criarSelecao("", "CONMEBOL")).toThrow("Nome da seleção é obrigatório");
  });

  test("deve lançar erro quando a confederação é desconhecida", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act & Assert
    expect(() => copa.criarSelecao("Brasil", "XPTO")).toThrow("Confederação inválida: XPTO");
  });
});

describe("CopaDoMundo - Abstract Factory (criarFamiliaUniformes)", () => {
  test("deve criar o uniforme titular e reserva com a mesma cor base", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act
    const uniformes = copa.criarFamiliaUniformes("verde-amarelo");

    // Assert
    expect(uniformes.titular.corBase).toBe("verde-amarelo");
    expect(uniformes.reserva.corBase).toBe("verde-amarelo");
  });

  test("deve lançar erro para uma cor base inválida", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act & Assert
    expect(() => copa.criarFamiliaUniformes("rosa-choque")).toThrow("Cor base inválida: rosa-choque");
  });
});

describe("CopaDoMundo - Builder (construirSumulaPartida)", () => {
  test("deve montar a súmula apenas com os times quando não há gols nem cartões", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act
    const sumula = copa.construirSumulaPartida({ mandante: "Brasil", visitante: "Argentina" });

    // Assert
    expect(sumula).toBe("Brasil x Argentina");
  });

  test("deve incluir gols e cartões na súmula quando informados", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const config = {
      mandante: "Brasil",
      visitante: "Argentina",
      gols: [{ jogador: "Neymar", minuto: 23 }],
      cartoes: [{ tipo: "amarelo", jogador: "Casemiro", minuto: 40 }],
    };

    // Act
    const sumula = copa.construirSumulaPartida(config);

    // Assert
    expect(sumula).toBe(
      "Brasil x Argentina\nGol: Neymar (23')\nCartão amarelo: Casemiro (40')"
    );
  });
});

describe("CopaDoMundo - Prototype (clonarTabelaClassificacao)", () => {
  test("deve clonar a tabela sem manter referência com o array original", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const tabelaOriginal = [{ selecao: "Brasil", pontos: 9 }];

    // Act
    const clone = copa.clonarTabelaClassificacao(tabelaOriginal);
    clone[0].pontos = 0;

    // Assert
    expect(clone).toEqual([{ selecao: "Brasil", pontos: 0 }]);
    expect(tabelaOriginal[0].pontos).toBe(9);
  });

  test("deve lançar erro quando o argumento não é um array", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act & Assert
    expect(() => copa.clonarTabelaClassificacao("não é array")).toThrow(
      "Tabela de classificação deve ser um array"
    );
  });
});

describe("CopaDoMundo - Adapter (adaptarResultadoAntigo)", () => {
  test("deve converter o formato antigo para o novo formato, com pênaltis", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const resultadoAntigo = {
      time_casa: "Brasil",
      time_fora: "Itália",
      gols_casa: 1,
      gols_fora: 1,
      penaltis: [4, 3],
    };

    // Act
    const resultado = copa.adaptarResultadoAntigo(resultadoAntigo);

    // Assert
    expect(resultado).toEqual({
      mandante: "Brasil",
      visitante: "Itália",
      placar: [1, 1],
      penaltis: [4, 3],
    });
  });

  test("deve assumir placar zero a zero e pênaltis nulos quando não informados", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const resultadoAntigo = { time_casa: "Brasil", time_fora: "Itália" };

    // Act
    const resultado = copa.adaptarResultadoAntigo(resultadoAntigo);

    // Assert
    expect(resultado).toEqual({
      mandante: "Brasil",
      visitante: "Itália",
      placar: [0, 0],
      penaltis: null,
    });
  });

  test("deve lançar erro quando falta algum dos times", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act & Assert
    expect(() => copa.adaptarResultadoAntigo({ time_casa: "Brasil" })).toThrow(
      "Resultado antigo inválido: times são obrigatórios"
    );
  });
});

describe("CopaDoMundo - Composite (calcularTotalGolsDaFase)", () => {
  test("deve somar os gols de uma fase simples com jogos", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const fase = { jogos: [{ golsCasa: 2, golsFora: 1 }, { golsCasa: 0, golsFora: 3 }] };

    // Act
    const total = copa.calcularTotalGolsDaFase(fase);

    // Assert
    expect(total).toBe(6);
  });

  test("deve somar os gols recursivamente quando a fase tem subfases", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const fase = {
      subfases: [
        { jogos: [{ golsCasa: 1, golsFora: 1 }] },
        { subfases: [{ jogos: [{ golsCasa: 2, golsFora: 0 }] }] },
      ],
    };

    // Act
    const total = copa.calcularTotalGolsDaFase(fase);

    // Assert
    expect(total).toBe(4);
  });

  test("deve retornar zero para uma fase nula ou sem jogos/subfases", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act & Assert
    expect(copa.calcularTotalGolsDaFase(null)).toBe(0);
    expect(copa.calcularTotalGolsDaFase({})).toBe(0);
  });
});

describe("CopaDoMundo - Decorator (decorarNomeSelecao)", () => {
  test("deve retornar o nome original quando não há decoradores", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act
    const resultado = copa.decorarNomeSelecao("Brasil", []);

    // Assert
    expect(resultado).toBe("Brasil");
  });

  test("deve aplicar os decoradores mockados em ordem", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const paraMaiuscula = jest.fn((nome) => nome.toUpperCase());
    const comEstrela = jest.fn((nome) => `⭐ ${nome}`);

    // Act
    const resultado = copa.decorarNomeSelecao("Brasil", [paraMaiuscula, comEstrela]);

    // Assert
    expect(paraMaiuscula).toHaveBeenCalledWith("Brasil");
    expect(comEstrela).toHaveBeenCalledWith("BRASIL");
    expect(resultado).toBe("⭐ BRASIL");
  });
});

describe("CopaDoMundo - Facade (processarPartidaCompleta)", () => {
  test("deve dar 3 pontos ao mandante quando o time da casa vence", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act
    const resultado = copa.processarPartidaCompleta(2, 0);

    // Assert
    expect(resultado).toEqual({ vencedor: "casa", pontosCasa: 3, pontosFora: 0 });
  });

  test("deve dar 3 pontos ao visitante quando o time de fora vence", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act
    const resultado = copa.processarPartidaCompleta(0, 1);

    // Assert
    expect(resultado).toEqual({ vencedor: "fora", pontosCasa: 0, pontosFora: 3 });
  });

  test("deve dar 1 ponto para cada lado em caso de empate", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act
    const resultado = copa.processarPartidaCompleta(1, 1);

    // Assert
    expect(resultado).toEqual({ vencedor: "empate", pontosCasa: 1, pontosFora: 1 });
  });

  test("deve delegar o cálculo do vencedor para determinarVencedor (spy)", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const spyVencedor = jest.spyOn(copa, "determinarVencedor");

    // Act
    copa.processarPartidaCompleta(3, 1);

    // Assert
    expect(spyVencedor).toHaveBeenCalledWith(3, 1);
    spyVencedor.mockRestore();
  });
});

describe("CopaDoMundo - Flyweight (obterBandeiraCompartilhada)", () => {
  test("deve retornar a mesma referência para o mesmo país", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act
    const bandeira1 = copa.obterBandeiraCompartilhada("Brasil");
    const bandeira2 = copa.obterBandeiraCompartilhada("Brasil");

    // Assert
    expect(bandeira2).toBe(bandeira1);
  });

  test("deve retornar referências diferentes para países diferentes", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act
    const bandeiraBrasil = copa.obterBandeiraCompartilhada("Brasil");
    const bandeiraArgentina = copa.obterBandeiraCompartilhada("Argentina");

    // Assert
    expect(bandeiraBrasil).not.toBe(bandeiraArgentina);
  });
});

describe("CopaDoMundo - Proxy (acessarAreaRestrita)", () => {
  test("deve permitir acesso quando o usuário tem a credencial necessária", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const usuario = { nome: "Wilian", credenciais: ["zona-vip"] };

    // Act
    const resultado = copa.acessarAreaRestrita(usuario, "zona-vip");

    // Assert
    expect(resultado).toEqual({ area: "zona-vip", acessadoPor: "Wilian" });
  });

  test("deve lançar erro quando o usuário não tem a credencial necessária", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const usuario = { nome: "Torcedor", credenciais: [] };

    // Act & Assert
    expect(() => copa.acessarAreaRestrita(usuario, "zona-vip")).toThrow(
      "Acesso negado à área: zona-vip"
    );
  });

  test("deve lançar erro quando o usuário é inválido", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act & Assert
    expect(() => copa.acessarAreaRestrita(null, "zona-vip")).toThrow("Usuário inválido");
  });
});

describe("CopaDoMundo - Chain of Responsibility (revisarLancePorCadeia)", () => {
  test("deve parar no primeiro árbitro mockado que der uma decisão", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const arbitroCampo = jest.fn().mockReturnValue(null);
    const var_ = jest.fn().mockReturnValue("gol validado");
    const comite = jest.fn();

    // Act
    const decisao = copa.revisarLancePorCadeia({ minuto: 55 }, [arbitroCampo, var_, comite]);

    // Assert
    expect(decisao).toBe("gol validado");
    expect(comite).not.toHaveBeenCalled();
  });

  test("deve retornar null quando nenhum árbitro decide o lance", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const arbitroCampo = jest.fn().mockReturnValue(null);
    const var_ = jest.fn().mockReturnValue(undefined);

    // Act
    const decisao = copa.revisarLancePorCadeia({ minuto: 10 }, [arbitroCampo, var_]);

    // Assert
    expect(decisao).toBeNull();
  });
});

describe("CopaDoMundo - Command (executarComandoSubstituicao)", () => {
  test("deve executar o comando mockado e registrar o resultado no histórico", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const comando = { nome: "Substituicao1", executar: jest.fn().mockReturnValue({ entra: "Endrick" }) };

    // Act
    const resultado = copa.executarComandoSubstituicao(comando);
    const ultimoRegistro = copa.restaurarUltimoPlacar();

    // Assert
    expect(comando.executar).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual({ entra: "Endrick" });
    expect(ultimoRegistro).toEqual({ comando: "Substituicao1", resultado: { entra: "Endrick" } });
  });

  test("deve lançar erro quando o comando não possui o método executar", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act & Assert
    expect(() => copa.executarComandoSubstituicao({})).toThrow(
      "Comando inválido: precisa ter um método executar()"
    );
  });
});

describe("CopaDoMundo - Iterator (criarIteradorJogos)", () => {
  test("deve percorrer todos os jogos da rodada em ordem", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const jogos = ["Brasil x Argentina", "Alemanha x França"];

    // Act
    const iterador = copa.criarIteradorJogos(jogos);
    const primeiro = iterador.next();
    const segundo = iterador.next();
    const aindaTemProximo = iterador.hasNext();

    // Assert
    expect(primeiro).toBe("Brasil x Argentina");
    expect(segundo).toBe("Alemanha x França");
    expect(aindaTemProximo).toBe(false);
  });

  test("deve lançar erro ao chamar next() além do fim da lista", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const iterador = copa.criarIteradorJogos([]);

    // Act & Assert
    expect(() => iterador.next()).toThrow("Não há mais jogos nesta rodada");
  });
});

describe("CopaDoMundo - Mediator (mediarComunicacaoPatrocinio)", () => {
  test("deve enviar a mensagem para todos os participantes, exceto o remetente", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act
    const mensagens = copa.mediarComunicacaoPatrocinio("Nike", "proposta enviada", ["Nike", "Adidas", "Puma"]);

    // Assert
    expect(mensagens).toEqual([
      { para: "Adidas", de: "Nike", mensagem: "proposta enviada" },
      { para: "Puma", de: "Nike", mensagem: "proposta enviada" },
    ]);
  });

  test("deve retornar lista vazia quando não há participantes", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act
    const mensagens = copa.mediarComunicacaoPatrocinio("Nike", "proposta enviada", []);

    // Assert
    expect(mensagens).toEqual([]);
  });
});

describe("CopaDoMundo - Memento (salvarPlacar / restaurarUltimoPlacar)", () => {
  test("deve salvar e restaurar o último placar salvo", () => {
    // Arrange
    const copa = new CopaDoMundo();
    copa.salvarPlacar({ mandante: "Brasil", visitante: "Croácia", placar: [1, 1] });

    // Act
    const quantidadeSalva = copa.salvarPlacar({ mandante: "Brasil", visitante: "Croácia", placar: [2, 1] });
    const placarRestaurado = copa.restaurarUltimoPlacar();

    // Assert
    expect(quantidadeSalva).toBe(2);
    expect(placarRestaurado).toEqual({ mandante: "Brasil", visitante: "Croácia", placar: [2, 1] });
  });

  test("deve lançar erro ao restaurar sem nenhum placar salvo", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act & Assert
    expect(() => copa.restaurarUltimoPlacar()).toThrow("Nenhum placar salvo para restaurar");
  });
});

describe("CopaDoMundo - Observer (registrarTorcedor / notificarTorcedores)", () => {
  test("deve notificar cada torcedor mockado com o evento recebido", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const torcedor1 = jest.fn();
    const torcedor2 = jest.fn();
    copa.registrarTorcedor(torcedor1);
    copa.registrarTorcedor(torcedor2);
    const evento = { tipo: "gol", minuto: 78 };

    // Act
    const quantidadeNotificada = copa.notificarTorcedores(evento);

    // Assert
    expect(torcedor1).toHaveBeenCalledWith(evento);
    expect(torcedor2).toHaveBeenCalledWith(evento);
    expect(quantidadeNotificada).toBe(2);
  });

  test("deve retornar zero quando não há torcedores registrados", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act
    const quantidadeNotificada = copa.notificarTorcedores({ tipo: "gol" });

    // Assert
    expect(quantidadeNotificada).toBe(0);
  });
});

describe("CopaDoMundo - State (transicionarFaseSelecao)", () => {
  test("deve avançar de fase quando a seleção classifica", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act & Assert
    expect(copa.transicionarFaseSelecao("grupos", "classificou")).toBe("oitavas");
    expect(copa.transicionarFaseSelecao("semifinal", "classificou")).toBe("final");
    expect(copa.transicionarFaseSelecao("final", "classificou")).toBe("campea");
  });

  test("deve levar para vice quando perde a final e para terceiro lugar quando perde a semifinal", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act & Assert
    expect(copa.transicionarFaseSelecao("semifinal", "eliminado")).toBe("terceiro-lugar");
    expect(copa.transicionarFaseSelecao("final", "eliminado")).toBe("vice");
  });

  test("deve lançar erro para uma transição inválida", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act & Assert
    expect(() => copa.transicionarFaseSelecao("grupos", "empatou")).toThrow(
      "Transição inválida: empatou a partir de grupos"
    );
  });
});

describe("CopaDoMundo - Strategy (ordenarClassificacaoComEstrategia)", () => {
  test("deve ordenar a classificação usando o critério de saldo de gols", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const selecoes = [
      { nome: "Brasil", saldoGols: 2 },
      { nome: "Argentina", saldoGols: 5 },
    ];
    const porSaldoDeGols = (a, b) => b.saldoGols - a.saldoGols;

    // Act
    const classificacao = copa.ordenarClassificacaoComEstrategia(selecoes, porSaldoDeGols);

    // Assert
    expect(classificacao.map((s) => s.nome)).toEqual(["Argentina", "Brasil"]);
  });

  test("deve lançar erro quando a estratégia não é uma função", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act & Assert
    expect(() => copa.ordenarClassificacaoComEstrategia([], "não é função")).toThrow(
      "Estratégia de critério deve ser uma função"
    );
  });
});

describe("CopaDoMundo - Template Method (executarFluxoValidacaoGol)", () => {
  test("deve chamar a checagem do VAR mockada e formatar o resultado", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const checagemVar = jest.fn().mockReturnValue("gol validado");

    // Act
    const resultado = copa.executarFluxoValidacaoGol({ jogador: "Vinícius Jr" }, checagemVar);

    // Assert
    expect(checagemVar).toHaveBeenCalledWith({ jogador: "Vinícius Jr" });
    expect(resultado).toBe("[gol de Vinícius Jr: gol validado]");
  });

  test("deve lançar erro quando faltam informações do gol", () => {
    // Arrange
    const copa = new CopaDoMundo();
    const checagemVar = jest.fn();

    // Act & Assert
    expect(() => copa.executarFluxoValidacaoGol(null, checagemVar)).toThrow(
      "Informações do gol são obrigatórias"
    );
    expect(checagemVar).not.toHaveBeenCalled();
  });

  test("deve lançar erro quando a checagem do VAR não é uma função", () => {
    // Arrange
    const copa = new CopaDoMundo();

    // Act & Assert
    expect(() => copa.executarFluxoValidacaoGol({ jogador: "Vinícius Jr" }, null)).toThrow(
      "Checagem do VAR deve ser uma função"
    );
  });
});