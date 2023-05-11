const db = require("orio.db");

module.exports = {
  name: "remove",
  description: "Remove a repl from your ping queue",
  options: [
    {
      name: "repl",
      description: "Url to the repl (ex. foo.bar.repl.co)",
      type: 3,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const repl = interaction.options.getString("repl");
    let x = db.get(`${interaction.user.id}`);

    // If user's ping queue is empty
    if(x === undefined || !x) {
      db.push(`${interaction.user.id}`, "REMOVE")
      x = db.get(`${interaction.user.id}`);
    }

    // If user input non-repl url
    if (!repl.includes("repl.co")) {
      return interaction.reply({
        embeds: [
          {
            title: "Uh, oh!",
            description: "It appears that you didn't input a valid repl url!",
            color: 2829617,
          },
        ],
        ephemeral: true,
      });
    }

    // If repl is already in users ping queue
    if (!x.includes(repl)) {
      return interaction.reply({
        embeds: [
          {
            title: "Uh, oh!",
            description:
              "It appears that this repl isn't in your ping queue!",
            color: 2829617,
          },
        ],
        ephemeral: true,
      });
    }

    // If all checks are passed
    db.unpush(`${interaction.user.id}`, repl)
    db.unpush(`repls`, repl)

    return interaction.reply({
      embeds: [
        {
          title: "Repl deleted from your ping queue!",
          description: `You've successfully removed **${repl}** from your ping queue!`,
          color: 2829617,
        },
      ],
      ephemeral: true,
    });
  },
};
