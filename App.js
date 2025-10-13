import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');
const AppContext = createContext();

const INITIAL_BOOKS_CATALOG = [
  {
    id: '1',
    title: 'O Senhor dos Anéis',
    author: 'J.R.R. Tolkien',
    cover:
      'data:image/jpeg;base64,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',
    description:
      'O volume inicial de O Senhor dos Anéis, lançado originalmente em julho de 1954, foi o primeiro grande épico de fantasia moderno, conquistando milhões de leitores e se tornando o padrão de referência para todas as outras obras do gênero até hoje. A imaginação prodigiosa de J.R.R. Tolkien e seu conhecimento profundo das antigas mitologias da Europa permitiram que ele criasse um universo tão complexo e convincente quanto o mundo real. A Sociedade do Anel começa no Condado, a região rural do oeste da Terra-média onde vivem os diminutos e pacatos hobbits. Bilbo Bolseiro, um dos raros aventureiros desse povo, cujas peripécias foram contadas em O Hobbit, resolve ir embora do Condado e deixa sua considerável herança nas mãos de seu jovem parente Frodo. O mais importante legado de Bilbo é o anel mágico que costumava usar para se tornar invisível. No entanto, o mago Gandalf, companheiro de aventuras do velho hobbit, revela a Frodo que o objeto é o Um Anel, a raiz do poder demoníaco de Sauron, o Senhor Sombrio, que deseja escravizar todos os povos da Terra-média. A única maneira de eliminar a ameaça de Sauron é destruir o Um Anel nas entranhas da própria montanha de fogo onde foi forjado. A revelação faz com que Frodo e seus companheiros hobbits Sam, Merry e Pippin deixem a segurança do Condado e iniciem uma perigosa jornada rumo ao leste. Ao lado de representantes dos outros Povos Livres que resistem ao Senhor Sombrio, eles formam a Sociedade do Anel. Alguém uma vez disse que o mundo dos leitores de língua inglesa se divide entre os que já leram O Senhor dos Anéis e os que um dia lerão o livro. Com esta nova tradução da obra, o fascínio dessa aventura atemporal ficará ainda mais evidente para os leitores brasileiros, tanto os que já conhecem a saga como os que estão prestes a descobrir seu encanto.',
    quantidadeDisponivel: 5,
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    cover:
      'data:image/jpeg;base64,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',
    description:
      'Winston, herói de 1984, último romance de George Orwell, vive aprisionado na engrenagem totalitária de uma sociedade completamente dominada pelo Estado, onde tudo é feito coletivamente, mas cada qual vive sozinho. Ninguém escapa à vigilância do Grande Irmão, a mais famosa personificação literária de um poder cínico e cruel ao infinito, além de vazio de sentido histórico. De fato, a ideologia do Partido dominante em Oceânia não visa nada de coisa alguma para ninguém, no presente ou no futuro. O Brien, hierarca do Partido, é quem explica a Winston que "só nos interessa o poder em si. Nem riqueza, nem luxo, nem vida longa, nem felicidade: só o poder pelo poder, poder puro". Quando foi publicada em 1949, essa assustadora distopia datada de forma arbitrária num futuro perigosamente próximo logo experimentaria um imenso sucesso de público. Seus principais ingredientes - um homem sozinho desafiando uma tremenda ditadura; sexo furtivo e libertador; horrores letais - atraíram leitores de todas as idades, à esquerda e à direita do espectro político, com maior ou menor grau de instrução. À parte isso, a escrita translúcida de George Orwell, os personagens fortes, traçados a carvão por um vigoroso desenhista de personalidades, a trama seca e crua e o tom de sátira sombria garantiram a entrada precoce de 1984 no restrito panteão dos grandes clássicos modernos.',
    quantidadeDisponivel: 1,
  },
  {
    id: '3',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    cover:
      'data:image/jpeg;base64,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',
    description:
      'Em Dom Casmurro, o narrador Bento Santiago retoma a infância que passou na Rua de Matacavalos e conta a história do amor e das desventuras que viveu com Capitu, uma das personagens mais enigmáticas e intrigantes da literatura brasileira. Nas páginas deste romance, encontra-se a versão de um homem perturbado pelo ciúme, que revela aos poucos sua psicologia complexa e enreda o leitor em sua narrativa ambígua acerca do acontecimento ou não do adultério da mulher com olhos de ressaca, uma das maiores polêmicas da literatura brasileira.',
    quantidadeDisponivel: 8,
  },
];
const BOOKS_KEY = 'BV_BOOKS_CATALOG';
const AUTH_KEY = 'BV_USER';
const LOAN_KEY_PREFIX = 'BV_LOANS_';

const USERS_KEY = 'BV_USERS_DB';

const fakeStorage = {};
async function getItem(key) {
  return Promise.resolve(fakeStorage[key] || null);
}
async function setItem(key, value) {
  fakeStorage[key] = value;
  return Promise.resolve();
}
async function removeItem(key) {
  delete fakeStorage[key];
  return Promise.resolve();
}

async function loadUsersDB() {
  const usersJson = await getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}
async function saveUsersDB(users) {
  await setItem(USERS_KEY, JSON.stringify(users));
}

async function setupAndLoadCatalog() {
  try {
    let booksJson = await getItem(BOOKS_KEY);
    if (booksJson === null) {
      await setItem(BOOKS_KEY, JSON.stringify(INITIAL_BOOKS_CATALOG));
      return INITIAL_BOOKS_CATALOG;
    } else {
      return JSON.parse(booksJson);
    }
  } catch (error) {
    return INITIAL_BOOKS_CATALOG;
  }
}
async function saveCatalog(books) {
  await setItem(BOOKS_KEY, JSON.stringify(books));
}
async function loadUserLoanData(userEmail) {
  const defaultData = { carrinho: [], emprestimos: [] };
  const dataJson = await getItem(LOAN_KEY_PREFIX + userEmail);
  return dataJson ? JSON.parse(dataJson) : defaultData;
}
async function saveUserLoanData(userEmail, data) {
  await setItem(LOAN_KEY_PREFIX + userEmail, JSON.stringify(data));
}
async function saveUser(user) {
  await setItem(AUTH_KEY, JSON.stringify(user));
}
async function loadUser() {
  const s = await getItem(AUTH_KEY);
  return s ? JSON.parse(s) : null;
}
async function clearUser() {
  await removeItem(AUTH_KEY);
}

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [loanData, setLoanData] = useState({ carrinho: [], emprestimos: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      const savedUser = await loadUser();
      const loadedCatalog = await setupAndLoadCatalog();
      setCatalog(loadedCatalog);
      if (savedUser) {
        setUser(savedUser);
        const userLoans = await loadUserLoanData(savedUser.email);
        setLoanData(userLoans);
      }
      setLoading(false);
    };
    initializeApp();
  }, []);

  const login = async (verifiedUser) => {
    await saveUser(verifiedUser);
    const userLoans = await loadUserLoanData(verifiedUser.email);
    setLoanData(userLoans);
    setUser(verifiedUser);
  };

  const logout = async () => {
    await clearUser();
    setLoanData({ carrinho: [], emprestimos: [] });
    setUser(null);
  };
  const updateAndSaveCatalog = async (newCatalog) => {
    setCatalog(newCatalog);
    await saveCatalog(newCatalog);
  };
  const updateAndSaveLoanData = (data) => {
    setLoanData(data);
    if (user) {
      saveUserLoanData(user.email, data);
    }
  };

  const addToCart = (book) => {
    if (loanData.carrinho.some((item) => item.id === book.id)) {
      Alert.alert('Atenção', 'Livro já está no seu carrinho.');
      return;
    }
    if (book.quantidadeDisponivel <= 0) {
      Alert.alert('Atenção', 'Livro esgotado no momento!');
      return;
    }
    const newCatalog = catalog.map((b) =>
      b.id === book.id
        ? { ...b, quantidadeDisponivel: b.quantidadeDisponivel - 1 }
        : b
    );
    updateAndSaveCatalog(newCatalog);
    updateAndSaveLoanData({
      ...loanData,
      carrinho: [...loanData.carrinho, book],
    });
    Alert.alert('Sucesso', `${book.title} adicionado à lista!`);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      catalog,
      loading,
      addToCart,
      loanData,
      updateAndSaveLoanData,
      updateAndSaveCatalog,
    }),
    [user, catalog, loanData, loading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function RootNavigator() {
  const { user, loading } = useContext(AppContext);
  if (loading) {
    return (
      <View style={styles.containerCentered}>
        <ActivityIndicator size="large" color="#2b6cb0" />
      </View>
    );
  }
  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Book"
            component={BookScreen}
            options={{ title: 'Detalhes do Livro' }}
          />
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

function AuthScreen() {
  const { login } = useContext(AppContext);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }

    const users = await loadUsersDB();

    if (isRegister) {
      if (!name) {
        Alert.alert('Atenção', 'Preencha o campo "Nome" para se registrar.');
        return;
      }

      const userExists = users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (userExists) {
        Alert.alert('Erro', 'Este e-mail já está em uso.');
        return;
      }

      const newUser = { name, email, password };
      await saveUsersDB([...users, newUser]);

      Alert.alert(
        'Sucesso!',
        'Conta criada com sucesso. Agora você já pode entrar.'
      );
      setIsRegister(false);
      setPassword('');
    } else {
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!foundUser || foundUser.password !== password) {
        Alert.alert('Erro', 'E-mail ou senha inválidos.');
        return;
      }

      await login(foundUser);
    }
  }

  return (
    <SafeAreaView style={styles.containerCentered}>
      <Image
        source={{
          uri: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/a7f1e1c06c4aa8339f665c85fd05450c',
        }}
        style={styles.logoImage}
        resizeMode="contain"
      />
      <View style={styles.card}>
        {isRegister && (
          <TextInput
            placeholder="Nome"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          placeholder="E-mail"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Senha"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {isRegister ? 'Registrar' : 'Entrar'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
          <Text style={styles.link}>
            {isRegister ? 'Já tem conta? Entrar' : 'Não tem conta? Registrar'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function HomeScreen({ navigation }) {
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

function BookScreen({ route, navigation }) {
  const { catalog, addToCart, loanData } = useContext(AppContext);
  const { bookId } = route.params;

  const [isExpanded, setIsExpanded] = useState(false);

  const book = catalog.find((b) => b.id === bookId);
  if (!book) {
    return (
      <View>
        <Text>Livro não encontrado!</Text>
      </View>
    );
  }

  const inCart = loanData.carrinho.some((item) => item.id === book.id);
  const available = book.quantidadeDisponivel > 0;
  const showReadMore = book.description.length > 150;

  useEffect(() => {
    navigation.setOptions({ title: book.title });
  }, [book]);

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

function CartScreen({ navigation }) {
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

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16 },
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoImage: { width: 150, height: 150, marginBottom: 20 },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#2b6cb0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  link: { color: '#2b6cb0', marginTop: 15 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  bookCard: { flex: 0.48, marginVertical: 8 },
  bookCover: {
    width: '100%',
    height: width * 0.6,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookTitleSmall: { fontWeight: '600', fontSize: 14 },
  bookDetailTop: { flexDirection: 'row' },
  bookDetailCover: {
    width: width * 0.35,
    height: width * 0.55,
    borderRadius: 8,
  },
  bookDetailInfo: { flex: 1, marginLeft: 16 },
  bookTitle: { fontSize: 22, fontWeight: '800' },
  bookAuthor: { fontSize: 16, color: '#666', marginTop: 4 },
  availabilityText: { fontSize: 14, fontWeight: 'bold', marginTop: 8 },
  descriptionContainer: { marginTop: 24 },
  descriptionText: { fontSize: 16, lineHeight: 24 },
  readMoreText: {
    color: '#2b6cb0',
    fontWeight: 'bold',
    marginTop: 5,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cartItemImage: { width: 40, height: 60, borderRadius: 4, marginRight: 12 },
  cartItemTitle: { flex: 1, fontSize: 16 },
  checkoutBox: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  checkoutText: { fontSize: 16, marginBottom: 10, textAlign: 'center' },
});
