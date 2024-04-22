## Stock Wise - API

Este projeto consiste num sistema de gestão de estoque domiciliar onde o usuário será capaz de gerir os produtos que possui em casa, podendo manter assim um controle estável do que está em quase em falta em casa. Ao mesmo tempo o sistema consta com um algoritmo que é capaz de gerar listas de compras automáticas com base na quantidade mínima aceita em estoque de determinado produto, possibilitando assim o usuário gerar listas de compras com exatamente o que está em em risco de ficar em falta, tornado todo o processo mais simples e automático. E por cima de tudo isso o sistema também constará com um log do preço pago por cada produto nas compras feitas, dessa forma tornando possível o usuário saber quanto foi pago no produto na compra anterior, possibilitando assim uma consciência economica ao usuário, que por sua vez buscará um preço mais barato e evitará gastar mais do que foi gasto na compra anterior.

### 1. Tecnologias

* NodeJS;
* Zod;
* Fastfiy;
* NodeMailer;
* PrismaORM;
* Typescript;
* ESlint.


## 2. Requisitos

### 2.1 RFs

* [X] Deve ser possível autenticar usuários no sistema
* [ ] Deve ser possível deletar uma conta
* [X] Deve ser possível criar um estoque
* [X] Deve ser possível Adicionar um produto a um estoque
* [X] Deve ser poissível remover um produto de um estoque
* [X] Deve ser possível deletar um produto de um estoque
* [X] Deve ser possível cadastrar um produto
* [X] Deve ser possível editar um produto
* [ ] Deve ser possível deletar um produto
* [ ] Deve ser possível visualizar detalhes do produto
* [X] Deve ser possível ver um log do preço do produto
* [ ] Deve ser possível cadastrar uma marca
* [ ] Deve ser possível editar uma marca
* [ ] Deve ser possível deletar uma marca
* [ ] Deve ser possível visualizar detalhes de uma marca
* [X] Deve ser possível cadastrar unidades de medida
* [ ] Deve ser possível editar unidades de medida
* [ ] Deve ser possível deletar unidades de medida
* [ ] Deve ser possível visualizar detalhes de unidades de medida
* [X] Deve ser possível criar tipos para os produtos
* [ ] Deve ser possível editar os tipos dos produtos
* [ ] Deve ser possível deletar os tipos dos produtos
* [ ] Deve ser possível visualizar os tipos dos produtos
* [X] Deve ser possível criar listas de compras manualmente
* [X] Deve ser possível criar listas de compras automaticamente
* [X] Deve ser poissível adicionar um produto a uma lista de compras
* [X] Deve ser poissível remover um produto de uma lista de compras
* [ ] Deve ser possível deletar listas de compras
* [X] Deve ser possível completar listas de compras

### 2.2 RNs

* [X] Não deve ser possível existir dois usuários com o mesmo email
* [X] Usuários não podem ter mais de um estoque
* [X] Não podem existir dois produtos com o mesmo nome da mesma marca vinculados no mesmo usuário
* [ ] Não podem existir duas marcas com o mesmo nome vinculadas ao mesmo usuário
* [X] Não podem existir dois tipos de produto com o mesmo nome vinculadas ao mesmo usuário
* [X] Não podem existir duas unidades de medida com o mesmo nome vinculadas ao mesmo usuário
* [X] Usuários só podem executar ações de CRUD com as entidades que foram criadas por eles mesmos
* [X] Ao completar uma lista de compras o estoque deve ser editado automaticamente adicionando os novos números
* [X] Um novo log de preço de produtos deve ser criado assim que uma lista de compras for completada

### 2.3 RNFs

* [ ] Antes de cada deleção uma confirmação deve ser mostrada
* [ ] As imagens dos produtos devem possuir um tamanho máximo de 100x100px
* [X] O nome de: categorias, tipos de produto e marcas devem ser normalizados para suas versões com as iniciais maiúsculas e separados por hífen
* [X] O nome das unidades de medida devem ser em caixa alta


## 3. Escopo

* **Escopo atual**
  * **Requisitos funcionais**
    * [X] Deve ser possível autenticar usuários no sistema
    * [ ] Deve ser possível deletar uma conta
    * [X] Deve ser possível criar um estoque
    * [X] Deve ser possível adicionar um produto num estoque
    * [X] Deve ser possível remover um produto de um estoque
    * [X] Deve ser possível deletar um produto de um estoque
    * [X] Deve ser possível cadastrar um produto
    * [X] Deve ser possível editar um produto
    * [ ] Deve ser possível deletar um produto
    * [X] Deve ser possível ver um log do preço do produto
    * [X] Deve ser possível cadastrar unidades de medida
    * [ ] Deve ser possível editar unidades de medida
    * [ ] Deve ser possível deletar unidades de medida
    * [X] Deve ser possível criar tipos para os produtos
    * [ ] Deve ser possível editar os tipos dos produtos
    * [ ] Deve ser possível deletar os tipos dos produtos
    * [X] Deve ser possível criar listas de compras manualmente
    * [X] Deve ser possível adicionar produtos nas listas de compras
    * [X] Deve ser possível remover produtos das listas de compras
    * [X] Deve ser possível criar listas de compras automaticamente
    * [ ] Deve ser possível deletar listas de compras
    * [X] Deve ser possível completar listas de compras
    * [X] Deve ser possível imprimir listas de compras

  * **Regras de negócio**
    * [X] Não deve ser possível existir dois usuários com o mesmo email
    * [X] Usuários não podem ter mais de um estoque
    * [X] Não podem exisitr dois produtos com o mesmo nome vinculados no mesmo usuário
    * [X] Não podem existir dois tipos de produto com o mesmo nome vinculadas ao mesmo usuário
    * [X] Não podem existir duas unidades de medida com o mesmo nome vinculadas ao mesmo usuário
    * [X] Usuários só podem executar ações de CRUD com as entidades que foram criadas por eles mesmos
    * [X] Ao completar uma lista de compras o estoque deve ser editado automaticamente adicionando os novos números
    * [X] Um novo log de preço de produtos deve ser criado assim que uma lista de compras for completada

  * **Requisitos não funcionais**
    * [ ] Antes de cada deleção uma confirmação deve ser mostrada
    * [X] O nome de: categorias, tipos de produto e marcas devem ser normalizados para suas versões com as iniciais maiúsculas e separados por hífen
    * [X] O nome das unidades de medida devem ser em caixa alta

  * **Módulos**
    * [X] **Autenticação**
      * [X] Envio de email
      * [X] Autenticação usando cookie
      * [X] Token de confirmação no email

    * [ ] **Estoque do usuário**
      * [X] Cadastro
      * [ ] Deleção da conta

    * [ ] **Produtos**
      * [X] Cadastro
      * [X] Edição dos dados
      * [ ] Deleção

    * [ ] **Unidade de medida**
      * [X] Cadastro
      * [ ] Edição dos dados
      * [ ] Deleção

    * [ ] **Tipo de produto**

      * [X] Cadastro
      * [ ] Edição dos dados
      * [ ] Deleção

    * [ ] **Lista de compras**
      * [X] Cadastro manual
      * [X] Cadastro automático
      * [ ] Deleção

      * [X] **Completar uma lista**
        * [X] Atualização do preço dos produtos
        * [X] Adição da quantidade no estoque

    * [ ] **Documentação**
      * [ ] Gerar ((20240422090709-rxf8530 "README")) para a aplicação;
      * [ ] Documentar ((20240413000747-tx6eb8u "API"));
      * [ ] Organizar o código um pouco melhor;

* **Não escopo**

  * **Requisitos funcionais**
    * [ ] Deve ser possível visualizar detalhes do produto
    * [ ] Deve ser possível ver um log do preço do produto
    * [ ] Deve ser possível cadastrar uma marca
    * [ ] Deve ser possível editar uma marca
    * [ ] Deve ser possível deletar uma marca
    * [ ] Deve ser possível visualizar detalhes de uma marca
    * [ ] Deve ser possível visualizar detalhes de unidades de medida
    * [ ] Deve ser possível visualizar os tipos dos produtos
    * [ ] Deve ser possível visualizar um gráfico informativo

  * **Regras de negócio**
    * [ ] Não podem exisitr dois produtos com o mesmo nome da mesma marca vinculados no mesmo usuário
    * [ ] Não podem existir duas marcas com o mesmo nome vinculadas ao mesmo usuário

  * ***Requisitos não funcionais***

## 4. Implementações futuras

* Refatorar a seleção do preço do produto na hora de imprimir a lista de compras, a atual aproach usada é muito custosa para o futuro pois todos os registros de preço são coletados e então apenas um deles é usado na hora de imprimir a lista de compras, gerando assim uma busca de vários dados desnecessários.
* Adicionar a possibilidade de fazer upload de imagens dos produtos.
* Adicionar marcas para os produtos.
* Adicionar imagem para as marcas dos produtos.
* Adicionar um status aos produtos no estoque com base na quantidade mínima aceita e na quantidade que atualmente está presente no estoque. O status pode ser atualizado sempre que o produto for adicionado ou tiver uma quantidade dele removida ou adicionada.
* Refatorar toda a organização da API e aplicar os princípios de SOLID.
