const TextoUtils = require("../src/textoUtils");

describe("TextoUtils", () => {
  test("deve inverter strings corretamente", () => {
    
    const util = new TextoUtils();


    const invertida = util.inverter("abc");
    const invertidaVazia = util.inverter("");

 
    expect(invertida).toBe("cba");
    expect(invertidaVazia).toBe("");
  });

  test("deve verificar se uma string é palíndromo", () => {
   
    const util = new TextoUtils();

   
    const palindromoComEspacos = util.ehPalindromo("Ame a ema");
    const palindromoComPontuacao = util.ehPalindromo("A base do teto desaba");
    const naoPalindromo = util.ehPalindromo("Javascript");

  
    expect(palindromoComEspacos).toBe(true);
    expect(palindromoComPontuacao).toBe(true);
    expect(naoPalindromo).toBe(false);
  });

  test("deve capitalizar a primeira letra de cada palavra", () => {
    
    const util = new TextoUtils();

   
    const capitalizado = util.capitalizar("maria da silva");
    const capitalizadoMaiusculo = util.capitalizar("JOÃO PEDRO");
    const comEspacoDuplo = util.capitalizar("ana  paula");

    
    expect(capitalizado).toBe("Maria Da Silva");
    expect(capitalizadoMaiusculo).toBe("João Pedro");
    expect(comEspacoDuplo).toBe("Ana  Paula");
  });

  test("deve contar ocorrências de uma substring", () => {
    
    const util = new TextoUtils();

   
    const ocorrencias = util.contarOcorrencias("banana", "na");
    const semOcorrencias = util.contarOcorrencias("banana", "xy");
    const substringVazia = util.contarOcorrencias("banana", "");

   
    expect(ocorrencias).toBe(2);
    expect(semOcorrencias).toBe(0);
    expect(substringVazia).toBe(0);
  });

  test("deve remover espaços em branco extras", () => {
  
    const util = new TextoUtils();

  
    const semExtras = util.removerEspacosExtras("  oi   tudo   bem  ");


    expect(semExtras).toBe("oi tudo bem");
  });

  test("deve converter texto para slug", () => {

    const util = new TextoUtils();

    const slug = util.paraSlug("Olá Mundo!");
    const slugComAcentos = util.paraSlug("Ação e Reação");
    const slugComEspacosExtras = util.paraSlug("  texto   com espaços  ");

   
    expect(slug).toBe("ola-mundo");
    expect(slugComAcentos).toBe("acao-e-reacao");
    expect(slugComEspacosExtras).toBe("texto-com-espacos");
  });

  test("deve truncar texto respeitando o tamanho máximo", () => {

    const util = new TextoUtils();

 
    const truncado = util.truncar("Texto muito longo para exibir", 10);
    const semTruncar = util.truncar("curto", 10);
    const acaoTamanhoNegativo = () => util.truncar("abc", -1);

  
    expect(truncado).toBe("Texto muit...");
    expect(semTruncar).toBe("curto");
    expect(acaoTamanhoNegativo).toThrow("O tamanho não pode ser negativo");
  });

  test("deve contar o número de palavras em um texto", () => {
 
    const util = new TextoUtils();


    const palavras = util.contarPalavras("  um   dois tres ");
    const semPalavras = util.contarPalavras("   ");


    expect(palavras).toBe(3);
    expect(semPalavras).toBe(0);
  });

  test("deve verificar se uma string contém somente letras", () => {
   
    const util = new TextoUtils();

 
    const somenteLetras = util.somenteLetras("Maria");
    const comAcentos = util.somenteLetras("São Paulo".replace(" ", ""));
    const comNumeros = util.somenteLetras("Maria123");
    const comEspaco = util.somenteLetras("Maria Silva");


    expect(somenteLetras).toBe(true);
    expect(comAcentos).toBe(true);
    expect(comNumeros).toBe(false);
    expect(comEspaco).toBe(false);
  });

  test("deve substituir todas as ocorrências de uma substring", () => {
   
    const util = new TextoUtils();

 
    const substituido = util.substituirTudo("banana", "na", "NA");
    const acaoAlvoVazio = () => util.substituirTudo("banana", "", "x");

    expect(substituido).toBe("baNANA");
    expect(acaoAlvoVazio).toThrow("O alvo não pode ser vazio");
  });
});