const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const axios = require("axios");
const configs = require("../configs.js");
const Discord = require("discord.js");

module.exports = {
  name: "verify",
  description: "Verifica todos os usuários do DB",

  run: async (client, interaction, args) => {
    if (!configs.owners.includes(interaction.user.id)) {
      interaction.reply({
        content: `Você não possui permissão para utilizar este comando.`,
        ephemeral: true,
      });
    } else {
      fs.readFile("./object.json", async function (err, data) {
        if (err) {
          console.log("Erro ao ler o arquivo object.json");
          return;
        }

        let json = JSON.parse(data);
        let totalUsers = json.length;

        let validUsers = [];

        let invalidos = 0;
        let verificando = 0;

        let embed1 = new EmbedBuilder()
          .setTitle("DASHBOARD")
          .setColor("000000")
          .setDescription(
            `\`⌛\`・Verificando \`${verificando}\`/\`${totalUsers}\` usuários...`
          );

        let msg = await interaction.channel.send({ embeds: [embed1] });
        interaction.reply({
          content: "Verificar usuários iniciado!",
          ephemeral: true,
        });

        for (const i of json) {
          if (i.access_token && i.access_token !== "") {
            await new Promise((resolve) => setTimeout(resolve, 500));
            try {
              const response = await axios.get(
                "https://discord.com/api/v6/users/@me",
                {
                  headers: {
                    Authorization: `Bearer ${i.access_token}`,
                  },
                }
              );
              if (response.status === 200) {
                validUsers.push(i);
              }
            } catch (err) {
              if (err.response.status === 403 || err.response.status === 401) {
                invalidos++;
              } else if (err.response.status === 401) {
                try {
                  const response = await axios.post(
                    "https://discord.com/api/v6/oauth2/token/refresh",
                    {
                      headers: {
                        Authorization: `Bearer ${i.refresh_token}`,
                      },
                    }
                  );
                  if (response.status === 200) {
                    validUsers.push(i);
                  }
                } catch (err) {
                  if (
                    err.response.status === 403 ||
                    err.response.status === 401
                  ) {
                    invalidos++;
                  }
                }
              }
            }
          }
          verificando++;

          if (verificando % 10 === 0) {
            // se o número de verificações atual é múltiplo de 10, atualize a mensagem com o número atual de usuários verificados
            embed1.setDescription(
              `\`⌛\`・Verificando \`${verificando}\`/\`${totalUsers}\` usuários...`
            );
            msg.edit({ embeds: [embed1] });
          }
        }

        let embed2 = new EmbedBuilder().setTitle("DASHBOARD").setColor("000000")
          .setDescription(`
    \`🟢\`・Válidos: \`${validUsers.length}\`
    \`🔴\`・Inválidos: \`${invalidos}\`\n
    ・Deseja adicionar os usuários válidos ao DB?
    `);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Sim")
            .setCustomId("yes")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setLabel("Não")
            .setCustomId("no")
            .setStyle(ButtonStyle.Danger)
        );

        await msg.edit({ embeds: [embed2], components: [row] }).then((msg) => {
          let filtro_1 = (m) => m.customId === "yes";

          let coletor_1 = msg.createMessageComponentCollector({
            filter: filtro_1,
            max: 1,
          });

          let filtro_2 = (m) => m.customId === "no";
          let coletor_2 = msg.createMessageComponentCollector({
            filter: filtro_2,
            max: 1,
          });

          coletor_1.on("collect", async () => {
            fs.writeFile(
              "./validos.json",
              JSON.stringify(validUsers, null, 1),
              (err) => {
                if (err) throw err;
                console.log("[BOT] Arquivo salvo com os tokens válidos!");
                msg.delete();
                coletor_1.stop();
                coletor_2.stop();
              }
            );
          });

          coletor_2.on("collect", async () => {
            msg.delete();
            coletor_1.stop();
            coletor_2.stop();
          });
        });
      });
    }
  },
};
