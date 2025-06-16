# lumis-pokedex


# Instruções para rodar o projeto:

Caso queira visualizar o projeto sem passar por todas as etapas abaixo, basta acessar na seguinte URL: `https://himefe.github.io/lumis-pokedex/`, ele está online via Github Pages.

Etapas:

1. Clone o projeto
2. Rode o projeto: Pode ser feito de duas maneiras:
     2.1 No terminal, digite o seguinte comando: `npm start`, para isso é necessário ter o Node instalado, junto com o npm. Após isso, mostrará no terminal algumas URL's que está rodando o projeto, ex: `http://127.0.0.1:8080`
     2.2 Caso esteja utilizando o editor "VS Code", basta instalar a extensão chamada: "live server". Após a instalação, no canto inferior direito terá um botão chamado: "Go Live", só clicar nele que o projeto rodará diretamente no navegador, ex: `http://127.0.0.1:5500/`



# Observações

1. Há algumas imagens de pokémons que retorna como `null` na imagem que vem da API, exemplo da página 72, então coloquei uma imagem padrão para esses casos, uma pokebola, imaginei como se o pokémon não saiu da bola (imagem nula).
   
2. Fiz uma pesquisa sobre nomes oficiais traduzidos pro PT-BR, então será mostrado os nomes em Português Brasileiro no card do pokémon, sendo possível buscar tanto pelo nome em Português quanto em inglês: `Bulbassauro, lagarta, miaum, igglybuff, piu-piu`, esses dados estão em um dicionário na pasta chamada i18n: `/assets/js/i18n`;
  
3. Os tipos do pokemon também foram traduzidos por PT-BR, estão encontrados no dicionário dentro da pasta: `assets/js/i18n`.

4. Foi colocado um skeleton para a espera dos dados dos pokémons.

5. Tentei deixar o site com uma acessibilidade boa, então utilizei alguns arias pra facilitar isso. 

# Sugestões

Os endpoints da API da PokeAPI são bastante limitados, abaixo há algumas considerações e talvez melhoria para o caso do listagens paginadas com buscas:

1. Listagem paginada de pokémons:
  1.1 O endpoint paginado de pokemons deles só aceitam dois parâmetros de paginação, que são: `limit` e `offset`, com isso, utilizando a API deles para busca de pokémon só pode ser feita para um pokémon específico e utilizando um outro endpoint
  o que não é o comum de um endpoint paginado com buscas, ex: Poderia ter no próprio endpoint paginado de pokemon um parâmetro chamado `search` da seguinte forma: `endpoint/pokemon?limit=18&offset=0&search="bulba"`, dessa forma poderia trazer
  os pokemons com base no que foi digitado no search, seja nome, seja identificador, seja tipo do pokémon, habilidades. Então a busca por pokemon é utilizado de forma direta: Bulbassauro, mostra o Bulbassauro, caso for "Bulba", não encontra,
  o que acaba sendo bastante limitado para dados paginados. OBS: o endpoint de busca por pokemon também aceita busca pelo id.

2. O mesmo endpoint paginado citado acima, acaba não trazendo os dados necessários a serem apresentado de acordo com o figma, ele retorna dos pokemons apenas o nome e o endpoint de detalhes do mesmo, o que pode acarretar em uma possível sobrecarga
   do servidor devido ao retorno da requisição da listagem paginada dos pokemons, pois se retornar 18 pokémons, terá que buscar os dados de 18 pokemons, ou seja, fazendo um total de 19 requisições: Listagem paginada + detalhes dos 18 pokémons. Acredito que o melhor
   caminho para esse endpoint paginado seria trazer todos os dados do pokémon direto na requisição já paginada, pois seria um endpoint apenas, e não 19 no total.
  
