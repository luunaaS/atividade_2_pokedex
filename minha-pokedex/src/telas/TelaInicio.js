/**
 * Tela TelaInicio.
 * Tela principal do aplicativo que exibe a lista de Pokémon com paginação
 * e campo de busca por nome ou número.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { buscarListaPokemon, buscarDetalhesPokemon } from '../servicos/pokeApi';
import CartaoPokemon from '../componentes/CartaoPokemon';
import Carregando from '../componentes/Carregando';
import { CORES_APP } from '../constantes/cores';

const POKEMON_POR_PAGINA = 20;

export default function TelaInicio({ navigation }) {
  const [listaPokemon, setListaPokemon] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [deslocamento, setDeslocamento] = useState(0);
  const [totalPokemon, setTotalPokemon] = useState(0);
  const [textoBusca, setTextoBusca] = useState('');
  const [buscando, setBuscando] = useState(false);

  // Carrega a lista inicial de Pokémon
  useEffect(() => {
    carregarPokemon();
  }, []);

  async function carregarPokemon() {
    try {
      setCarregando(true);
      const dados = await buscarListaPokemon(POKEMON_POR_PAGINA, 0);
      setListaPokemon(dados.results);
      setTotalPokemon(dados.count);
      setDeslocamento(POKEMON_POR_PAGINA);
    } catch (erro) {
      console.error('Erro ao carregar Pokémon:', erro);
    } finally {
      setCarregando(false);
    }
  }

  // Carrega mais Pokémon ao rolar para baixo (paginação infinita)
  async function carregarMaisPokemon() {
    if (carregandoMais || deslocamento >= totalPokemon || textoBusca.length > 0) return;

    try {
      setCarregandoMais(true);
      const dados = await buscarListaPokemon(POKEMON_POR_PAGINA, deslocamento);
      setListaPokemon((anterior) => [...anterior, ...dados.results]);
      setDeslocamento((anterior) => anterior + POKEMON_POR_PAGINA);
    } catch (erro) {
      console.error('Erro ao carregar mais Pokémon:', erro);
    } finally {
      setCarregandoMais(false);
    }
  }

  // Realiza a busca por nome ou número
  async function realizarBusca() {
    if (!textoBusca.trim()) {
      carregarPokemon();
      return;
    }

    try {
      setBuscando(true);
      const dados = await buscarDetalhesPokemon(textoBusca.trim());
      if (dados) {
        navigation.navigate('Detalhes', { idPokemon: dados.id });
      }
    } catch (erro) {
      alert('Pokémon não encontrado. Verifique o nome ou número digitado.');
    } finally {
      setBuscando(false);
    }
  }

  function navegarParaDetalhes(idPokemon) {
    navigation.navigate('Detalhes', { idPokemon });
  }

  function renderizarItemPokemon({ item }) {
    return (
      <CartaoPokemon
        pokemon={item}
        aoPresionar={navegarParaDetalhes}
      />
    );
  }

  function renderizarRodape() {
    if (!carregandoMais) return null;
    return (
      <View style={estilos.rodapeLista}>
        <Carregando mensagem="Carregando mais Pokémon..." />
      </View>
    );
  }

  if (carregando) {
    return <Carregando mensagem="Carregando Pokédex..." />;
  }

  return (
    <SafeAreaView style={estilos.containerSeguro}>
      <View style={estilos.container}>
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>Pokédex</Text>
          <Text style={estilos.subtitulo}>
            {totalPokemon} Pokémon registrados
          </Text>
        </View>

        {/* Campo de Busca */}
        <View style={estilos.containerBusca}>
          <TextInput
            style={estilos.campoBusca}
            placeholder="Buscar por nome ou número..."
            placeholderTextColor={CORES_APP.cinzaEscuro}
            value={textoBusca}
            onChangeText={setTextoBusca}
            onSubmitEditing={realizarBusca}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={estilos.botaoBusca}
            onPress={realizarBusca}
            disabled={buscando}
          >
            <Text style={estilos.textoBotaoBusca}>
              {buscando ? '...' : '🔍'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Pokémon */}
        <FlatList
          data={listaPokemon}
          renderItem={renderizarItemPokemon}
          keyExtractor={(item) => item.name}
          onEndReached={carregarMaisPokemon}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderizarRodape}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={estilos.conteudoLista}
        />
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  containerSeguro: {
    flex: 1,
    backgroundColor: CORES_APP.vermelhoPrincipal,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: CORES_APP.fundoPadrao,
  },
  cabecalho: {
    backgroundColor: CORES_APP.vermelhoPrincipal,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: CORES_APP.branco,
  },
  subtitulo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  containerBusca: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: CORES_APP.vermelhoPrincipal,
    paddingBottom: 16,
  },
  campoBusca: {
    flex: 1,
    backgroundColor: CORES_APP.branco,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: CORES_APP.cinzaTexto,
    elevation: 2,
    shadowColor: CORES_APP.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  botaoBusca: {
    backgroundColor: CORES_APP.vermelhoEscuro,
    borderRadius: 25,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  textoBotaoBusca: {
    fontSize: 20,
  },
  conteudoLista: {
    paddingVertical: 8,
  },
  rodapeLista: {
    height: 80,
  },
});
