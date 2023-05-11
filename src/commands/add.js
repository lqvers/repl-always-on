const db = require("orio.db");

module.exports = {
  name: "add",
  description: "Add a repl to your ping queue",
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
    if (x.includes(repl)) {
      return interaction.reply({
        embeds: [
          {
            title: "Uh, oh!",
            description:
              "It appears that this repl is already in your ping queue!",
            color: 2829617,
          },
        ],
        ephemeral: true,
      });
    }

    // If user has reached repl limit
    if (db.get(`${interaction.user.id}`).length > 10) {
      return interaction.reply({
        embeds: [
          {
            title: "Uh, oh!",
            description:
              "It appears that you've reached your repl limit! If you'd like to ping more repl's please remove a few from your ping queue!",
            color: 2829617,
          },
        ],
        ephemeral: true,
      });
    }

    // If all checks are passed
    db.unpush(`${interaction.user.id}`, 'REMOVE')

    db.push(`repls`, repl);
    db.push(interaction.user.id, repl);

    return interaction.reply({
      embeds: [
        {
          title: "Repl added to ping queue!",
          description: `You've successfully added **${repl}** to your ping queue!`,
          color: 2829617,
        },
      ],
      ephemeral: true,
    });
  },
};
