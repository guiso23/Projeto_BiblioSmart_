import React, { useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { AppContext } from '../context/AppContext';
import { styles } from '../styles/globalStyles';

export default function HomeScreen({ navigation }) {
  const { user, catalog, logout, loanData } = useContext(AppContext);
  const cartCount = loanData.carrinho.length;

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.bookCard}
        onPress={() => navigation.navigate('Book', { bookId: item.id })}>
        <Image source={{ uri: item.cover }} style={styles.bookCover} />
        <Text style={styles.bookTitleSmall} numberOfLines={2}>
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: item.quantidadeDisponivel > 0 ? 'green' : 'red',
          }}>
          {item.quantidadeDisponivel} disp.
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Olá, {user.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.link}>Lista de Desejo ({cartCount})</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.link}>Sair</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Nosso Catálogo</Text>
        <FlatList
          data={catalog}
          keyExtractor={(b) => b.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      </View>
    </SafeAreaView>
  );
}
