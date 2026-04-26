/**
 * Componente CartaoAnalise.
 * Exibe a análise de pontos fortes e fracos de um Pokémon.
 * Esta é uma das operações realizadas sobre os dados consultados da API.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CORES_APP } from '../constantes/cores';

export default function CartaoAnalise({ analise }) {
  if (!analise) return null;

  return (
    <View style={estilos.container}>
      {/* Classificação de Poder */}
      <View style={[estilos.cartaoClassificacao, { borderLeftColor: analise.classificacao.cor }]}>
        <Text style={estilos.emojiClassificacao}>{analise.classificacao.emoji}</Text>
        <View style={estilos.infoClassificacao}>
          <Text style={estilos.tituloClassificacao}>Classificação de Poder</Text>
          <Text style={[estilos.valorClassificacao, { color: analise.classificacao.cor }]}>
            {analise.classificacao.classificacao}
          </Text>
          <Text style={estilos.totalBase}>
            Total Base: {analise.totalBase} | Média: {analise.mediaEstatisticas}
          </Text>
        </View>
      </View>

      {/* Melhor Estatística */}
      <View style={estilos.cartaoEstatistica}>
        <Text style={estilos.iconeEstatistica}>🏆</Text>
        <View style={estilos.infoEstatistica}>
          <Text style={estilos.rotuloEstatistica}>Melhor Estatística</Text>
          <Text style={estilos.nomeEstatistica}>
            {analise.melhorEstatistica.nome}: {analise.melhorEstatistica.valor}
          </Text>
        </View>
      </View>

      {/* Pior Estatística */}
      <View style={estilos.cartaoEstatistica}>
        <Text style={estilos.iconeEstatistica}>⚠️</Text>
        <View style={estilos.infoEstatistica}>
          <Text style={estilos.rotuloEstatistica}>Ponto Fraco</Text>
          <Text style={estilos.nomeEstatistica}>
            {analise.piorEstatistica.nome}: {analise.piorEstatistica.valor}
          </Text>
        </View>
      </View>

      {/* Pontos Fortes */}
      <View style={estilos.secao}>
        <Text style={estilos.tituloSecao}>Pontos Fortes</Text>
        <View style={estilos.containerEtiquetas}>
          {analise.pontosFortes.map((ponto) => (
            <View key={ponto} style={[estilos.etiqueta, estilos.etiquetaForte]}>
              <Text style={estilos.textoEtiquetaForte}>{ponto}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Pontos Fracos */}
      {analise.pontosFracos.length > 0 && (
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Pontos Fracos</Text>
          <View style={estilos.containerEtiquetas}>
            {analise.pontosFracos.map((ponto) => (
              <View key={ponto} style={[estilos.etiqueta, estilos.etiquetaFraco]}>
                <Text style={estilos.textoEtiquetaFraco}>{ponto}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cartaoClassificacao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES_APP.branco,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: CORES_APP.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emojiClassificacao: {
    fontSize: 32,
    marginRight: 12,
  },
  infoClassificacao: {
    flex: 1,
  },
  tituloClassificacao: {
    fontSize: 12,
    color: CORES_APP.cinzaEscuro,
    fontWeight: '600',
  },
  valorClassificacao: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
  },
  totalBase: {
    fontSize: 12,
    color: CORES_APP.cinzaEscuro,
    marginTop: 2,
  },
  cartaoEstatistica: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES_APP.branco,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: CORES_APP.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  iconeEstatistica: {
    fontSize: 24,
    marginRight: 12,
  },
  infoEstatistica: {
    flex: 1,
  },
  rotuloEstatistica: {
    fontSize: 11,
    color: CORES_APP.cinzaEscuro,
    fontWeight: '600',
  },
  nomeEstatistica: {
    fontSize: 15,
    fontWeight: 'bold',
    color: CORES_APP.cinzaTexto,
    marginTop: 2,
  },
  secao: {
    marginTop: 10,
  },
  tituloSecao: {
    fontSize: 14,
    fontWeight: 'bold',
    color: CORES_APP.cinzaTexto,
    marginBottom: 6,
  },
  containerEtiquetas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  etiqueta: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
  },
  etiquetaForte: {
    backgroundColor: '#E8F5E9',
  },
  textoEtiquetaForte: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '600',
  },
  etiquetaFraco: {
    backgroundColor: '#FFF3E0',
  },
  textoEtiquetaFraco: {
    color: '#E65100',
    fontSize: 12,
    fontWeight: '600',
  },
});
