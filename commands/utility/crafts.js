const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { crafts } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crafteos")
    .setDescription("Sends a web page with all minecraft crafts."),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0xffffff)
      .setTitle("Crafteos Minecraft")
      .setDescription(`Las recetas de minecraft estan disponibles aquí:`)
      .addFields({ name: "", value: crafts })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
