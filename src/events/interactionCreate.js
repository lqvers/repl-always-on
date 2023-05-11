const { InteractionType } = require("discord.js");
const { readdir } = require("node:fs");
const zello = require("zello");

module.exports = async (client, interaction) => {
  if (interaction.user.bot) return;

  if (interaction.type === InteractionType.ApplicationCommand) {
    readdir("./src/commands", (err, files) => {
      if (err) throw err;
      files.forEach(async (f) => {
        let props = require(`../commands/${f}`);
        if (
          interaction.commandName.toLowerCase() === props.name.toLowerCase()
        ) {
          try {
            return props.run(client, interaction);
          } catch (e) {

            zello.eror(e)
            require('../error.js')(e)

            return interaction
              .reply({
                content: 'Error',
                ephemeral: true
              })
              .catch((e) => {});
          }
        }
      });
    });
  }
};