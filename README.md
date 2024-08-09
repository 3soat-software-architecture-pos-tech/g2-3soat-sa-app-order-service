# PÓS-TECH SOAT3 TECH CHALLENGE

API Sistema de pedidos 'Totem de autoatendimento'

## Setup Local

Para configurar a aplicação em ambiente local

```bash
$ npm install
```

Executar localmente
```bash
$ npm run dev
```

Gerar documentacao swagger
```bash
$ npm run docs
```

### Setup testes

Para rodar todos os testes localmente, você pode executar o comando
```bash
$ npm run tests
```

Para rodar um teste específico, você pode executar o comando
```bash
$ npm run test <caminho-do-teste>
```

## Tech challenge Fase 4

### Desenho da arquitetura de microsserviços

   ![TECH CHALLENGE](https://github.com/3soat-software-architecture-pos-tech/g2-3soat-sa-app-order-service/assets/23316988/fda2a4d0-a26a-47da-bae3-ff784e12b1b3)

### Collection:

	Swagger UI: http://localhost/docs

### Guia completo com todas as instruções para execução do projeto e a ordem de execução das APIs, caso seja necessário.

#### API's:

Nosso banco de dados já está populado, no entanto, caso deseje criar novos registros:
- os produtos a serem adicionados no pedido precisam existir na API produtos;
- os clientes relacionados a pedidos precisam existir na api de usuarios / clientes

- Criar pedido associado à cliente e produto


### Justificativa para o padrão SAGA

Foi utilizado o padrão Saga coreografado com ações compensatórias para realizar comunição entre os serviços de modo que seja possível trocar informações entre os serviços de maneira simples, eficaz e direta sem nenhuma dependência além das proprias filas para que ambos possam funcionar independentemente. Em casos onde as notificações processadas não tenham o resultado esperado durante a execução das tarefas, ações compensatórias predefinidas são disparadas para notificar que o evento não ocorreu para que se possa desfazer as alterações realizadas.

Miro Documentação [Documentação](https://miro.com/app/board/uXjVNyWqWyk=/)

### Relatório OWASP ZAP

[Pre relatório](documentacao/reports/ZAP_Scanning_Report-Pre.pdf)

[Pos relatório](documentacao/reports/ZAP_Scanning_Report-Pre.pdf)




## Materias de Referência
- Alura: [Node js testes unitários e de integração](https://cursos.alura.com.br/course/nodejs-testes-unitarios-integracao)
- Alura: [Node js API Rest com Express e MongoDB](https://cursos.alura.com.br/course/nodejs-api-rest-express-mongodb)
- Alura: [O que é Behavior-Driven Development (BDD)](https://cursos.alura.com.br/extra/alura-mais/o-que-e-behavior-driven-development-bdd--c284)
- Jest: [Documentation](https://jestjs.io/)
- ESLint : [Documentation](https://pt-br.eslint.org/)
- Sonar Cloud: [Documentation](https://docs.sonarsource.com/sonarcloud/)

## Team
 - Turma: 3SOAT
 - Grupo: 2

   [André Felipe](andrefelipegodoi@gmail.com)
   
   [Bruna Carlota](brunacarlota@gmail.com)

   [Carlos Tofoli](henrique.tofoli@hotmail.com)

   [Guilherme Oliveira](guilherme.oliveira182@yahoo.com.br)

   [Valdeir Jesus](valdeir_014@hotmail.com)
