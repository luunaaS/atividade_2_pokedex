/**
 * Componente CartaoEvolucao.
 * Exibe a cadeia de evolução de um Pokémon de forma visual com setas.
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { formatarNumeroPokemon } from '../utilitarios/formatadores';
import { CORES_APP } from '../constantes/cores';

export default function CartaoEvolucao({ evolucoes, aoPresionarPokemon }) {
  if (!evolucoes || evolucoes.length === 0) {
    return (
      <View style={estilos.containerVazio}>
        <Text style={estilos.textoVazio}>Este Pokémon não possui evoluções.</Text>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      {evolucoes.map((evolucao, indice) => (
        <View key={evolucao.id} style={estilos.itemEvolucao}>
          {indice > 0 && (
            <View style={estilos.containerSeta}>
              <Text style={estilos.seta}>▼</Text>
              {evolucao.detalhesEvolucao?.min_level && (
                <Text style={estilos.textoNivel}>
                  Nv. {evolucao.detalhesEvolucao.min_level}
                </Text>
              )}
              {evolucao.detalhesEvolucao?.item && (
                <Text style={estilos.textoNivel}>
                  {evolucao.detalhesEvolucao.item.name}
                </Text>
              )}
            </View>
          )}
          <TouchableOpacity
            style={estilos.cartaoPokemon}
            onPress={() => aoPresionarPokemon(evolucao.id)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: evolucao.imagem }}
              style={estilos.imagemPokemon}
              resizeMode="contain"
            />
            <Text style={estilos.nomePokemon}>{evolucao.nome}</Text>
            <Text style={estilos.numeroPokemon}>
              {formatarNumeroPokemon(evolucao.id)}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  containerVazio: {
    padding: 20,
    alignItems: 'center',
  },
  textoVazio: {
    fontSize: 14,
    color: CORES_APP.cinzaEscuro,
    fontStyle: 'italic',
  },
  itemEvolucao: {
    alignItems: 'center',
  },
  containerSeta: {
    alignItems: 'center',
    marginVertical: 6,
  },
  seta: {
    fontSize: 22,
    color: CORES_APP.cinzaEscuro,
  },
  textoNivel: {
    fontSize: 11,
    color: CORES_APP.cinzaEscuro,
    fontWeight: '600',
    marginTop: 2,
  },
  cartaoPokemon: {
    alignItems: 'center',
    backgroundColor: CORES_APP.branco,
    borderRadius: 16,
    padding: 12,
    width: 130,
    elevation: 3,
    shadowColor: CORES_APP.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  imagemPokemon: {
    width: 80,
    height: 80,
  },
  nomePokemon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: CORES_APP.cinzaTexto,
    marginTop: 4,
  },
  numeroPokemon: {
    fontSize: 11,
    color: CORES_APP.cinzaEscuro,
    marginTop: 2,
  },
});