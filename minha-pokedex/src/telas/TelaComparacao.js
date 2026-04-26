/**
 * Tela TelaComparacao.
 * Permite ao usuário selecionar dois Pokémon e compará-los estatística por estatística.
 * Esta é a principal OPERAÇÃO SOBRE OS DADOS consultados da API.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { buscarDetalhesPokemon } from '../servicos/pokeApi';
import Carregando from '../componentes/Carregando';
import CartaoComparacaoDetalhada from '../componentes/CartaoComparacaoDetalhada';
import {
  capitalizarTexto,
  formatarNumeroPokemon,
  obterUrlImagemPokemon,
  obterCorTipo,
  traduzirEstatistica,
  compararPokemon,
  calcularTotalEstatisticas,
  classificarPoderPokemon,
} from '../utilitarios/formatadores';
import { CORES_APP } from '../constantes/cores';

export default function TelaComparacao({ route, navigation }) {
  const pokemonPreSelecionado = route.params?.pokemonPreSelecionado || null;

  const [buscaPokemon1, setBuscaPokemon1] = useState(
    pokemonPreSelecionado ? pokemonPreSelecionado.name : ''
  );
  const [buscaPokemon2, setBuscaPokemon2] = useState('');
  const [pokemon1, setPokemon1] = useState(pokemonPreSelecionado);
  const [pokemon2, setPokemon2] = useState(null);
  const [resultadoComparacao, setResultadoComparacao] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Busca um Pokémon pelo nome ou número
  async function buscarPokemon(identificador, setPokemon) {
    if (!identificador.trim()) return;
    try {
      setCarregando(true);
      const dados = await buscarDetalhesPokemon(identificador.trim());
      setPokemon(dados);
    } catch (erro) {
      Alert.alert(
        'Pokémon não encontrado',
        'Verifique o nome ou número digitado e tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }

  // Realiza a comparação quando ambos os Pokémon estão selecionados
  useEffect(() => {
    if (pokemon1 && pokemon2) {
      const resultado = compararPokemon(pokemon1, pokemon2);
      setResultadoComparacao(resultado);
    } else {
      setResultadoComparacao(null);
    }
  }, [pokemon1, pokemon2]);

  function renderizarSeletorPokemon(
    busca,
    setBusca,
    pokemon,
    setPokemon,
    rotulo
  ) {
    return (
      <View style={estilos.seletor}>
        <Text style={estilos.rotuloSeletor}>{rotulo}</Text>
        <View style={estilos.containerInput}>
          <TextInput
            style={estilos.campoTexto}
            placeholder="Nome ou nº"
            placeholderTextColor={CORES_APP.cinzaEscuro}
            value={busca}
            onChangeText={setBusca}
            onSubmitEditing={() => buscarPokemon(busca, setPokemon)}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={estilos.botaoBuscar}
            onPress={() => buscarPokemon(busca, setPokemon)}
          >
            <Text style={estilos.textoBotaoBuscar}>OK</Text>
          </TouchableOpacity>
        </View>

        {pokemon && (
          <View style={estilos.previewPokemon}>
            <Image
              source={{ uri: obterUrlImagemPokemon(pokemon.id) }}
              style={estilos.imagemPreview}
              resizeMode="contain"
            />
            <Text style={estilos.nomePreview}>
              {capitalizarTexto(pokemon.name)}
            </Text>
            <Text style={estilos.numeroPreview}>
              {formatarNumeroPokemon(pokemon.id)}
            </Text>
          </View>
        )}
      </View>
    );
  }

  function renderizarBarraComparacao(estatistica) {
    const maxValor = Math.max(estatistica.valor1, estatistica.valor2, 1);
    const porcentagem1 = (estatistica.valor1 / 255) * 100;
    const porcentagem2 = (estatistica.valor2 / 255) * 100;

    const cor1 = obterCorTipo(pokemon1.types[0].type.name);
    const cor2 = obterCorTipo(pokemon2.types[0].type.name);

    return (
      <View key={estatistica.nome} style={estilos.linhaComparacao}>
        <Text style={[estilos.valorComparacao, { color: cor1 }]}>
          {estatistica.valor1}
        </Text>

        <View style={estilos.containerBarras}>
          <Text style={estilos.nomeEstatisticaComparacao}>{estatistica.nome}</Text>
          <View style={estilos.duasBarras}>
            <View style={estilos.barraEsquerda}>
              <View
                style={[
                  estilos.preenchimentoEsquerda,
                  {
                    width: `${porcentagem1}%`,
                    backgroundColor:
                      estatistica.vencedor === 'pokemon1' ? cor1 : cor1 + '80',
                  },
                ]}
              />
            </View>
            <View style={estilos.barraDireita}>
              <View
                style={[
                  estilos.preenchimentoDireita,
                  {
                    width: `${porcentagem2}%`,
                    backgroundColor:
                      estatistica.vencedor === 'pokemon2' ? cor2 : cor2 + '80',
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <Text style={[estilos.valorComparacao, { color: cor2 }]}>
          {estatistica.valor2}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.containerSeguro}>
      <ScrollView style={estilos.container} showsVerticalScrollIndicator={false}>
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>Comparar Pokémon</Text>
          <Text style={estilos.subtitulo}>
            Selecione dois Pokémon para comparar suas estatísticas
          </Text>
        </View>

        {/* Seletores de Pokémon */}
        <View style={estilos.containerSeletores}>
          {renderizarSeletorPokemon(
            buscaPokemon1,
            setBuscaPokemon1,
            pokemon1,
            setPokemon1,
            'Pokémon 1'
          )}

          <View style={estilos.containerVS}>
            <Text style={estilos.textoVS}>VS</Text>
          </View>

          {renderizarSeletorPokemon(
            buscaPokemon2,
            setBuscaPokemon2,
            pokemon2,
            setPokemon2,
            'Pokémon 2'
          )}
        </View>

        {carregando && <Carregando mensagem="Buscando Pokémon..." />}

        {/* Resultado da Comparação */}
        {resultadoComparacao && (
          <View style={estilos.containerResultado}>
            <Text style={estilos.tituloResultado}>Resultado da Comparação</Text>

            {/* Placar */}
            <View style={estilos.placar}>
              <View style={estilos.itemPlacar}>
                <Text style={estilos.valorPlacar}>
                  {resultadoComparacao.vitorias1}
                </Text>
                <Text style={estilos.rotuloPlacar}>
                  {resultadoComparacao.nome1}
                </Text>
              </View>
              <View style={estilos.itemPlacar}>
                <Text style={estilos.valorPlacar}>
                  {resultadoComparacao.empates}
                </Text>
                <Text style={estilos.rotuloPlacar}>Empates</Text>
              </View>
              <View style={estilos.itemPlacar}>
                <Text style={estilos.valorPlacar}>
                  {resultadoComparacao.vitorias2}
                </Text>
                <Text style={estilos.rotuloPlacar}>
                  {resultadoComparacao.nome2}
                </Text>
              </View>
            </View>

            {/* Barras de comparação */}
            {resultadoComparacao.estatisticas.map(renderizarBarraComparacao)}

            {/* Total */}
            <View style={estilos.totalComparacao}>
              <Text
                style={[
                  estilos.valorTotalComp,
                  resultadoComparacao.vencedorGeral === 'pokemon1' &&
                    estilos.vencedor,
                ]}
              >
                {resultadoComparacao.total1}
              </Text>
              <Text style={estilos.rotuloTotalComp}>Total Base</Text>
              <Text
                style={[
                  estilos.valorTotalComp,
                  resultadoComparacao.vencedorGeral === 'pokemon2' &&
                    estilos.vencedor,
                ]}
              >
                {resultadoComparacao.total2}
              </Text>
            </View>

            {/* Vencedor Geral */}
            <View style={estilos.cartaoVencedor}>
              <Text style={estilos.rotuloVencedor}>Vencedor Geral</Text>
              <Text style={estilos.nomeVencedor}>
                {resultadoComparacao.vencedorGeral === 'empate'
                  ? 'Empate!'
                  : resultadoComparacao.vencedorGeral === 'pokemon1'
                  ? `🏆 ${resultadoComparacao.nome1}`
                  : `🏆 ${resultadoComparacao.nome2}`}
              </Text>
              <Text style={estilos.diferencaTotal}>
                Diferença total:{' '}
                {Math.abs(
                  resultadoComparacao.total1 - resultadoComparacao.total2
                )}{' '}
                pontos
              </Text>
            </View>
          </View>
        )}

        {/* Análise de Batalha Detalhada (OPERAÇÃO SOBRE DADOS) */}
        {resultadoComparacao && pokemon1 && pokemon2 && (
          <View style={{ paddingHorizontal: 16 }}>
            <CartaoComparacaoDetalhada
              pokemon1={pokemon1}
              pokemon2={pokemon2}
              comparacao={resultadoComparacao}
            />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingBottom: 20,
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
  containerSeletores: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  seletor: {
    flex: 1,
    backgroundColor: CORES_APP.branco,
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    shadowColor: CORES_APP.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rotuloSeletor: {
    fontSize: 13,
    fontWeight: 'bold',
    color: CORES_APP.cinzaEscuro,
    marginBottom: 8,
    textAlign: 'center',
  },
  containerInput: {
    flexDirection: 'row',
  },
  campoTexto: {
    flex: 1,
    backgroundColor: CORES_APP.cinzaClaro,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: CORES_APP.cinzaTexto,
  },
  botaoBuscar: {
    backgroundColor: CORES_APP.vermelhoPrincipal,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginLeft: 6,
  },
  textoBotaoBuscar: {
    color: CORES_APP.branco,
    fontWeight: 'bold',
    fontSize: 13,
  },
  previewPokemon: {
    alignItems: 'center',
    marginTop: 10,
  },
  imagemPreview: {
    width: 80,
    height: 80,
  },
  nomePreview: {
    fontSize: 14,
    fontWeight: 'bold',
    color: CORES_APP.cinzaTexto,
    marginTop: 4,
  },
  numeroPreview: {
    fontSize: 11,
    color: CORES_APP.cinzaEscuro,
  },
  containerVS: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 50,
  },
  textoVS: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CORES_APP.vermelhoPrincipal,
  },
  containerResultado: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  tituloResultado: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CORES_APP.cinzaTexto,
    marginBottom: 12,
    textAlign: 'center',
  },
  placar: {
    flexDirection: 'row',
    backgroundColor: CORES_APP.branco,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: CORES_APP.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemPlacar: {
    flex: 1,
    alignItems: 'center',
  },
  valorPlacar: {
    fontSize: 28,
    fontWeight: 'bold',
    color: CORES_APP.vermelhoPrincipal,
  },
  rotuloPlacar: {
    fontSize: 12,
    color: CORES_APP.cinzaEscuro,
    marginTop: 4,
    textAlign: 'center',
  },
  linhaComparacao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: CORES_APP.branco,
    borderRadius: 10,
    padding: 10,
  },
  valorComparacao: {
    width: 35,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerBarras: {
    flex: 1,
    marginHorizontal: 8,
  },
  nomeEstatisticaComparacao: {
    fontSize: 11,
    fontWeight: '600',
    color: CORES_APP.cinzaEscuro,
    textAlign: 'center',
    marginBottom: 4,
  },
  duasBarras: {
    flexDirection: 'row',
    height: 8,
  },
  barraEsquerda: {
    flex: 1,
    backgroundColor: CORES_APP.cinzaMedio,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    overflow: 'hidden',
    marginRight: 1,
  },
  preenchimentoEsquerda: {
    height: '100%',
    borderRadius: 4,
  },
  barraDireita: {
    flex: 1,
    backgroundColor: CORES_APP.cinzaMedio,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
    marginLeft: 1,
  },
  preenchimentoDireita: {
    height: '100%',
    borderRadius: 4,
  },
  totalComparacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CORES_APP.branco,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  valorTotalComp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CORES_APP.cinzaTexto,
  },
  rotuloTotalComp: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES_APP.cinzaEscuro,
  },
  vencedor: {
    color: CORES_APP.vermelhoPrincipal,
    fontSize: 24,
  },
  cartaoVencedor: {
    backgroundColor: CORES_APP.vermelhoPrincipal,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    alignItems: 'center',
  },
  rotuloVencedor: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  nomeVencedor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: CORES_APP.branco,
    marginTop: 4,
  },
  diferencaTotal: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
  },
});
