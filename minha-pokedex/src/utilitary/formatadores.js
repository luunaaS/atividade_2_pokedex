/**
 * Utilitários de formatação e operações sobre dados de Pokémon.
 * Inclui funções de transformação, cálculo e análise dos dados da API.
 */

import { TRADUCAO_TIPOS, TRADUCAO_ESTATISTICAS, CORES_TIPOS } from '../constantes/cores';

/**
 * Formata o número de identificação do Pokémon com zeros à esquerda.
 * @param {number} id - ID do Pokémon.
 * @returns {string} ID formatado (ex: #001, #025, #150).
 */
export function formatarNumeroPokemon(id) {
  return `#${String(id).padStart(3, '0')}`;
}

/**
 * Capitaliza a primeira letra de uma string.
 * @param {string} texto - Texto a ser capitalizado.
 * @returns {string} Texto com a primeira letra maiúscula.
 */
export function capitalizarTexto(texto) {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Traduz o nome do tipo de Pokémon para português.
 * @param {string} tipoIngles - Nome do tipo em inglês.
 * @returns {string} Nome do tipo em português.
 */
export function traduzirTipo(tipoIngles) {
  return TRADUCAO_TIPOS[tipoIngles] || capitalizarTexto(tipoIngles);
}

/**
 * Traduz o nome da estatística para português.
 * @param {string} estatisticaIngles - Nome da estatística em inglês.
 * @returns {string} Nome da estatística em português.
 */
export function traduzirEstatistica(estatisticaIngles) {
  return TRADUCAO_ESTATISTICAS[estatisticaIngles] || capitalizarTexto(estatisticaIngles);
}

/**
 * Obtém a cor associada a um tipo de Pokémon.
 * @param {string} tipo - Nome do tipo em inglês.
 * @returns {string} Código hexadecimal da cor.
 */
export function obterCorTipo(tipo) {
  return CORES_TIPOS[tipo] || '#A8A77A';
}

/**
 * Extrai a URL da imagem oficial do Pokémon (artwork).
 * @param {number} id - ID do Pokémon.
 * @returns {string} URL da imagem.
 */
export function obterUrlImagemPokemon(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Extrai o ID do Pokémon a partir da URL da API.
 * @param {string} url - URL do recurso na PokéAPI.
 * @returns {number} ID extraído.
 */
export function extrairIdDaUrl(url) {
  const partes = url.split('/').filter(Boolean);
  return parseInt(partes[partes.length - 1], 10);
}

/**
 * Converte a altura do Pokémon de decímetros para metros.
 * @param {number} alturaDecimetros - Altura em decímetros.
 * @returns {string} Altura formatada em metros.
 */
export function formatarAltura(alturaDecimetros) {
  const metros = alturaDecimetros / 10;
  return `${metros.toFixed(1)} m`;
}

/**
 * Converte o peso do Pokémon de hectogramas para quilogramas.
 * @param {number} pesoHectogramas - Peso em hectogramas.
 * @returns {string} Peso formatado em quilogramas.
 */
export function formatarPeso(pesoHectogramas) {
  const quilogramas = pesoHectogramas / 10;
  return `${quilogramas.toFixed(1)} kg`;
}

/**
 * OPERAÇÃO SOBRE DADOS: Calcula o total base de estatísticas (BST) de um Pokémon.
 * O BST é a soma de todas as estatísticas base e é usado para avaliar o poder geral.
 * @param {Array} estatisticas - Array de estatísticas do Pokémon.
 * @returns {number} Total base de estatísticas.
 */
export function calcularTotalEstatisticas(estatisticas) {
  return estatisticas.reduce((total, est) => total + est.base_stat, 0);
}

/**
 * OPERAÇÃO SOBRE DADOS: Classifica o Pokémon com base no BST (Base Stat Total).
 * Retorna uma classificação textual do poder do Pokémon.
 * @param {number} totalBase - Total base de estatísticas.
 * @returns {Object} Objeto com classificação e cor.
 */
export function classificarPoderPokemon(totalBase) {
  if (totalBase >= 600) {
    return { classificacao: 'Lendário', cor: '#FFD700', emoji: '⭐' };
  } else if (totalBase >= 500) {
    return { classificacao: 'Muito Forte', cor: '#FF6B35', emoji: '🔥' };
  } else if (totalBase >= 400) {
    return { classificacao: 'Forte', cor: '#4CAF50', emoji: '💪' };
  } else if (totalBase >= 300) {
    return { classificacao: 'Médio', cor: '#2196F3', emoji: '⚡' };
  } else {
    return { classificacao: 'Iniciante', cor: '#9E9E9E', emoji: '🌱' };
  }
}

/**
 * OPERAÇÃO SOBRE DADOS: Compara dois Pokémon estatística por estatística.
 * Retorna um objeto com o vencedor de cada estatística e o vencedor geral.
 * @param {Object} pokemon1 - Dados do primeiro Pokémon.
 * @param {Object} pokemon2 - Dados do segundo Pokémon.
 * @returns {Object} Resultado da comparação detalhada.
 */
export function compararPokemon(pokemon1, pokemon2) {
  const comparacao = {
    nome1: capitalizarTexto(pokemon1.name),
    nome2: capitalizarTexto(pokemon2.name),
    estatisticas: [],
    vitorias1: 0,
    vitorias2: 0,
    empates: 0,
  };

  pokemon1.stats.forEach((est, indice) => {
    const valor1 = est.base_stat;
    const valor2 = pokemon2.stats[indice].base_stat;
    const nomeEstatistica = traduzirEstatistica(est.stat.name);

    let vencedor = 'empate';
    if (valor1 > valor2) {
      vencedor = 'pokemon1';
      comparacao.vitorias1++;
    } else if (valor2 > valor1) {
      vencedor = 'pokemon2';
      comparacao.vitorias2++;
    } else {
      comparacao.empates++;
    }

    comparacao.estatisticas.push({
      nome: nomeEstatistica,
      valor1,
      valor2,
      diferenca: valor1 - valor2,
      vencedor,
    });
  });

  const total1 = calcularTotalEstatisticas(pokemon1.stats);
  const total2 = calcularTotalEstatisticas(pokemon2.stats);

  comparacao.total1 = total1;
  comparacao.total2 = total2;

  if (total1 > total2) {
    comparacao.vencedorGeral = 'pokemon1';
  } else if (total2 > total1) {
    comparacao.vencedorGeral = 'pokemon2';
  } else {
    comparacao.vencedorGeral = 'empate';
  }

  return comparacao;
}

/**
 * OPERAÇÃO SOBRE DADOS: Analisa os pontos fortes e fracos de um Pokémon.
 * Identifica a melhor e pior estatística e gera uma análise textual.
 * @param {Array} estatisticas - Array de estatísticas do Pokémon.
 * @returns {Object} Análise com pontos fortes, fracos e recomendações.
 */
export function analisarPontosFortesEFracos(estatisticas) {
  const estatisticasOrdenadas = [...estatisticas].sort(
    (a, b) => b.base_stat - a.base_stat
  );

  const melhor = estatisticasOrdenadas[0];
  const pior = estatisticasOrdenadas[estatisticasOrdenadas.length - 1];

  const total = calcularTotalEstatisticas(estatisticas);
  const media = total / estatisticas.length;

  const pontosFortes = estatisticasOrdenadas
    .filter((e) => e.base_stat >= media)
    .map((e) => traduzirEstatistica(e.stat.name));

  const pontosFracos = estatisticasOrdenadas
    .filter((e) => e.base_stat < media)
    .map((e) => traduzirEstatistica(e.stat.name));

  return {
    melhorEstatistica: {
      nome: traduzirEstatistica(melhor.stat.name),
      valor: melhor.base_stat,
    },
    piorEstatistica: {
      nome: traduzirEstatistica(pior.stat.name),
      valor: pior.base_stat,
    },
    mediaEstatisticas: Math.round(media),
    totalBase: total,
    pontosFortes,
    pontosFracos,
    classificacao: classificarPoderPokemon(total),
  };
}

/**
 * OPERAÇÃO SOBRE DADOS: Processa a cadeia de evolução em formato linear.
 * Transforma a estrutura aninhada da API em um array plano de evoluções.
 * @param {Object} cadeia - Objeto da cadeia de evolução da API.
 * @returns {Array} Array linear com as etapas de evolução.
 */
export function processarCadeiaEvolucao(cadeia) {
  const evolucoes = [];

  function percorrerCadeia(elo) {
    const id = extrairIdDaUrl(elo.species.url);
    evolucoes.push({
      nome: capitalizarTexto(elo.species.name),
      id,
      imagem: obterUrlImagemPokemon(id),
      detalhesEvolucao: elo.evolution_details.length > 0
        ? elo.evolution_details[0]
        : null,
    });

    if (elo.evolves_to && elo.evolves_to.length > 0) {
      elo.evolves_to.forEach((proximoElo) => {
        percorrerCadeia(proximoElo);
      });
    }
  }

  percorrerCadeia(cadeia);
  return evolucoes;
}

/**
 * Extrai a descrição em português do Pokémon (ou inglês como fallback).
 * @param {Array} entradasTexto - Array de flavor_text_entries da API.
 * @returns {string} Descrição do Pokémon.
 */
export function extrairDescricaoPokemon(entradasTexto) {
  // Tenta encontrar em português primeiro
  const descricaoPt = entradasTexto.find(
    (entrada) => entrada.language.name === 'pt' || entrada.language.name === 'pt-BR'
  );

  if (descricaoPt) {
    return descricaoPt.flavor_text.replace(/\n|\f/g, ' ');
  }

  // Fallback para inglês
  const descricaoEn = entradasTexto.find(
    (entrada) => entrada.language.name === 'en'
  );

  if (descricaoEn) {
    return descricaoEn.flavor_text.replace(/\n|\f/g, ' ');
  }

  return 'Descrição não disponível.';
}
