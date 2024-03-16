const fs = require("fs"); // Adicionando a importação do módulo fs
const { EmbedBuilder } = require("discord.js");
const configs = require("../configs.js");
const Discord = require("discord.js");

module.exports = {
  name: "users",
  description: "Veja quantos usuários tenho no DB.",
  type: 1,

  run: async (client, interaction, args) => {
    if (!configs.owners.includes(interaction.user.id)) {
      interaction.reply({
        content: `Você não possui permissão para utilizar este comando.`,
        ephemeral: true,
      });
    } else {
      fs.readFile("./object.json", async function (err, data) {
        // Alterando o nome do argumento
        let users = JSON.parse(data); // lendo o objeto json e armazenando em users
        let embed = new EmbedBuilder()
          .setTitle("OAUTH DASHBOARD")
          .setColor("000000")
          .setDescription(
            `● Temos ${
              users.length > 1
                ? `\`${users.length}\` usuários`
                : `\`${users.length}\` usuários no bot`
            }\n● Digite o comando \`links\` para verificar seu link OAuth2`
          );
        interaction.reply({ embeds: [embed], ephemeral: true });
      });
    }
  },
};
