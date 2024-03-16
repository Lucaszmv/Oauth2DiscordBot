const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const Discord = require("discord.js");
const configs = require("../configs.js");

module.exports = {
  name: "join",
  description: "Adiciona a quantidade escolhida de usuários ao servidor!",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "quantidade",
      description: "Escreva a quantidade de usuários que deseja adicionar",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction, args) => {
    if (!configs.owners.includes(interaction.user.id)) {
      interaction.reply({
        content: `Você não possui permissão para utilizar este comando.`,
        ephemeral: true,
      });
    } else {
      let quantidade = interaction.options.getString("quantidade");

      if (quantidade === 0) {
        interaction.reply("Você precisa adicionar um valor.");
        return;
      } else {
        fs.readFile("./object.json", async function (err, data) {
          if (err) {
            interaction.reply({
              content: "Erro ao ler o arquivo object.json",
              ephemeral: true,
            });
            return;
          }
          let json = JSON.parse(data);

          //let totalUsers = json.length;
          let addedUsers = 0;

          let error = 0;
          let success = 0;
          let already_joined = 0;

          let counter = 0;
          let quantidade = parseInt(
            interaction.options.getString("quantidade")
          );

          let embed1 = new EmbedBuilder()
            .setTitle("DASHBOARD")
            .setColor("000000")
            .setDescription(
              `\`⌛\`・Adicionando \`${addedUsers}\`/\`${quantidade}\` usuários...`
            );

          let msg = await interaction.channel.send({ embeds: [embed1] });
          interaction.reply({
            content: "Adicionar usuários ao servidor iniciado!",
            ephemeral: true,
          });

          for (const i of json) {
            const user = await client.users.fetch(i.userID).catch(() => {});
            if (interaction.guild.members.cache.get(i.userID)) {
              already_joined++;
            } else {
              await new Promise((resolve) => setTimeout(resolve, 700)); //Aguarda 700ms para adicionar o próximo usuário
              await interaction.guild.members
                .add(user, { accessToken: i.access_token })
                .then(() => {
                  success++;
                  addedUsers++;
                })
                .catch(() => {
                  error++;
                });
              addedUsers++;
              counter++;
              if (counter === quantidade) {
                break;
              }
              embed1.setDescription(
                `\`⌛\`・Adicionando \`${addedUsers}\`/\`${quantidade}\` usuários...`
              );
              msg.edit({ embeds: [embed1] });
            }
          }

          let embed2 = new EmbedBuilder()
            .setTitle("DASHBOARD")
            .setColor("000000").setDescription(`
          \`🟢\`・Sucesso: ${success}\n
          \`🔴\`・Erro: ${error}\n
          \`⚪\`・Já adicionados: ${already_joined}
          `);

          msg.edit({ embeds: [embed2] });
          setTimeout(() => {
            msg.delete();
          }, 10000);
        });
      }
    }
  },
};
