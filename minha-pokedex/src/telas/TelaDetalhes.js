/**
 * Tela TelaDetalhes.
 * Exibe informações completas de um Pokémon: imagem, tipos, estatísticas,
 * cadeia de evolução, habilidades e análise de pontos fortes/fracos.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  buscarDetalhesPokemon,
  buscarEspeciePokemon,
  buscarCadeiaEvolucao,
} from '../servicos/pokeApi';
import BarraEstatistica from '../componentes/BarraEstatistica';
import EtiquetaTipo from '../componentes/EtiquetaTipo';
import CartaoEvolucao from '../componentes/CartaoEvolucao';
import CartaoAnalise from '../componentes/CartaoAnalise';
import Carregando from '../componentes/Carregando';
import {
  formatarNumeroPokemon,
  capitalizarTexto,
  obterCorTipo,
  obterUrlImagemPokemon,
  formatarAltura,
  formatarPeso,
  calcularTotalEstatisticas,
  analisarPontosFortesEFracos,
  processarCadeiaEvolucao,
  extrairDescricaoPokemon,
} from '../utilitarios/formatadores';
import { CORES_APP } from '../constantes/cores';

const { width: LARGURA_TELA } = Dimensions.get('window');

export default function TelaDetalhes({ route, navigation }) {
  const { idPokemon } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [especie, setEspecie] = useState(null);
  const [evolucoes, setEvolucoes] = useState([]);
  const [analise, setAnalise] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('sobre');

  useEffect(() => {
    carregarDadosCompletos();
  }, [idPokemon]);

  async function carregarDadosCompletos() {
    try {
      setCarregando(true);

      // Busca detalhes do Pokémon
      const dadosPokemon = await buscarDetalhesPokemon(idPokemon);
      setPokemon(dadosPokemon);

      // Realiza análise de pontos fortes e fracos (OPERAÇÃO SOBRE DADOS)
      const resultadoAnalise = analisarPontosFortesEFracos(dadosPokemon.stats);
      setAnalise(resultadoAnalise);

      // Busca dados da espécie
      const dadosEspecie = await buscarEspeciePokemon(idPokemon);
      setEspecie(dadosEspecie);

      // Busca cadeia de evolução
      if (dadosEspecie.evolution_chain?.url) {
        const dadosEvolucao = await buscarCadeiaEvolucao(
          dadosEspecie.evolution_chain.url
        );
        const evolucoeProcessadas = processarCadeiaEvolucao(dadosEvolucao.chain);
        setEvolucoes(evolucoeProcessadas);
      }
    } catch (erro) {
      console.error('Erro ao carregar dados completos:', erro);
    } finally {
      setCarregando(false);
    }
  }

  function navegarParaPokemon(id) {
    navigation.push('Detalhes', { idPokemon: id });
  }

  if (carregando || !pokemon) {
    return <Carregando mensagem="Carregando dados do Pokémon..." />;
  }

  const tipoPrincipal = pokemon.types[0].type.name;
  const corPrincipal = obterCorTipo(tipoPrincipal);
  const descricao = especie
    ? extrairDescricaoPokemon(especie.flavor_text_entries)
    : '';

  const abas = [
    { chave: 'sobre', rotulo: 'Sobre' },
    { chave: 'estatisticas', rotulo: 'Estatísticas' },
    { chave: 'evolucao', rotulo: 'Evolução' },
    { chave: 'analise', rotulo: 'Análise' },
  ];

  return (
    <View style={[estilos.container, { backgroundColor: corPrincipal }]}>
      {/* Cabeçalho com imagem */}
      <View style={estilos.cabecalho}>
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={estilos.textoBotaoVoltar}>←</Text>
        </TouchableOpacity>

        <View style={estilos.infoCabecalho}>
          <Text style={estilos.nomePokemon}>
            {capitalizarTexto(pokemon.name)}
          </Text>
          <Text style={estilos.numeroPokemon}>
            {formatarNumeroPokemon(pokemon.id)}
          </Text>
        </View>

        <View style={estilos.containerTipos}>
          {pokemon.types.map((t) => (
            <EtiquetaTipo key={t.type.name} tipo={t.type.name} tamanho="medio" />
          ))}
        </View>

        <Image
          source={{ uri: obterUrlImagemPokemon(pokemon.id) }}
          style={estilos.imagemPokemon}
          resizeMode="contain"
        />
      </View>

      {/* Conteúdo com abas */}
      <View style={estilos.conteudo}>
        {/* Abas de navegação */}
        <View style={estilos.containerAbas}>
          {abas.map((aba) => (
            <TouchableOpacity
              key={aba.chave}
              style={[
                estilos.aba,
                abaAtiva === aba.chave && estilos.abaAtiva,
              ]}
              onPress={() => setAbaAtiva(aba.chave)}
            >
              <Text
                style={[
                  estilos.textoAba,
                  abaAtiva === aba.chave && { color: corPrincipal },
                ]}
              >
                {aba.rotulo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={estilos.conteudoRolavel}
        >
          {/* Aba Sobre */}
          {abaAtiva === 'sobre' && (
            <View>
              {descricao ? (
                <Text style={estilos.descricao}>{descricao}</Text>
              ) : null}

              <View style={estilos.cartaoInfo}>
                <View style={estilos.itemInfo}>
                  <Text style={estilos.valorInfo}>
                    {formatarPeso(pokemon.weight)}
                  </Text>
                  <Text style={estilos.rotuloInfo}>Peso</Text>
                </View>
                <View style={estilos.divisor} />
                <View style={estilos.itemInfo}>
                  <Text style={estilos.valorInfo}>
                    {formatarAltura(pokemon.height)}
                  </Text>
                  <Text style={estilos.rotuloInfo}>Altura</Text>
                </View>
                <View style={estilos.divisor} />
                <View style={estilos.itemInfo}>
                  <Text style={estilos.valorInfo}>
                    {pokemon.base_experience || 'N/A'}
                  </Text>
                  <Text style={estilos.rotuloInfo}>Exp. Base</Text>
                </View>
              </View>

              {/* Habilidades */}
              <Text style={estilos.tituloSecao}>Habilidades</Text>
              <View style={estilos.containerHabilidades}>
                {pokemon.abilities.map((hab) => (
                  <View key={hab.ability.name} style={estilos.etiquetaHabilidade}>
                    <Text style={estilos.textoHabilidade}>
                      {capitalizarTexto(hab.ability.name.replace('-', ' '))}
                      {hab.is_hidden ? ' (Oculta)' : ''}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Informações da Espécie */}
              {especie && (
                <View>
                  <Text style={estilos.tituloSecao}>Informações da Espécie</Text>
                  <View style={estilos.cartaoEspecie}>
                    <View style={estilos.linhaEspecie}>
                      <Text style={estilos.rotuloEspecie}>Taxa de Captura</Text>
                      <Text style={estilos.valorEspecie}>
                        {especie.capture_rate}
                      </Text>
                    </View>
                    <View style={estilos.linhaEspecie}>
                      <Text style={estilos.rotuloEspecie}>Felicidade Base</Text>
                      <Text style={estilos.valorEspecie}>
                        {especie.base_happiness}
                      </Text>
                    </View>
                    <View style={estilos.linhaEspecie}>
                      <Text style={estilos.rotuloEspecie}>Taxa de Crescimento</Text>
                      <Text style={estilos.valorEspecie}>
                        {capitalizarTexto(
                          especie.growth_rate?.name?.replace('-', ' ') || 'N/A'
                        )}
                      </Text>
                    </View>
                    <View style={estilos.linhaEspecie}>
                      <Text style={estilos.rotuloEspecie}>Habitat</Text>
                      <Text style={estilos.valorEspecie}>
                        {capitalizarTexto(especie.habitat?.name || 'Desconhecido')}
                      </Text>
                    </View>
                    <View style={estilos.linhaEspecie}>
                      <Text style={estilos.rotuloEspecie}>Geração</Text>
                      <Text style={estilos.valorEspecie}>
                        {especie.generation?.name?.toUpperCase() || 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Aba Estatísticas */}
          {abaAtiva === 'estatisticas' && (
            <View>
              <Text style={estilos.tituloSecao}>Estatísticas Base</Text>
              {pokemon.stats.map((est) => (
                <BarraEstatistica
                  key={est.stat.name}
                  nomeEstatistica={est.stat.name}
                  valor={est.base_stat}
                />
              ))}
              <View style={estilos.totalEstatisticas}>
                <Text style={estilos.rotuloTotal}>Total Base (BST)</Text>
                <Text style={estilos.valorTotal}>
                  {calcularTotalEstatisticas(pokemon.stats)}
                </Text>
              </View>
            </View>
          )}

          {/* Aba Evolução */}
          {abaAtiva === 'evolucao' && (
            <View>
              <Text style={estilos.tituloSecao}>Cadeia de Evolução</Text>
              <CartaoEvolucao
                evolucoes={evolucoes}
                aoPresionarPokemon={navegarParaPokemon}
              />
            </View>
          )}

          {/* Aba Análise (OPERAÇÃO SOBRE DADOS) */}
          {abaAtiva === 'analise' && (
            <View>
              <Text style={estilos.tituloSecao}>Análise de Desempenho</Text>
              <CartaoAnalise analise={analise} />

              {/* Botão para comparar */}
              <TouchableOpacity
                style={[estilos.botaoComparar, { backgroundColor: corPrincipal }]}
                onPress={() =>
                  navigation.navigate('Comparacao', {
                    pokemonPreSelecionado: pokemon,
                  })
                }
              >
                <Text style={estilos.textoBotaoComparar}>
                  Comparar com outro Pokémon
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  cabecalho: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  botaoVoltar: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotaoVoltar: {
    fontSize: 24,
    color: CORES_APP.branco,
    fontWeight: 'bold',
  },
  infoCabecalho: {
    alignItems: 'center',
    marginBottom: 8,
  },
  nomePokemon: {
    fontSize: 30,
    fontWeight: 'bold',
    color: CORES_APP.branco,
  },
  numeroPokemon: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    marginTop: 2,
  },
  containerTipos: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  imagemPokemon: {
    width: LARGURA_TELA * 0.55,
    height: LARGURA_TELA * 0.55,
  },
  conteudo: {
    flex: 1,
    backgroundColor: CORES_APP.branco,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  containerAbas: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: CORES_APP.cinzaMedio,
  },
  aba: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  abaAtiva: {
    borderBottomWidth: 3,
    borderBottomColor: CORES_APP.vermelhoPrincipal,
  },
  textoAba: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES_APP.cinzaEscuro,
  },
  conteudoRolavel: {
    padding: 16,
    paddingBottom: 40,
  },
  descricao: {
    fontSize: 15,
    lineHeight: 22,
    color: CORES_APP.cinzaTexto,
    marginBottom: 16,
    textAlign: 'justify',
  },
  cartaoInfo: {
    flexDirection: 'row',
    backgroundColor: CORES_APP.cinzaClaro,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  itemInfo: {
    flex: 1,
    alignItems: 'center',
  },
  valorInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CORES_APP.cinzaTexto,
  },
  rotuloInfo: {
    fontSize: 12,
    color: CORES_APP.cinzaEscuro,
    marginTop: 4,
  },
  divisor: {
    width: 1,
    backgroundColor: CORES_APP.cinzaMedio,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CORES_APP.cinzaTexto,
    marginBottom: 12,
    marginTop: 8,
  },
  containerHabilidades: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  etiquetaHabilidade: {
    backgroundColor: CORES_APP.cinzaClaro,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  textoHabilidade: {
    fontSize: 13,
    color: CORES_APP.cinzaTexto,
    fontWeight: '500',
  },
  cartaoEspecie: {
    backgroundColor: CORES_APP.cinzaClaro,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  linhaEspecie: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: CORES_APP.cinzaMedio,
  },
  rotuloEspecie: {
    fontSize: 14,
    color: CORES_APP.cinzaEscuro,
  },
  valorEspecie: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES_APP.cinzaTexto,
  },
  totalEstatisticas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: CORES_APP.cinzaClaro,
    borderRadius: 10,
  },
  rotuloTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: CORES_APP.cinzaTexto,
  },
  valorTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CORES_APP.vermelhoPrincipal,
  },
  botaoComparar: {
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 16,
  },
  textoBotaoComparar: {
    color: CORES_APP.branco,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
