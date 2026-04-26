/**
 * Componente CartaoPokemon.
 * Exibe um card com a imagem, nome, número e tipos de um Pokémon na listagem.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { buscarDetalhesPokemon } from '../servicos/pokeApi';
import {
  formatarNumeroPokemon,
  capitalizarTexto,
  traduzirTipo,
  obterCorTipo,
  obterUrlImagemPokemon,
  extrairIdDaUrl,
} from '../utilitarios/formatadores';
import { CORES_APP } from '../constantes/cores';

export default function CartaoPokemon({ pokemon, aoPresionar }) {
  const [detalhes, setDetalhes] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const idPokemon = pokemon.id || extrairIdDaUrl(pokemon.url);

  useEffect(() => {
    async function carregarDetalhes() {
      try {
        if (pokemon.types) {
          setDetalhes(pokemon);
        } else {
          const dados = await buscarDetalhesPokemon(idPokemon);
          setDetalhes(dados);
        }
      } catch (erro) {
        console.error('Erro ao carregar detalhes:', erro);
      } finally {
        setCarregando(false);
      }
    }
    carregarDetalhes();
  }, [idPokemon]);

  const tipoPrincipal = detalhes?.types?.[0]?.type?.name || 'normal';
  const corFundo = obterCorTipo(tipoPrincipal);

  return (
    <TouchableOpacity
      style={[estilos.container, { backgroundColor: corFundo + 'DD' }]}
      onPress={() => aoPresionar(idPokemon)}
      activeOpacity={0.7}
    >
      <View style={estilos.informacoes}>
        <Text style={estilos.numero}>{formatarNumeroPokemon(idPokemon)}</Text>
        <Text style={estilos.nome}>
          {capitalizarTexto(pokemon.name)}
        </Text>
        <View style={estilos.containerTipos}>
          {detalhes?.types?.map((t) => (
            <View key={t.type.name} style={estilos.etiquetaTipo}>
              <Text style={estilos.textoTipo}>{traduzirTipo(t.type.name)}</Text>
            </View>
          ))}
        </View>
      </View>
      <Image
        source={{ uri: obterUrlImagemPokemon(idPokemon) }}
        style={estilos.imagem}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    alignItems: 'center',
    elevation: 4,
    shadowColor: CORES_APP.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  informacoes: {
    flex: 1,
  },
  numero: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.7)',
  },
  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CORES_APP.branco,
    marginTop: 2,
  },
  containerTipos: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  etiquetaTipo: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  textoTipo: {
    color: CORES_APP.branco,
    fontSize: 12,
    fontWeight: '600',
  },
  imagem: {
    width: 100,
    height: 100,
  },
});
