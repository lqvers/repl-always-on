// Load environment variables from .env file
require("dotenv").config();

// Import required modules
const { Client, GatewayIntentBits } = require("discord.js");
const { readdir } = require("node:fs");
const axios = require("axios");
const db = require("orio.db");
const path = require("path");

const zello = require("zello");
// Create a new Discord bot client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Initialize an empty array to store commands
client.commands = [];

// Function to ping websites and log their status
function pingWebsites() {
  // Check if there are any saved repls in the database
  if (db.get("repls") !== undefined) {
    // For each repl, send an HTTP GET request
    db.get("repls").forEach((x) => {
      axios
        .get("https://" + x)
        .then((response) => {
          // Log the status of the website (up or down)
          zello.info(`${x} is ${response.status === 200 ? "up" : "down"}.`);
        })
        .catch((error) => {
          // Log any errors encountered while pinging the website
          zello.error(`${x}: ${error.message}`);
        });
    });
  }
}

// Ping websites initially
pingWebsites();

// Set an interval to ping websites every 10 seconds (10000 milliseconds)
setInterval(() => {
  pingWebsites();
}, 10000);

// Read and load event files from the "./src/events" directory
readdir("./src/events", async (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (!file.endsWith(".js")) return;

    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];

    // Bind the event to the client
    client.on(eventName, event.bind(null, client));
    zello.success(`Event: ${eventName}`);

    // Clear the require cache for the event file
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

// Read and load command files from the "./src/commands" directory
readdir("./src/commands", (err, files) => {
  if (err) throw err;
  files.forEach(async (f) => {
    try {
      let cmd = require(`./commands/${f}`);
      // Add the command to the client.commands array
      client.commands.push({
        name: cmd.name,
        description: cmd.description,
        options: cmd.options,
      });

      zello.success(`Command: ${cmd.name}`);
    } catch (err) {
      zello.error(`Command: ${cmd.name}`);
    }
  });
});

// Log in the bot using the TOKEN environment variable
client.login(process.env.TOKEN).catch((e) => {
  zello.error(e);
});
