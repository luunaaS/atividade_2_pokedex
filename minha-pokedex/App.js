/**
 * App.js - Ponto de entrada do aplicativo Pokédex.
 *
 * Aplicativo mobile desenvolvido em React Native + Expo que consome a PokéAPI
 * para exibir informações sobre Pokémon, incluindo:
 * - Listagem com paginação infinita
 * - Busca por nome ou número
 * - Filtros por tipo
 * - Detalhes completos (estatísticas, habilidades, evolução)
 * - Análise de pontos fortes e fracos (operação sobre dados)
 * - Comparação entre dois Pokémon (operação sobre dados)
 *
 * API consumida: https://pokeapi.co/
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import NavegacaoPrincipal from './src/navegacao/NavegacaoPrincipal';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavegacaoPrincipal />
    </>
  );
}