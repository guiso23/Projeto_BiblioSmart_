import React, { useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { AppContext } from '../context/AppContext';
import { styles } from '../styles/globalStyles';

export default function CartScreen({ navigation }) {
  const { loanData, updateAndSaveLoanData, catalog, updateAndSaveCatalog } =
    useContext(AppContext);
  const { carrinho, emprestimos } = loanData;

  const getReturnDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toLocaleDateString('pt-BR');
  };
  const prazoDevolucao = getReturnDate();

  const removeItem = (item) => {
    const newCatalog = catalog.map((b) =>
      b.id === item.id
        ? { ...b, quantidadeDisponivel: b.quantidadeDisponivel + 1 }
        : b
    );
    updateAndSaveCatalog(newCatalog);
    updateAndSaveLoanData({
      ...loanData,
      carrinho: carrinho.filter((i) => i.id !== item.id),
    });
  };

  const confirmLoan = () => {
    const booksToLoan = carrinho.map((item) => ({
      ...item,
      prazoDevolucao: prazoDevolucao,
    }));
    updateAndSaveLoanData({
      carrinho: [],
      emprestimos: [...emprestimos, ...booksToLoan],
    });
    Alert.alert(
      'Sucesso!',
      `Empréstimo confirmado! Devolução em: ${prazoDevolucao}.`,
      [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Minha Lista de Desejo ({carrinho.length})
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Voltar</Text>
        </TouchableOpacity>
      </View>
      {carrinho.length === 0 ? (
        <View style={styles.containerCentered}>
          <Text style={{ fontSize: 16 }}>Sua lista de desejo está vazia.</Text>
          <TouchableOpacity
            style={[styles.button, { marginTop: 15 }]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Explorar Livros</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={carrinho}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.container}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image
                  source={{ uri: item.cover }}
                  style={styles.cartItemImage}
                />
                <Text style={styles.cartItemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <TouchableOpacity onPress={() => removeItem(item)}>
                  <Text style={{ color: 'red' }}>Remover</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.checkoutBox}>
            <Text style={styles.checkoutText}>
              Devolução em:{' '}
              <Text style={{ fontWeight: 'bold' }}>{prazoDevolucao}</Text>
            </Text>
            <TouchableOpacity style={styles.button} onPress={confirmLoan}>
              <Text style={styles.buttonText}>Confirmar Empréstimo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
