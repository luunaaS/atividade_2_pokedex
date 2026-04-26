import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { buscarPokemonPorTipo } from '../servicos/pokeApi';
import CartaoPokemon from '../componentes/CartaoPokemon';
import EtiquetaTipo from '../componentes/EtiquetaTipo';
import Carregando from '../componentes/Carregando';
import { CORES_TIPOS, TRADUCAO_TIPOS } from '../constantes/cores';
import { CORES_APP } from '../constantes/cores';
import { extrairIdDaUrl } from '../utilitarios/formatadores';

// Lista de tipos disponíveis para filtro
const TIPOS_DISPONIVEIS = Object.keys(CORES_TIPOS);

export default function TelaFiltros({ navigation }) {
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [listaPokemon, setListaPokemon] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [quantidadeTotal, setQuantidadeTotal] = useState(0);

  useEffect(() => {
    if (tipoSelecionado) {
      carregarPokemonPorTipo(tipoSelecionado);
    }
  }, [tipoSelecionado]);

  async function carregarPokemonPorTipo(tipo) {
    try {
      setCarregando(true);
      const dados = await buscarPokemonPorTipo(tipo);

      // Filtra apenas Pokémon com ID até 1010 (exclui formas alternativas)
      const pokemonFiltrados = dados.pokemon
        .map((p) => ({
          name: p.pokemon.name,
          url: p.pokemon.url,
          id: extrairIdDaUrl(p.pokemon.url),
        }))
        .filter((p) => p.id <= 1010)
        .sort((a, b) => a.id - b.id);

      setListaPokemon(pokemonFiltrados);
      setQuantidadeTotal(pokemonFiltrados.length);
    } catch (erro) {
      console.error('Erro ao carregar Pokémon por tipo:', erro);
    } finally {
      setCarregando(false);
    }
  }

  function selecionarTipo(tipo) {
    if (tipoSelecionado === tipo) {
      setTipoSelecionado(null);
      setListaPokemon([]);
      setQuantidadeTotal(0);
    } else {
      setTipoSelecionado(tipo);
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

  return (
    <SafeAreaView style={estilos.containerSeguro}>
      <View style={estilos.container}>
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>Filtrar por Tipo</Text>
          <Text style={estilos.subtitulo}>
            Selecione um tipo para ver os Pokémon
          </Text>
        </View>

        {/* Grade de Tipos */}
        <View style={estilos.containerTipos}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={estilos.listaTipos}
          >
            {TIPOS_DISPONIVEIS.map((tipo) => (
              <EtiquetaTipo
                key={tipo}
                tipo={tipo}
                selecionado={tipoSelecionado === tipo}
                aoPresionar={() => selecionarTipo(tipo)}
                tamanho="medio"
              />
            ))}
          </ScrollView>
        </View>

        {/* Informação do filtro ativo */}
        {tipoSelecionado && (
          <View style={estilos.infoFiltro}>
            <Text style={estilos.textoFiltro}>
              Tipo {TRADUCAO_TIPOS[tipoSelecionado]}: {quantidadeTotal} Pokémon encontrados
            </Text>
          </View>
        )}

        {/* Lista de Pokémon filtrados */}
        {carregando ? (
          <Carregando mensagem="Buscando Pokémon..." />
        ) : tipoSelecionado ? (
          <FlatList
            data={listaPokemon.slice(0, 50)}
            renderItem={renderizarItemPokemon}
            keyExtractor={(item) => item.name}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={estilos.conteudoLista}
            ListEmptyComponent={
              <View style={estilos.containerVazio}>
                <Text style={estilos.textoVazio}>
                  Nenhum Pokémon encontrado para este tipo.
                </Text>
              </View>
            }
          />
        ) : (
          <View style={estilos.containerInstrucao}>
            <Text style={estilos.emojiInstrucao}>🔍</Text>
            <Text style={estilos.textoInstrucao}>
              Selecione um tipo acima para filtrar os Pokémon
            </Text>
          </View>
        )}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: CORES_APP.branco,
  },
  subtitulo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  containerTipos: {
    backgroundColor: CORES_APP.vermelhoPrincipal,
    paddingBottom: 16,
  },
  listaTipos: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  infoFiltro: {
    backgroundColor: CORES_APP.branco,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: CORES_APP.cinzaMedio,
  },
  textoFiltro: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES_APP.cinzaTexto,
  },
  conteudoLista: {
    paddingVertical: 8,
  },
  containerVazio: {
    padding: 40,
    alignItems: 'center',
  },
  textoVazio: {
    fontSize: 16,
    color: CORES_APP.cinzaEscuro,
  },
  containerInstrucao: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emojiInstrucao: {
    fontSize: 48,
    marginBottom: 16,
  },
  textoInstrucao: {
    fontSize: 16,
    color: CORES_APP.cinzaEscuro,
    textAlign: 'center',
    lineHeight: 24,
  },
});