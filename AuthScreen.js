import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { AppContext } from '../context/AppContext';
import { styles } from '../styles/globalStyles';
import { loadUsersDB, saveUsersDB } from '../services/storage';

export default function AuthScreen() {
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
