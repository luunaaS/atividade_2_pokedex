/**
 * Componente BarraEstatistica.
 * Exibe uma barra de progresso visual para cada estatística do Pokémon.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { traduzirEstatistica } from '../utilitarios/formatadores';
import { CORES_APP } from '../constantes/cores';

export default function BarraEstatistica({ nomeEstatistica, valor, valorMaximo = 255 }) {
  const porcentagem = Math.min((valor / valorMaximo) * 100, 100);

  // Define a cor da barra com base no valor
  const obterCorBarra = (val) => {
    if (val >= 150) return '#4CAF50';
    if (val >= 100) return '#8BC34A';
    if (val >= 70) return '#FFC107';
    if (val >= 50) return '#FF9800';
    return '#F44336';
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.nomeEstatistica}>
        {traduzirEstatistica(nomeEstatistica)}
      </Text>
      <Text style={estilos.valorEstatistica}>{valor}</Text>
      <View style={estilos.containerBarra}>
        <View
          style={[
            estilos.barraPreenchida,
            {
              width: `${porcentagem}%`,
              backgroundColor: obterCorBarra(valor),
            },
          ]}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  nomeEstatistica: {
    width: 85,
    fontSize: 13,
    fontWeight: '600',
    color: CORES_APP.cinzaEscuro,
  },
  valorEstatistica: {
    width: 35,
    fontSize: 14,
    fontWeight: 'bold',
    color: CORES_APP.cinzaTexto,
    textAlign: 'right',
    marginRight: 10,
  },
  containerBarra: {
    flex: 1,
    height: 8,
    backgroundColor: CORES_APP.cinzaMedio,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barraPreenchida: {
    height: '100%',
    borderRadius: 4,
  },
});
