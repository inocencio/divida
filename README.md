## Debt

Debt é um simples exemplo de implementação de uma REST API que tem como camada de front-end páginas criadas via [Vue.js](https://vuejs.org/).

Essa aplicação consiste em duas partes:

- Node.js Express REST API - solução back-end
- Node.js Vue -> solução front-end

Para conseguir executar a aplicação, pode-se seguir o processo via **Docker** ou um processo manual.

### Pre-requisitos

Verifique se você tem o **Docker** e o **Docker Compose** instalados.

Instruções para instalar o **Docker** no [Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/), [Windows](https://docs.docker.com/docker-for-windows/install/), [Mac](https://docs.docker.com/docker-for-mac/install/).

**Docker Compose** já vem incluso para *Windows* e *Mac*, para Ubuntu é necessário seguir [essas instruções](https://docs.docker.com/compose/install/).

### Executando com o Docker

A aplicação inteira pode ser executada com apenas um único comando em um terminal:

```
$ docker-compose up -d --build
```

O comando acima irá criar as imagens necessárias, preparar os contâiners e executá-los em modo desacoplado (detach). O comando abaixo é necessário para parar à execução da aplicação.

```
$ docker-compose down
```
Usualmente a parte back-end tá mapeada para a porta 3000, ao passo que o front-end tá mapeado para a porta 8080, podendo, portanto, ser acessádo por navegado vai http://localhost:8080.

Você pode remapear as aplicações para as portas desejadas desde que assim o faça via Dockerfile.

### Executando a aplicação diretamente via NPM

Esse processo não irá precissar do **Docker** e do **Docker Compose**.

Se certifique de ter o **Node.JS** v12.10+ e o **NPM** v6.14+ devidamente instalados.

Vá até a pasta `backend`e execute:

```
$ npm install
```

Uma vez instalado, proceda com:

```
$ npm run dev
```

Numa outra instância de terminal, entre na pasta `frontend` e execute:

```
$ npm install
```

É necessário instalar o CLI do Vue globalmente:

```
$ npm install @vue/cli -g
```

Uma vez com tudo instalado, agora execute:

```
$ npm run serve
```

Ambas as aplicações devem estar nesse momento sendo executandas nas portas 3000 (back-end) e 8080 (front-end). Pode acessar o site pela http://localhost:8080

Os arquivos `package.json` de cada uma das pastas raízes das aplicações têm instruções extras de execução, caso você sinta necessidade de usá-las.

### Screenshots

Mostrando a lista de Dívidas apresentando Nome do usuário e o Valor da Dívida.

![first screen](https://github.com/inocencio/divida/blob/main/screens/01.png)

Criação de uma Dívida.

![login screen](https://github.com/inocencio/divida/blob/main/screens/02.png)

Alteração de uma Dívida.

![login screen](https://github.com/inocencio/divida/blob/main/screens/03.png)

Alteração de uma Dívida com validação de dados.

![a new product with discount](https://github.com/inocencio/divida/blob/main/screens/04.png)