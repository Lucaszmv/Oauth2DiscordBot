# Oauth2 Discord Bot 🛡️

O Oauth2 Discord Bot é uma aplicação desenvolvida em Node.js que oferece funcionalidades relacionadas à autenticação Oauth2 e interação com servidores Discord. Ele permite que os usuários autentiquem suas contas Discord em um servidor específico e fornece recursos de gerenciamento de usuários e verificação de pontos.

## Funcionalidades Principais 🚀

- **Autenticação Oauth2:** O bot facilita o processo de autenticação Oauth2 para usuários, permitindo que autentiquem suas contas Discord em um servidor específico.
- **Verificação de Usuários:** Oferece funcionalidades para verificar usuários autenticados, armazenar suas informações e atribuir cargos ou privilégios com base em sua autenticação.
- **Resgate Automático de Itens:** O bot permite resgatar automaticamente itens para usuários autenticados, simplificando o processo de interação durante transmissões ao vivo.

## Pré-requisitos 📋

Antes de usar o Oauth2 Discord Bot, certifique-se de ter instalado:

- Node.js
- npm (Node Package Manager)
- Conta no Discord
- Servidor Discord para hospedar o bot
- Configurações de aplicativo e permissões de bot no Discord Developer Portal

## Instalação e Uso 🛠️

1. Clone o repositório para o seu ambiente local:

```sh
git clone https://github.com/Lucaszmv/Oauth2DiscordBot.git
```

2. Instale as dependências do projeto:

```sh
npm install
```

3. Configure o arquivo ```configs.js``` com suas credenciais e informações específicas do servidor Discord.

4. Execute o bot:

```sh
node index.js
```

5. Siga as instruções no console para configurar e usar o Oauth2 Discord Bot.

## Funcionamento Detalhado ⚙️

O bot consiste em uma série de comandos e interações definidos nos arquivos ```commands``` e ```events```. Aqui está uma visão geral dos comandos principais:

- ```/join```: Adiciona a quantidade escolhida de usuários ao servidor.
- ```/help```: Exibe uma lista de comandos disponíveis para os usuários.
- ```/links```: Fornece links úteis relacionados ao bot e à autenticação Oauth2.
- ```/mensagem```: Envie uma mensagem formatada com um botão de verificação para os usuários.
- ```/ping```: Mostra o ping do bot.
- ```/users```: Exibe quantos usuários estão armazenados no banco de dados do bot.
- ```/verify```: Verifica todos os usuários armazenados no banco de dados, permitindo a adição de usuários válidos.

## Configuração Personalizada ⚙️

Antes de executar o bot, é necessário configurar alguns parâmetros no arquivo ```configs.js```:

- ```token`: Token de autenticação do bot no Discord.
- ```client_id```, ```client_secret```, ```redirect_uri```: Credenciais para autenticação Oauth2.
- ```idserver```, ```idrole```: IDs do servidor Discord e do cargo a ser atribuído aos usuários verificados.
- ```webhook```, ```webhookBackup```: URLs dos webhooks para enviar informações do usuário e backup do arquivo ```object.json```.

## Contribuição 🤝

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests para melhorar o Oauth2 Discord Bot.

## Licença 📄

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para mais detalhes.

## Aviso Legal 📄

Este projeto é fornecido apenas para fins educacionais e de demonstração. Não nos responsabilizamos pelo uso indevido do bot ou por quaisquer danos decorrentes de seu uso. Certifique-se de cumprir os termos de serviço do Discord e de outras plataformas envolvidas.
