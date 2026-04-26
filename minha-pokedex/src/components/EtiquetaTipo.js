/**
 * Componente EtiquetaTipo.
 * Exibe uma etiqueta colorida com o tipo do Pokémon traduzido para português.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { traduzirTipo, obterCorTipo } from '../utilitarios/formatadores';
import { CORES_APP } from '../constantes/cores';

export default function EtiquetaTipo({ tipo, aoPresionar, selecionado = false, tamanho = 'medio' }) {
  const corFundo = obterCorTipo(tipo);
  const Componente = aoPresionar ? TouchableOpacity : View;

  const estilosTamanho = {
    pequeno: { paddingHorizontal: 8, paddingVertical: 3, fontSize: 10 },
    medio: { paddingHorizontal: 14, paddingVertical: 6, fontSize: 13 },
    grande: { paddingHorizontal: 20, paddingVertical: 8, fontSize: 16 },
  };

  const tamanhoAtual = estilosTamanho[tamanho] || estilosTamanho.medio;

  return (
    <Componente
      style={[
        estilos.container,
        {
          backgroundColor: corFundo,
          paddingHorizontal: tamanhoAtual.paddingHorizontal,
          paddingVertical: tamanhoAtual.paddingVertical,
          opacity: selecionado ? 1 : 0.85,
          borderWidth: selecionado ? 2 : 0,
          borderColor: CORES_APP.branco,
        },
      ]}
      onPress={aoPresionar}
      activeOpacity={0.7}
    >
      <Text style={[estilos.texto, { fontSize: tamanhoAtual.fontSize }]}>
        {traduzirTipo(tipo)}
      </Text>
    </Componente>
  );
}

const estilos = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },
  texto: {
    color: CORES_APP.branco,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
