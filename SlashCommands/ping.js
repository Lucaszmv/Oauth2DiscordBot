const { EmbedBuilder } = require("discord.js");
const configs = require("../configs.js");
const Discord = require("discord.js");

module.exports = {
  name: "ping",
  description: "Veja meu ping.",
  type: 1,

  run: async (client, interaction, args) => {
    if (!configs.owners.includes(interaction.user.id)) {
      interaction.reply({
        content: `Você não possui permissão para utilizar este comando.`,
        ephemeral: true,
      });
    } else {
      try {
        let embed = new EmbedBuilder()
          .setColor("000000")
          .setDescription(`\`📡\` Meu ping está em \`${client.ws.ping}\` ms.`);

        interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        console.error(error);
      }
    }
  },
};
