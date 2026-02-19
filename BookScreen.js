import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { AppContext } from '../context/AppContext';
import { styles } from '../styles/globalStyles';

export default function BookScreen({ route, navigation }) {
  const { catalog, addToCart, loanData } = useContext(AppContext);
  const { bookId } = route.params;

  const [isExpanded, setIsExpanded] = useState(false);

  const book = catalog.find((b) => b.id === bookId);

  useEffect(() => {
    if (book) {
      navigation.setOptions({ title: book.title });
    }
  }, [book, navigation]);

  if (!book) {
    return (
      <View style={styles.containerCentered}>
        <Text>Livro não encontrado!</Text>
      </View>
    );
  }

  const inCart = loanData.carrinho.some((item) => item.id === book.id);
  const available = book.quantidadeDisponivel > 0;
  const showReadMore = book.description.length > 150;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.bookDetailTop}>
          <Image source={{ uri: book.cover }} style={styles.bookDetailCover} />
          <View style={styles.bookDetailInfo}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{book.author}</Text>
            <Text
              style={{
                ...styles.availabilityText,
                color: available ? 'green' : 'red',
              }}>
              {available
                ? `Disponível (${book.quantidadeDisponivel} unid)`
                : 'Esgotado'}
            </Text>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  marginTop: 12,
                  backgroundColor: inCart || !available ? '#aaa' : '#2b6cb0',
                },
              ]}
              onPress={() => addToCart(book)}
              disabled={inCart || !available}>
              <Text style={styles.buttonText}>
                {inCart
                  ? 'Adicionado a Lista'
                  : available
                  ? 'Adicionar'
                  : 'Indisponível'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text
            style={styles.descriptionText}
            numberOfLines={isExpanded ? undefined : 4}
          >
            {book.description}
          </Text>
          {showReadMore && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={styles.readMoreText}>
                {isExpanded ? 'Leia menos' : 'Leia mais...'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
