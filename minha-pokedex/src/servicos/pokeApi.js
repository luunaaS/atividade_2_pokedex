/**
 * Serviço de consumo da PokéAPI.
 * Responsável por todas as requisições HTTP à API de Pokémon.
 * Documentação da API: https://pokeapi.co/docs/v2
 */

import axios from 'axios';

const URL_BASE = 'https://pokeapi.co/api/v2';

// Instância do axios configurada para a PokéAPI
const clienteApi = axios.create({
  baseURL: URL_BASE,
  timeout: 15000,
});

/**
 * Busca uma lista paginada de Pokémon.
 * @param {number} limite - Quantidade de Pokémon por página.
 * @param {number} deslocamento - Offset para paginação.
 * @returns {Promise<Object>} Lista de Pokémon com contagem total.
 */
export async function buscarListaPokemon(limite = 20, deslocamento = 0) {
  try {
    const resposta = await clienteApi.get('/pokemon', {
      params: { limit: limite, offset: deslocamento },
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar lista de Pokémon:', erro.message);
    throw erro;
  }
}

/**
 * Busca os detalhes completos de um Pokémon pelo nome ou ID.
 * @param {string|number} identificador - Nome ou ID do Pokémon.
 * @returns {Promise<Object>} Dados detalhados do Pokémon.
 */
export async function buscarDetalhesPokemon(identificador) {
  try {
    const idFormatado = typeof identificador === 'string'
      ? identificador.toLowerCase().trim()
      : identificador;
    const resposta = await clienteApi.get(`/pokemon/${idFormatado}`);
    return resposta.data;
  } catch (erro) {
    console.error(`Erro ao buscar detalhes do Pokémon ${identificador}:`, erro.message);
    throw erro;
  }
}

/**
 * Busca os dados da espécie de um Pokémon (descrição, taxa de captura, etc.).
 * @param {number} id - ID do Pokémon.
 * @returns {Promise<Object>} Dados da espécie.
 */
export async function buscarEspeciePokemon(id) {
  try {
    const resposta = await clienteApi.get(`/pokemon-species/${id}`);
    return resposta.data;
  } catch (erro) {
    console.error(`Erro ao buscar espécie do Pokémon ${id}:`, erro.message);
    throw erro;
  }
}

/**
 * Busca a cadeia de evolução de um Pokémon.
 * @param {string} url - URL completa da cadeia de evolução.
 * @returns {Promise<Object>} Dados da cadeia de evolução.
 */
export async function buscarCadeiaEvolucao(url) {
  try {
    const resposta = await axios.get(url);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar cadeia de evolução:', erro.message);
    throw erro;
  }
}

/**
 * Busca todos os Pokémon de um tipo específico.
 * @param {string} tipo - Nome do tipo (ex: fire, water, grass).
 * @returns {Promise<Object>} Lista de Pokémon do tipo especificado.
 */
export async function buscarPokemonPorTipo(tipo) {
  try {
    const resposta = await clienteApi.get(`/type/${tipo.toLowerCase()}`);
    return resposta.data;
  } catch (erro) {
    console.error(`Erro ao buscar Pokémon do tipo ${tipo}:`, erro.message);
    throw erro;
  }
}

/**
 * Busca a lista de todos os tipos de Pokémon disponíveis.
 * @returns {Promise<Object>} Lista de tipos.
 */
export async function buscarTodosTipos() {
  try {
    const resposta = await clienteApi.get('/type');
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar tipos de Pokémon:', erro.message);
    throw erro;
  }
}

/**
 * Busca os detalhes de uma habilidade específica.
 * @param {string} url - URL completa da habilidade.
 * @returns {Promise<Object>} Dados da habilidade.
 */
export async function buscarHabilidade(url) {
  try {
    const resposta = await axios.get(url);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar habilidade:', erro.message);
    throw erro;
  }
}
