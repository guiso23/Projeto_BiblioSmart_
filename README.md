# Projeto_BiblioSmart_

Projeto da faculdade que fiz em grupo que fui responsavel pelo desenvolvimento da aplicação no meu quarto periodo, utilizei a expo snack como ferramenta de criação

A aplicação foi construída sobre um conjunto de tecnologias modernas para desenvolvimento móvel multiplataforma, usamos React Native, utilizando JavaScript para criar uma interface nativa e responsiva em dispositivos Android e iOS. A estrutura baseia-se em componentes funcionais e Hooks para controle de estados, efeitos e dados globais. 

A navegação entre telas é implementada com React Navigation, usando o createNativeStackNavigator para um fluxo dinâmico e intuitivo. Além disso, APIs nativas do React Native, como Alert, Dimensions e StyleSheet, são utilizadas para exibir alertas, adaptar o layout às dimensões da tela e organizar estilos. 

O gerenciamento de estado global é feito pela Context API, centralizando informações do usuário, catálogo de livros e empréstimos. Para persistência de dados, o projeto utiliza uma simulação de AsyncStorage, demonstrando a lógica de armazenamento local que pode ser substituída pela biblioteca real @react-native-async-storage/async-storage. 

As principais dependências do projeto incluem: 

react e react-native (base do app); 

@react-navigation/native e @react-navigation/native-stack (navegação entre telas); 

@react-native-async-storage/async-storage (armazenamento local, utilizado de forma simulada).
