
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ip } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ip")
    .setDescription("Sends the server IP."),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Server IP')
      .setDescription(`La IP del servidor es: **${ip}**`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}` });

    await interaction.reply({ embeds: [embed] });
  },
};
