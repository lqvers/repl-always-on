const config = require("../config.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { ActivityType } = require('discord.js')
const zello = require('zello')

module.exports = async (client) => {
  zello.info(`${client.user.tag} is ready!`);

  client.user.setActivity(config.Presence.Activity, { type: ActivityType.Watching });

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: await client.commands,
    });
    
    zello.success(`Loaded application commands!`)
  } catch (e) {
    zello.error(`Failed to load application commands`)
  }
};