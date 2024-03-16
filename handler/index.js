const fs = require("fs")

module.exports = async (client) => {

const SlashsArray = []

  fs.readdir(`./SlashCommands`, (error, folder) => {
fs.readdir(`./SlashCommands/`, (error, files) => { 
  files.forEach(files => {
      
  if(!files?.endsWith('.js')) return;
  files = require(`../SlashCommands/${files}`);
  if(!files?.name) return;
  client.slashCommands.set(files?.name, files);
   
  SlashsArray.push(files)
  });
    });

});
  client.on("ready", async () => {
  client.guilds.cache.forEach(guild => guild.commands.set(SlashsArray))
    });
};