/**
 * Componente Carregando.
 * Exibe um indicador de carregamento centralizado na tela.
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { CORES_APP } from '../constantes/cores';

export default function Carregando({ mensagem = 'Carregando...' }) {
  return (
    <View style={estilos.container}>
      <ActivityIndicator size="large" color={CORES_APP.vermelhoPrincipal} />
      <Text style={estilos.texto}>{mensagem}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CORES_APP.fundoPadrao,
  },
  texto: {
    marginTop: 12,
    fontSize: 16,
    color: CORES_APP.cinzaEscuro,
  },
});
