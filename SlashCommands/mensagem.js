const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");
const configs = require("../configs.js");
const Discord = require("discord.js");

module.exports = {
  name: "mensagem",
  description: "Envia uma mensagem.",
  type: 1,

  run: async (client, interaction, args) => {
    if (!configs.owners.includes(interaction.user.id)) {
      interaction.reply({
        content: `Você não possui permissão para utilizar este comando.`,
        ephemeral: true,
      });
    } else {
      let embed = new EmbedBuilder()

        .setTitle("VERIFY")
        .setColor("000000")
        .setDescription(`MENSAGEM PARA A EMBED`)
        .setImage("BANNER PARA EMBED");

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("✅ Verify")
          .setStyle(ButtonStyle.Link)
          .setURL(`${configs.authLink}`)
      );

      await interaction.channel.send({ embeds: [embed], components: [row] });
      interaction.reply({ content: "Mensagem enviada!", ephemeral: true });
    }
  },
};
