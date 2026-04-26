import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TelaInicio from '../telas/TelaInicio';
import TelaDetalhes from '../telas/TelaDetalhes';
import TelaFiltros from '../telas/TelaFiltros';
import TelaComparacao from '../telas/TelaComparacao';
import { CORES_APP } from '../constantes/cores';

const Pilha = createNativeStackNavigator();
const Abas = createBottomTabNavigator();

// Componente de ícone simples para as abas
function IconeAba({ rotulo, focado }) {
  const icones = {
    Início: '🏠',
    Tipos: '🔖',
    Comparar: '⚔️',
  };

  return (
    <View style={estilos.containerIcone}>
      <Text style={[estilos.icone, focado && estilos.iconeFocado]}>
        {icones[rotulo] || '📱'}
      </Text>
    </View>
  );
}

// Navegação por abas (telas principais)
function NavegacaoAbas() {
  return (
    <Abas.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <IconeAba rotulo={route.name} focado={focused} />
        ),
        tabBarActiveTintColor: CORES_APP.vermelhoPrincipal,
        tabBarInactiveTintColor: CORES_APP.cinzaEscuro,
        tabBarStyle: estilos.barraAbas,
        tabBarLabelStyle: estilos.rotuloAba,
      })}
    >
      <Abas.Screen
        name="Início"
        component={TelaInicio}
        options={{ tabBarLabel: 'Pokédex' }}
      />
      <Abas.Screen
        name="Tipos"
        component={TelaFiltros}
        options={{ tabBarLabel: 'Tipos' }}
      />
      <Abas.Screen
        name="Comparar"
        component={TelaComparacao}
        options={{ tabBarLabel: 'Comparar' }}
      />
    </Abas.Navigator>
  );
}

// Navegação principal (pilha com abas + tela de detalhes)
export default function NavegacaoPrincipal() {
  return (
    <NavigationContainer>
      <Pilha.Navigator screenOptions={{ headerShown: false }}>
        <Pilha.Screen name="Principal" component={NavegacaoAbas} />
        <Pilha.Screen name="Detalhes" component={TelaDetalhes} />
        <Pilha.Screen name="Comparacao" component={TelaComparacao} />
      </Pilha.Navigator>
    </NavigationContainer>
  );
}

const estilos = StyleSheet.create({
  barraAbas: {
    backgroundColor: CORES_APP.branco,
    borderTopWidth: 1,
    borderTopColor: CORES_APP.cinzaMedio,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  rotuloAba: {
    fontSize: 11,
    fontWeight: '600',
  },
  containerIcone: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icone: {
    fontSize: 22,
  },
  iconeFocado: {
    fontSize: 26,
  },
});