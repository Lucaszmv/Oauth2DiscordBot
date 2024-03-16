const { EmbedBuilder } = require("discord.js");
const configs = require("../configs.js");
const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "Veja meus comandos.",
  type: 1,

  run: async (client, interaction, args) => {
    if (!configs.owners.includes(interaction.user.id)) {
      interaction.reply({
        content: `Você não possui permissão para utilizar este comando.`,
        ephemeral: true,
      });
    } else {
      let embed = new EmbedBuilder()

        .setTitle("Oauth2 Dashboard")
        .setColor("000000")
        .setDescription(
          `● **Oauth2: **\`join\`, \`Users\`, \`Links\`, \`mensagem\``
        );

      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
