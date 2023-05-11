const db = require("orio.db");

module.exports = {
  name: "list",
  description: "See a list of all the repls you're pinging.",
  run: async (client, interaction) => {
    let x = db.get(`${interaction.user.id}`);

    // If user's ping queue is empty
    if (x === undefined || !x) {
      return interaction.reply({
        embeds: [
          {
            title: "Uh, oh!",
            description: "Your ping queue is empty.",
            color: 2829617,
          },
        ],
        ephemeral: true,
      });
    }

    let list = "";

    x.forEach((item) => {
      list += `• \`${item}\`\n`;
    });

    return interaction.reply({
      embeds: [
        {
          title: "Ping queue",
          description: `${list}`,
          color: 2829617,
        },
      ],
      ephemeral: true,
    });
  },
};
