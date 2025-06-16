# lumis-pokedex


# Instruções para rodar o projeto:

Caso queira visualizar o projeto sem passar por todas as etapas abaixo, basta acessar na seguinte URL: `https://himefe.github.io/lumis-pokedex/`, ele está online via Github Pages.

Etapas:

1. Clone o projeto
2. Rode o projeto: Pode ser feito de duas maneiras:
     2.1 No terminal, digite o seguinte comando: `npm install` e depois `npm start`, para isso é necessário ter o Node instalado, junto com o npm. Após isso, mostrará no terminal algumas URL's que está rodando o projeto, ex: `http://127.0.0.1:8080`
     2.2 Caso esteja utilizando o editor "VS Code", basta instalar a extensão chamada: "live server". Após a instalação, no canto inferior direito terá um botão chamado: "Go Live", só clicar nele que o projeto rodará diretamente no navegador, ex: `http://127.0.0.1:5500/`



# Observações

1. Há algumas imagens de pokémons que retorna como `null` na imagem que vem da API, exemplo da página 72, então coloquei uma imagem padrão para esses casos, uma pokebola, imaginei como se o pokémon não saiu da bola (imagem nula).
   
2. Fiz uma pesquisa sobre nomes oficiais traduzidos pro PT-BR, então será mostrado os nomes em Português Brasileiro no card do pokémon, sendo possível buscar tanto pelo nome em Português quanto em inglês: `Bulbassauro, lagarta, miaum, igglybuff, piu-piu`, esses dados estão em um dicionário na pasta chamada i18n: `/assets/js/i18n`;
  
3. Os tipos do pokemon também foram traduzidos por PT-BR, estão encontrados no dicionário dentro da pasta: `assets/js/i18n`.

4. Foi colocado um skeleton para a espera dos dados dos pokémons.

5. Tentei deixar o site com uma acessibilidade boa, então utilizei alguns arias pra facilitar isso. 

# Considerações sobre a API de Pokémons

## 1. Listagem paginada de pokémons

### 1.1 Parâmetros de paginação

O endpoint paginado de pokémons aceita apenas dois parâmetros:

- `limit`
- `offset`

Ou seja, ele não permite a busca por nome diretamente nesse endpoint. O ideal seria que houvesse um parâmetro de `search`, como no exemplo:

```url
/pokemon?limit=18&offset=0&search=bulba
```

Com isso, seria possível trazer pokémons com base no valor digitado no campo de busca (seja nome parcial, ID, tipo ou habilidade). No modelo atual, só é possível buscar diretamente por um nome ou ID exato. Por exemplo:

- Buscar por `"bulbasaur"` funciona.
- Buscar por `"bulba"` **não retorna nada**.

Isso limita bastante a experiência de busca quando combinada com paginação.

> **Observação:** o endpoint de busca direta por pokémon também aceita o ID numérico.

---

## 2. Dados retornados pelo endpoint paginado

O endpoint paginado `/pokemon` retorna apenas:

- Nome do pokémon
- URL para buscar seus detalhes

Ou seja, para exibir as informações completas de 18 pokémons, como exigido no layout do Figma, é necessário:

- 1 requisição para a listagem paginada
- +18 requisições (uma para cada pokémon detalhado)

**Total: 19 requisições por página**

Isso pode gerar uma sobrecarga desnecessária no servidor.

Uma solução mais eficiente seria o endpoint paginado já retornar os dados completos de cada pokémon. Assim, bastaria **uma única requisição por página**, o que melhoraria a performance e reduziria a complexidade da aplicação.
  
