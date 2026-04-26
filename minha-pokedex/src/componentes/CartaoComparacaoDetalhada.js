/**
 * Componente CartaoComparacaoDetalhada.
 * Exibe uma análise detalhada da comparação entre dois Pokémon,
 * incluindo vantagens de tipo e recomendações de batalha.
 * Esta é uma OPERAÇÃO avançada sobre os dados consultados da API.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CORES_APP } from '../constantes/cores';
import { traduzirTipo } from '../utilitarios/formatadores';

/**
 * OPERAÇÃO SOBRE DADOS: Calcula a efetividade de tipos entre dois Pokémon.
 * Baseado na tabela de tipos do universo Pokémon.
 */
const TABELA_EFETIVIDADE = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

/**
 * Calcula a efetividade de ataque de um tipo contra os tipos do defensor.
 */
function calcularEfetividade(tipoAtacante, tiposDefensor) {
  let multiplicador = 1;
  tiposDefensor.forEach((tipoDefensor) => {
    const efetividade = TABELA_EFETIVIDADE[tipoAtacante]?.[tipoDefensor];
    if (efetividade !== undefined) {
      multiplicador *= efetividade;
    }
  });
  return multiplicador;
}

/**
 * Gera a análise de vantagem de tipo entre dois Pokémon.
 */
function analisarVantagemTipo(tipos1, tipos2) {
  const vantagensAtaque1 = [];
  const vantagensAtaque2 = [];

  tipos1.forEach((tipo) => {
    const efetividade = calcularEfetividade(tipo, tipos2);
    if (efetividade > 1) {
      vantagensAtaque1.push({ tipo, efetividade });
    }
  });

  tipos2.forEach((tipo) => {
    const efetividade = calcularEfetividade(tipo, tipos1);
    if (efetividade > 1) {
      vantagensAtaque2.push({ tipo, efetividade });
    }
  });

  return { vantagensAtaque1, vantagensAtaque2 };
}

export default function CartaoComparacaoDetalhada({ pokemon1, pokemon2, comparacao }) {
  if (!pokemon1 || !pokemon2 || !comparacao) return null;

  const tipos1 = pokemon1.types.map((t) => t.type.name);
  const tipos2 = pokemon2.types.map((t) => t.type.name);
  const { vantagensAtaque1, vantagensAtaque2 } = analisarVantagemTipo(tipos1, tipos2);

  // Determina quem é mais rápido (importante em batalhas)
  const velocidade1 = pokemon1.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0;
  const velocidade2 = pokemon2.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0;

  // Calcula o índice ofensivo e defensivo
  const ataque1 = pokemon1.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0;
  const atqEsp1 = pokemon1.stats.find((s) => s.stat.name === 'special-attack')?.base_stat || 0;
  const defesa1 = pokemon1.stats.find((s) => s.stat.name === 'defense')?.base_stat || 0;
  const defEsp1 = pokemon1.stats.find((s) => s.stat.name === 'special-defense')?.base_stat || 0;

  const ataque2 = pokemon2.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0;
  const atqEsp2 = pokemon2.stats.find((s) => s.stat.name === 'special-attack')?.base_stat || 0;
  const defesa2 = pokemon2.stats.find((s) => s.stat.name === 'defense')?.base_stat || 0;
  const defEsp2 = pokemon2.stats.find((s) => s.stat.name === 'special-defense')?.base_stat || 0;

  const indiceOfensivo1 = Math.max(ataque1, atqEsp1);
  const indiceOfensivo2 = Math.max(ataque2, atqEsp2);
  const indiceDefensivo1 = Math.round((defesa1 + defEsp1) / 2);
  const indiceDefensivo2 = Math.round((defesa2 + defEsp2) / 2);

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Análise de Batalha</Text>

      {/* Vantagem de Tipo */}
      <View style={estilos.secao}>
        <Text style={estilos.tituloSecao}>Vantagem de Tipo</Text>

        {vantagensAtaque1.length > 0 ? (
          <View style={estilos.linhaVantagem}>
            <Text style={estilos.textoVantagem}>
              {comparacao.nome1} tem vantagem com:{' '}
              {vantagensAtaque1
                .map((v) => `${traduzirTipo(v.tipo)} (${v.efetividade}x)`)
                .join(', ')}
            </Text>
          </View>
        ) : (
          <Text style={estilos.textoNeutro}>
            {comparacao.nome1} não tem vantagem de tipo
          </Text>
        )}

        {vantagensAtaque2.length > 0 ? (
          <View style={estilos.linhaVantagem}>
            <Text style={estilos.textoVantagem}>
              {comparacao.nome2} tem vantagem com:{' '}
              {vantagensAtaque2
                .map((v) => `${traduzirTipo(v.tipo)} (${v.efetividade}x)`)
                .join(', ')}
            </Text>
          </View>
        ) : (
          <Text style={estilos.textoNeutro}>
            {comparacao.nome2} não tem vantagem de tipo
          </Text>
        )}
      </View>

      {/* Análise Tática */}
      <View style={estilos.secao}>
        <Text style={estilos.tituloSecao}>Análise Tática</Text>

        <View style={estilos.linhaTatica}>
          <Text style={estilos.rotuloTatica}>Mais rápido:</Text>
          <Text style={estilos.valorTatica}>
            {velocidade1 > velocidade2
              ? `${comparacao.nome1} (${velocidade1})`
              : velocidade2 > velocidade1
              ? `${comparacao.nome2} (${velocidade2})`
              : `Empate (${velocidade1})`}
          </Text>
        </View>

        <View style={estilos.linhaTatica}>
          <Text style={estilos.rotuloTatica}>Maior poder ofensivo:</Text>
          <Text style={estilos.valorTatica}>
            {indiceOfensivo1 > indiceOfensivo2
              ? `${comparacao.nome1} (${indiceOfensivo1})`
              : indiceOfensivo2 > indiceOfensivo1
              ? `${comparacao.nome2} (${indiceOfensivo2})`
              : `Empate (${indiceOfensivo1})`}
          </Text>
        </View>

        <View style={estilos.linhaTatica}>
          <Text style={estilos.rotuloTatica}>Mais resistente:</Text>
          <Text style={estilos.valorTatica}>
            {indiceDefensivo1 > indiceDefensivo2
              ? `${comparacao.nome1} (${indiceDefensivo1})`
              : indiceDefensivo2 > indiceDefensivo1
              ? `${comparacao.nome2} (${indiceDefensivo2})`
              : `Empate (${indiceDefensivo1})`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    backgroundColor: CORES_APP.branco,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    elevation: 2,
    shadowColor: CORES_APP.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CORES_APP.cinzaTexto,
    marginBottom: 12,
    textAlign: 'center',
  },
  secao: {
    marginBottom: 12,
  },
  tituloSecao: {
    fontSize: 14,
    fontWeight: 'bold',
    color: CORES_APP.vermelhoPrincipal,
    marginBottom: 8,
  },
  linhaVantagem: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  textoVantagem: {
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 18,
  },
  textoNeutro: {
    fontSize: 13,
    color: CORES_APP.cinzaEscuro,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  linhaTatica: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: CORES_APP.cinzaMedio,
  },
  rotuloTatica: {
    fontSize: 13,
    color: CORES_APP.cinzaEscuro,
  },
  valorTatica: {
    fontSize: 13,
    fontWeight: '600',
    color: CORES_APP.cinzaTexto,
  },
});
